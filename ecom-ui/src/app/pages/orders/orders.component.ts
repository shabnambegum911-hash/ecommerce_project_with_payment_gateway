import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="orders-page py-4">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">
          <div>
            <h1 class="fw-bold mb-1">My Orders</h1>
            <p class="text-muted mb-0">Track and review your recent purchases</p>
          </div>
          <a routerLink="/products" class="btn btn-primary mt-2 mt-md-0">
            Continue Shopping
          </a>
        </div>

        <div *ngIf="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="text-muted mt-3 mb-0">Loading your orders...</p>
        </div>

        <div *ngIf="!loading && orders.length > 0" class="row g-4">
          <div class="col-12" *ngFor="let order of orders">
            <div class="card order-card shadow-sm border-0">
              <div class="card-body p-4">
                <div class="row g-4 align-items-start">
                  <div class="col-lg-8">
                    <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                      <div>
                        <h5 class="fw-bold mb-1">Order #{{ order.id }}</h5>
                        <p class="text-muted mb-0">
                          Placed on {{ order.orderDate | date:'medium' }}
                        </p>
                      </div>

                      <span [ngClass]="getStatusBadgeClass(order.status)">
                        {{ order.status }}
                      </span>
                    </div>

                    <div class="items-section">
                      <h6 class="fw-semibold mb-3">Items</h6>

                      <div
                        class="item-row"
                        *ngFor="let item of order.items; let last = last"
                        [class.no-border]="last"
                      >
                        <div>
                          <div class="fw-semibold">{{ item.productName }}</div>
                          <small class="text-muted">Qty: {{ item.quantity }}</small>
                        </div>

                        <div class="text-end fw-semibold">
                          {{ item.price | currency:'INR' }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-lg-4">
                    <div class="summary-box">
                      <p class="summary-label mb-1">Total Amount</p>
                      <h4 class="text-success fw-bold mb-3">
                        {{ order.totalAmount | currency:'INR' }}
                      </h4>

                      <div class="small text-muted">
                        {{ order.items?.length || 0 }} item(s) in this order
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && orders.length === 0" class="empty-state text-center py-5">
          <div class="empty-icon mb-3">📦</div>
          <h4 class="fw-bold">No orders yet</h4>
          <p class="text-muted mb-4">You haven’t placed any orders yet.</p>
          <a routerLink="/products" class="btn btn-primary px-4">
            Start Shopping
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page {
      min-height: calc(100vh - 80px);
      background: linear-gradient(to bottom, #f8f9fa, #ffffff);
    }

    .order-card {
      border-radius: 18px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .order-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.08) !important;
    }

    .summary-box {
      background: #f8f9fa;
      border-radius: 14px;
      padding: 20px;
      border: 1px solid #eef1f4;
    }

    .summary-label {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .items-section {
      background: #fcfcfd;
      border: 1px solid #eef1f4;
      border-radius: 14px;
      padding: 16px;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid #eceff3;
    }

    .item-row.no-border {
      border-bottom: none;
      padding-bottom: 0;
    }

    .status-badge {
      padding: 0.55rem 1rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: capitalize;
      display: inline-block;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-confirmed {
      background: #cff4fc;
      color: #055160;
    }

    .status-shipped {
      background: #cfe2ff;
      color: #084298;
    }

    .status-delivered {
      background: #d1e7dd;
      color: #0f5132;
    }

    .status-cancelled {
      background: #f8d7da;
      color: #842029;
    }

    .status-default {
      background: #e2e3e5;
      color: #41464b;
    }

    .empty-state {
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05);
    }

    .empty-icon {
      font-size: 64px;
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  userId = 0;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.id || 0;
      this.loadOrders();
    }
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrdersByUser(this.userId).subscribe({
      next: (orders: Order[]) => {
        this.orders = orders || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch ((status || '').toUpperCase()) {
      case 'PENDING':
        return 'status-badge status-pending';
      case 'CONFIRMED':
        return 'status-badge status-confirmed';
      case 'SHIPPED':
        return 'status-badge status-shipped';
      case 'DELIVERED':
        return 'status-badge status-delivered';
      case 'CANCELLED':
        return 'status-badge status-cancelled';
      default:
        return 'status-badge status-default';
    }
  }
}