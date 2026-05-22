import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * UPDATED ProductService (was TestService)
 *
 * Changes from original:
 * - Fixed endpoint: was '/admin/products' → now '/api/v1/products' (public route)
 * - Uses environment.apiUrl (no hardcoded localhost)
 * - Added more product methods for a complete service
 * - NO manual headers — AuthInterceptor handles them
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  /** Get all products (public) */
  getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Observable<any> {
    return this.http.get(this.productUrl, { params: params as any });
  }

  /** Get a single product by ID (public) */
  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.productUrl}/${id}`);
  }

  /** Create a product (admin only — token injected by interceptor) */
  createProduct(formData: FormData): Observable<any> {
    return this.http.post(this.productUrl, formData);
  }

  /** Update a product (admin only) */
  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.productUrl}/${id}`, data);
  }

  /** Delete a product (admin only) */
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.productUrl}/${id}`);
  }

  /** Upload product image (admin only) */
  uploadImage(productId: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.productUrl}/${productId}/image`, formData);
  }
}
