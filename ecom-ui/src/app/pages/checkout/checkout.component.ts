import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxStripeModule } from '@ngx-stripe/ngx-stripe';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h1>Checkout</h1>

      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>Order Summary</h5>
            </div>
            <div class="card-body">
              <p><strong>Total Amount:</strong> \${{ totalAmount }}</p>
              <p><strong>Items:</strong> {{ itemCount }}</p>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>Payment Information</h5>
            </div>
            <div class="card-body">
              <form (ngSubmit)="processPayment()">
                <div class="mb-3">
                  <label for="email">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email"
                    [(ngModel)]="paymentData.email"
                    name="email"
                    required>
                </div>

                <div class="mb-3">
                  <label for="cardName">Cardholder Name</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="cardName"
                    [(ngModel)]="paymentData.cardName"
                    name="cardName"
                    required>
                </div>

                <div class="mb-3">
                  <label for="currency">Currency</label>
                  <select 
                    class="form-select" 
                    id="currency"
                    [(ngModel)]="paymentData.currency"
                    name="currency">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>

                <div class="alert alert-info">
                  <p><strong>Test Card:</strong> 4242 4242 4242 4242</p>
                  <p><strong>Expiry:</strong> 12/25</p>
                  <p><strong>CVC:</strong> 123</p>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-success w-100"
                  [disabled]="processing">
                  <span *ngIf="!processing">Pay \${{ totalAmount }}</span>
                  <span *ngIf="processing">
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </span>
                </button>
              </form>

              <div *ngIf="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>

              <div *ngIf="successMessage" class="alert alert-success mt-3">
                {{ successMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
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
    currency: 'USD'
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
      next: (cart) => {
        this.totalAmount = cart.totalPrice;
        this.itemCount = cart.items.length;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      }
    });
  }

  processPayment(): void {
    if (!this.paymentData.email || !this.paymentData.cardName) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.processing = true;
    this.errorMessage = '';

    // Create order first
    this.cartService.getCart(this.userId).subscribe({
      next: (cart) => {
        const order = this.orderService.createOrder(this.userId, cart.items).subscribe({
          next: (createdOrder) => {
            // Create payment intent
            const paymentRequest = {
              orderId: createdOrder.id,
              amount: this.totalAmount,
              currency: this.paymentData.currency,
              description: `Order #${createdOrder.id}`,
              customerEmail: this.paymentData.email,
              paymentMethod: 'CARD'
            };

            this.paymentService.createStripeIntent(paymentRequest).subscribe({
              next: (response) => {
                this.successMessage = `Order created successfully! Payment Intent: ${response.paymentIntentId}`;
                this.processing = false;
                
                // Redirect to order confirmation after 3 seconds
                setTimeout(() => {
                  window.location.href = `/orders`;
                }, 3000);
              },
              error: (error) => {
                this.errorMessage = 'Payment processing failed: ' + (error.error?.message || 'Unknown error');
                this.processing = false;
              }
            });
          },
          error: (error) => {
            this.errorMessage = 'Error creating order: ' + (error.error?.message || 'Unknown error');
            this.processing = false;
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Error loading cart: ' + (error.error?.message || 'Unknown error');
        this.processing = false;
      }
    });
  }
}
