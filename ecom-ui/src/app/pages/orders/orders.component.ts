import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h1>My Orders</h1>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="!loading && orders.length > 0">
        <div class="row">
          <div class="col-md-12" *ngFor="let order of orders">
            <div class="card mb-3">
              <div class="card-header">
                <h5>Order #{{ order.id }}</h5>
              </div>
              <div class="card-body">
                <p><strong>Order Date:</strong> {{ order.orderDate | date:'short' }}</p>
                <p><strong>Status:</strong> 
                  <span [class]="getStatusBadgeClass(order.status)">
                    {{ order.status }}
                  </span>
                </p>
                <p><strong>Total Amount:</strong> \${{ order.totalAmount }}</p>
                
                <h6 class="mt-3">Items:</h6>
                <ul>
                  <li *ngFor="let item of order.items">
                    {{ item.productName }} (Qty: {{ item.quantity }}) - \${{ item.price }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && orders.length === 0" class="alert alert-info">
        You have no orders yet. <a href="/products">Start shopping</a>
      </div>
    </div>
  `,
  styles: [`
    .badge {
      padding: 0.5rem 1rem;
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
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'badge bg-warning';
      case 'CONFIRMED':
        return 'badge bg-info';
      case 'SHIPPED':
        return 'badge bg-primary';
      case 'DELIVERED':
        return 'badge bg-success';
      case 'CANCELLED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
}
