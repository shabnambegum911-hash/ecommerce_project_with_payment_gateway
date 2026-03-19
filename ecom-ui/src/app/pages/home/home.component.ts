import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h1 class="display-4">Welcome to E-Commerce</h1>
          <p class="lead">Shop our wide selection of products with fast shipping and secure payment.</p>
          <div class="mt-4">
            <a routerLink="/products" class="btn btn-primary btn-lg me-2">Shop Now</a>
            <a routerLink="/register" class="btn btn-outline-primary btn-lg">Register</a>
          </div>
        </div>
        <div class="col-md-6 text-center">
          <div style="font-size: 120px;">🛍️</div>
        </div>
      </div>

      <hr class="my-5">

      <h2 class="text-center mb-5">Why Shop With Us?</h2>
      <div class="row">
        <div class="col-md-4 text-center mb-4">
          <div style="font-size: 50px;">📦</div>
          <h5>Fast Shipping</h5>
          <p>We offer quick and reliable shipping to your doorstep.</p>
        </div>
        <div class="col-md-4 text-center mb-4">
          <div style="font-size: 50px;">🔒</div>
          <h5>Secure Payment</h5>
          <p>Your transactions are protected with Stripe encryption.</p>
        </div>
        <div class="col-md-4 text-center mb-4">
          <div style="font-size: 50px;">💰</div>
          <h5>Best Prices</h5>
          <p>Competitive prices and regular discounts on popular items.</p>
        </div>
      </div>

      <hr class="my-5">

      <h2 class="text-center mb-4">Get Started</h2>
      <div class="row">
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body text-center">
              <h5 class="card-title">Create Account</h5>
              <p class="card-text">Sign up for a free account to start shopping.</p>
              <a routerLink="/register" class="btn btn-primary">Register</a>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body text-center">
              <h5 class="card-title">Browse Products</h5>
              <p class="card-text">Explore our extensive collection of products.</p>
              <a routerLink="/products" class="btn btn-primary">Shop</a>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body text-center">
              <h5 class="card-title">Track Orders</h5>
              <p class="card-text">Sign in to view and track your orders.</p>
              <a routerLink="/login" class="btn btn-primary">Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {}
