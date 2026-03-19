import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Cart, CartItem } from '../../models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h1>Shopping Cart</h1>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="!loading && cart && cart.items.length > 0">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of cart.items">
                <td>{{ item.productId }}</td>
                <td>
                  <input 
                    type="number" 
                    class="form-control" 
                    style="width: 70px;"
                    [(ngModel)]="item.quantity"
                    min="1"
                    (change)="updateQuantity(item)">
                </td>
                <td>${{ item.price }}</td>
                <td>${{ item.totalPrice }}</td>
                <td>
                  <button 
                    class="btn btn-sm btn-danger"
                    (click)="removeItem(item.productId)">
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="row mt-4">
          <div class="col-md-6">
            <button 
              class="btn btn-warning me-2"
              (click)="clearCart()">
              Clear Cart
            </button>
            <a routerLink="/products" class="btn btn-secondary">Continue Shopping</a>
          </div>
          <div class="col-md-6 text-end">
            <h3>Total: <span class="text-success">\${{ cart.totalPrice }}</span></h3>
            <a routerLink="/checkout" class="btn btn-success btn-lg">Proceed to Checkout</a>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && (!cart || cart.items.length === 0)" class="alert alert-info">
        <p>Your cart is empty. <a routerLink="/products">Continue shopping</a></p>
      </div>
    </div>
  `,
  styles: []
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
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.loading = false;
      }
    });
  }

  updateQuantity(item: CartItem): void {
    this.cartService.updateCartItem(this.userId, item.productId, item.quantity).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Error updating cart:', error);
      }
    });
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(this.userId, productId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Error removing item:', error);
      }
    });
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart(this.userId).subscribe({
        next: () => {
          this.loadCart();
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
        }
      });
    }
  }
}
