import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- 🔥 HERO SECTION -->
    <div class="hero text-white text-center d-flex align-items-center">
      <div class="container">
        <h1 class="display-3 fw-bold">🛍️ Shop Smart, Shop Fast</h1>
        <p class="lead mt-3">
          Discover amazing products with secure payments & lightning-fast delivery.
        </p>

        <div class="mt-4">
          <a routerLink="/products" class="btn btn-light btn-lg me-3 px-4">
            Shop Now
          </a>
          <a routerLink="/register" class="btn btn-outline-light btn-lg px-4">
            Get Started
          </a>
        </div>
      </div>
    </div>

    <div class="container py-5">

      <!-- ⭐ FEATURES -->
      <h2 class="text-center mb-5 fw-bold">Why Choose Us?</h2>

      <div class="row text-center g-4">
        <div class="col-md-4">
          <div class="feature-card p-4 h-100">
            <div class="icon">📦</div>
            <h5 class="mt-3">Fast Delivery</h5>
            <p>Quick and reliable shipping at your doorstep.</p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="feature-card p-4 h-100">
            <div class="icon">🔒</div>
            <h5 class="mt-3">Secure Payments</h5>
            <p>Protected transactions with top-level security.</p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="feature-card p-4 h-100">
            <div class="icon">💰</div>
            <h5 class="mt-3">Best Deals</h5>
            <p>Get the best prices and exclusive discounts.</p>
          </div>
        </div>
      </div>

      <!-- 🚀 GET STARTED -->
      <h2 class="text-center mt-5 mb-4 fw-bold">Get Started</h2>

      <div class="row g-4">
        <div class="col-md-4">
          <div class="card action-card h-100 text-center p-3">
            <h5>Create Account</h5>
            <p>Sign up and start your shopping journey.</p>
            <a routerLink="/register" class="btn btn-primary w-100">Register</a>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card action-card h-100 text-center p-3">
            <h5>Browse Products</h5>
            <p>Explore a wide range of products.</p>
            <a routerLink="/products" class="btn btn-success w-100">Shop Now</a>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card action-card h-100 text-center p-3">
            <h5>Track Orders</h5>
            <p>Login to track your purchases easily.</p>
            <a routerLink="/login" class="btn btn-dark w-100">Login</a>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* 🔥 HERO */
    .hero {
      height: 80vh;
      background: linear-gradient(135deg, #4e54c8, #8f94fb);
    }

    /* ⭐ FEATURES */
    .feature-card {
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }

    .icon {
      font-size: 40px;
    }

    /* 🚀 ACTION CARDS */
    .action-card {
      border-radius: 16px;
      transition: 0.3s;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    .action-card:hover {
      transform: scale(1.03);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
  `]
})
export class HomeComponent {}