import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col-md-6">
          <h1>Products</h1>
        </div>
        <div class="col-md-6">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search products..."
            [(ngModel)]="searchTerm"
            (keyup)="search()">
        </div>
      </div>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div class="row" *ngIf="!loading">
        <div class="col-md-4 mb-4" *ngFor="let product of products">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text text-muted">{{ product.description | slice:0:100 }}...</p>
              <p class="card-text"><strong>Category:</strong> {{ product.category }}</p>
              <p class="card-text"><strong>Price:</strong> <span class="text-success">{{ product.price | currency }}</span></p>
              <p class="card-text">
                <strong>Stock:</strong> 
                <span [class]="product.stockQuantity > 0 ? 'text-success' : 'text-danger'">
                  {{ product.stockQuantity > 0 ? 'Available' : 'Out of Stock' }}
                </span>
              </p>
            </div>
            <div class="card-footer bg-light">
              <a [routerLink]="['/product', product.id]" class="btn btn-sm btn-info me-2">View Details</a>
              <button 
                class="btn btn-sm btn-success"
                (click)="addToCart(product)"
                [disabled]="product.stockQuantity === 0">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && products.length === 0" class="alert alert-info">
        No products found.
      </div>
    </div>
  `,
  styles: []
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  searchTerm = '';
  loading = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        this.allProducts = response;
        this.products = response;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  search(): void {
    if (this.searchTerm.trim() === '') {
      this.products = this.allProducts;
    } else {
      this.productService.searchProducts(this.searchTerm).subscribe({
        next: (results: any) => {
          this.products = results;
        },
        error: (error: any) => {
          console.error('Error searching products:', error);
        }
      });
    }
  }

  addToCart(product: Product): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('Please login first');
      return;
    }

    this.cartService.addToCart(user.id || 0, product.id || 0, 1).subscribe({
      next: () => {
        alert('Product added to cart!');
      },
      error: (error: any) => {
        console.error('Error adding to cart:', error);
        alert('Error adding product to cart');
      }
    });
  }
}
