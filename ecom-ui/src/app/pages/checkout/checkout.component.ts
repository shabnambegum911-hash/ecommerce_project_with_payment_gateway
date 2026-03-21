import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';

import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <h2 class="fw-bold mb-4">💳 Checkout</h2>

      <div class="row g-4">

        <!-- 🧾 Order Summary -->
        <div class="col-md-5">
          <div class="card shadow-sm p-3">
            <h5 class="mb-3">Order Summary</h5>

            <div class="d-flex justify-content-between">
              <span>Items</span>
              <span>{{ itemCount }}</span>
            </div>

            <div class="d-flex justify-content-between mt-2">
              <span>Total</span>
              <strong class="text-success">
                {{ totalAmount | currency:'INR' }}
              </strong>
            </div>
          </div>
        </div>

        <!-- 💳 Payment -->
        <div class="col-md-7">
          <div class="card shadow-sm p-4">
            <h5 class="mb-3">Payment Details</h5>

            <form (ngSubmit)="processPayment()" #form="ngForm">

              <div class="mb-3">
                <label>Email</label>
                <input 
                  type="email"
                  class="form-control"
                  [(ngModel)]="paymentData.email"
                  name="email"
                  required>
              </div>

              <div class="mb-3">
                <label>Cardholder Name</label>
                <input 
                  type="text"
                  class="form-control"
                  [(ngModel)]="paymentData.cardName"
                  name="cardName"
                  required>
              </div>

              <div class="mb-3">
                <label>Currency</label>
                <select 
                  class="form-select"
                  [(ngModel)]="paymentData.currency"
                  name="currency">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <!-- 💡 Test Card -->
              <div class="alert alert-light border">
                <small>
                  <strong>Test Card:</strong> 4242 4242 4242 4242<br>
                  Exp: 12/25 | CVC: 123
                </small>
              </div>

              <!-- ❌ Error -->
              <div *ngIf="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <!-- ✅ Success -->
              <div *ngIf="successMessage" class="alert alert-success">
                {{ successMessage }}
              </div>

              <!-- 💰 Pay Button -->
              <button 
                type="submit"
                class="btn btn-success w-100 mt-2"
                [disabled]="processing || form.invalid">

                <span *ngIf="!processing">
                  Pay {{ totalAmount | currency:'INR' }}
                </span>

                <span *ngIf="processing">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Processing...
                </span>

              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 12px;
    }
  `]
})
export class CheckoutComponent implements OnInit {

  totalAmount = 0;
  itemCount = 0;
  userId = 0;

  processing = false;
  errorMessage = '';
  successMessage = '';

  paymentData = {
    email: '',
    cardName: '',
    currency: 'INR'
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.id || 0;
      this.loadCartSummary();
    }
  }

  loadCartSummary(): void {
    this.cartService.getCart(this.userId).subscribe({
      next: (cart: any) => {
        this.totalAmount = cart?.totalPrice || 0;
        this.itemCount = cart?.items?.length || 0;
      },
      error: (err) => console.error('Error loading cart:', err)
    });
  }

  // 🚀 CLEAN FLOW (No nested subscribe hell)
  processPayment(): void {

    if (!this.paymentData.email || !this.paymentData.cardName) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    this.processing = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.getCart(this.userId).pipe(

      // 🧾 Create Order
      switchMap((cart: any) =>
        this.orderService.createOrder(this.userId, cart.items)
      ),

      // 💳 Create Payment Intent
      switchMap((order: any) => {
        const paymentRequest = {
          orderId: order.id,
          amount: this.totalAmount,
          currency: this.paymentData.currency,
          description: `Order #${order.id}`,
          customerEmail: this.paymentData.email,
          paymentMethod: 'CARD'
        };

        return this.paymentService.createStripeIntent(paymentRequest);
      })

    ).subscribe({

      next: (response: any) => {
        this.successMessage = '✅ Payment initiated successfully!';
        this.processing = false;

        setTimeout(() => {
          window.location.href = '/orders';
        }, 2000);
      },

      error: (err) => {
        this.errorMessage = err?.error?.message || 'Something went wrong';
        this.processing = false;
      }
    });
  }
}