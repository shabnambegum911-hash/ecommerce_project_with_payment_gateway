import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ApiResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?keyword=${keyword}`);
  }

  addProduct(product: Product, imageFile: any): Observable<Product> {
    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    formData.append('imageFile', imageFile);
    return this.http.post<Product>(`${this.apiUrl}`, formData);
  }

  updateProduct(id: number, product: Product, imageFile: any): Observable<Product> {
    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    formData.append('imageFile', imageFile);
    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
