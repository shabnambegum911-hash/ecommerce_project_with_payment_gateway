import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, StripePaymentRequest, StripePaymentResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  createStripeIntent(request: StripePaymentRequest): Observable<StripePaymentResponse> {
    return this.http.post<StripePaymentResponse>(`${this.apiUrl}/stripe/create-intent`, request);
  }

  confirmPayment(paymentIntentId: string, token: string, orderId: number): Observable<StripePaymentResponse> {
    return this.http.post<StripePaymentResponse>(
      `${this.apiUrl}/stripe/confirm?paymentIntentId=${paymentIntentId}&token=${token}&orderId=${orderId}`,
      {}
    );
  }

  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  getPaymentByOrder(orderId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/order/${orderId}`);
  }

  getPaymentByTransaction(transactionId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/transaction/${transactionId}`);
  }

  updatePaymentStatus(id: number, status: string): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }
}
