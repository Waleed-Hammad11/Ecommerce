import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * CartService — Handles cart API interactions.
 * Token is injected automatically by AuthInterceptor.
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getMyCart(): Observable<any> {
    return this.http.get(`${this.cartUrl}/my-cart`);
  }

  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post(this.cartUrl, { productId, quantity });
  }

  updateCartItem(productId: string, quantity: number): Observable<any> {
    return this.http.put(this.cartUrl, { productId, quantity });
  }

  removeCartItem(productId: string): Observable<any> {
    return this.http.delete(`${this.cartUrl}/item/${productId}`);
  }

  clearCart(): Observable<any> {
    return this.http.delete(this.cartUrl);
  }
}
