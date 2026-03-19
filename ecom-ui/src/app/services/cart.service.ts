import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${userId}`);
  }

  addToCart(userId: number, productId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/${userId}/add?productId=${productId}&quantity=${quantity}`, {});
  }

  removeFromCart(userId: number, productId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${userId}/remove/${productId}`);
  }

  updateCartItem(userId: number, productId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/${userId}/update/${productId}?quantity=${quantity}`, {});
  }

  clearCart(userId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${userId}/clear`);
  }
}
