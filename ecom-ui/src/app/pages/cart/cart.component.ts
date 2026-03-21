import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Cart, CartItem } from '../../models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-4">
      <h2 class="mb-4 fw-bold">🛒 Shopping Cart</h2>

      <!-- 🔄 Loader -->
      <div *ngIf="loading" class="text-center my-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <!-- 🧾 Cart Items -->
      <div *ngIf="!loading && cart?.items?.length">

        <div class="card shadow-sm mb-3 p-3" *ngFor="let item of cart.items">
          <div class="row align-items-center">

            <div class="col-md-3">
              <strong>Product #{{ item.productId }}</strong>
            </div>

            <div class="col-md-3 text-muted">
              Price: {{ item.price | currency:'INR' }}
            </div>

            <!-- 🔢 Quantity Controls -->
            <div class="col-md-3 d-flex align-items-center gap-2">
              <button 
                class="btn btn-outline-secondary btn-sm"
                (click)="changeQty(item, -1)"
                [disabled]="item.quantity <= 1 || loading">
                -
              </button>

              <span class="fw-bold">{{ item.quantity }}</span>

              <button 
                class="btn btn-outline-secondary btn-sm"
                (click)="changeQty(item, 1)"
                [disabled]="loading">
                +
              </button>
            </div>

            <div class="col-md-2 fw-semibold text-success">
              {{ (item.price * item.quantity) | currency:'INR' }}
            </div>

            <div class="col-md-1 text-end">
              <button 
                class="btn btn-sm btn-danger"
                (click)="removeItem(item.productId)"
                [disabled]="loading">
                ✕
              </button>
            </div>

          </div>
        </div>

        <!-- 💳 Summary -->
        <div class="card p-4 shadow-sm mt-4">
          <div class="d-flex justify-content-between align-items-center">

            <div>
              <button 
                class="btn btn-outline-danger me-2"
                (click)="clearCart()"
                [disabled]="loading">
                Clear Cart
              </button>

              <a routerLink="/products" class="btn btn-outline-secondary">
                Continue Shopping
              </a>
            </div>

            <div class="text-end">
              <h4>Total:</h4>
              <h3 class="text-success fw-bold">
                {{ cart?.totalPrice | currency:'INR' }}
              </h3>

              <a 
                routerLink="/checkout" 
                class="btn btn-success btn-lg mt-2">
                Proceed to Checkout
              </a>
            </div>

          </div>
        </div>
      </div>

      <!-- 📭 Empty State -->
      <div *ngIf="!loading && (!cart || !cart.items?.length)" class="text-center mt-5">
        <h4>Your cart is empty 😕</h4>
        <a routerLink="/products" class="btn btn-primary mt-3">
          Shop Now
        </a>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 12px;
    }
  `]
})
export class CartComponent implements OnInit {

  cart: Cart | null = null;
  loading = false;
  userId = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.id || 0;
      this.loadCart();
    }
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart(this.userId).subscribe({
      next: (cart: Cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.loading = false;
      }
    });
  }

  // 🔢 Better quantity handler
  changeQty(item: CartItem, delta: number): void {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    this.loading = true;
    this.cartService.updateCartItem(this.userId, item.productId, newQty).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        console.error('Error updating quantity:', err);
        this.loading = false;
      }
    });
  }

  removeItem(productId: number): void {
    this.loading = true;
    this.cartService.removeFromCart(this.userId, productId).subscribe({
      next: () => this.loadCart(),
      error: (error) => {
        console.error('Error removing item:', error);
        this.loading = false;
      }
    });
  }

  clearCart(): void {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    this.loading = true;
    this.cartService.clearCart(this.userId).subscribe({
      next: () => this.loadCart(),
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.loading = false;
      }
    });
  }
}