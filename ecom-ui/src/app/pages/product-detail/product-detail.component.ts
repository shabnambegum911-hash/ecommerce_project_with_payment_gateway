import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mt-4">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/products">Products</a></li>
          <li class="breadcrumb-item active">{{ product?.name }}</li>
        </ol>
      </nav>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="!loading && product" class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body text-center">
              <div style="font-size: 200px; line-height: 1;">📦</div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <h1>{{ product.name }}</h1>
          
          <p class="lead text-muted">{{ product.description }}</p>

          <div class="mb-3">
            <strong>Brand:</strong> {{ product.brand }}
          </div>

          <div class="mb-3">
            <strong>Category:</strong> {{ product.category }}
          </div>

          <div class="mb-3">
            <strong>Price:</strong> 
            <span class="h4 text-success">\${{ product.price }}</span>
          </div>

          <div class="mb-3">
            <strong>Stock:</strong>
            <span [class]="product.stockQuantity > 0 ? 'text-success' : 'text-danger'">
              {{ product.stockQuantity > 0 ? 'Available' : 'Out of Stock' }}
            </span>
          </div>

          <div class="mb-3">
            <label for="quantity" class="form-label">Quantity:</label>
            <input 
              type="number" 
              class="form-control" 
              id="quantity"
              [(ngModel)]="quantity"
              min="1"
              [max]="product.stockQuantity"
              [disabled]="product.stockQuantity === 0">
          </div>

          <div class="mb-3">
            <button 
              class="btn btn-success btn-lg me-2"
              (click)="addToCart()"
              [disabled]="product.stockQuantity === 0">
              Add to Cart
            </button>
            <a routerLink="/products" class="btn btn-secondary btn-lg">Back to Products</a>
          </div>

          <div *ngIf="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <div *ngIf="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !product" class="alert alert-danger">
        Product not found
      </div>
    </div>
  `,
  styles: []
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  quantity = 1;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadProduct(id);
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.errorMessage = 'Error loading product details';
        this.loading = false;
      }
    });
  }

  addToCart(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'Please login first';
      return;
    }

    if (!this.product) {
      this.errorMessage = 'Product not available';
      return;
    }

    this.cartService.addToCart(user.id || 0, this.product.id || 0, this.quantity).subscribe({
      next: () => {
        this.successMessage = `${this.quantity} item(s) added to cart!`;
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.errorMessage = 'Error adding product to cart';
      }
    });
  }
}
