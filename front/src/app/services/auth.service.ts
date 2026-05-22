import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * UPDATED AuthService
 *
 * Changes from original:
 * - URLs now use environment.apiUrl (no more hardcoded localhost:3000)
 * - Endpoints updated to new API versioned routes (/api/v1/auth/...)
 * - login() now stores token from the new response shape { data: { token, user } }
 * - logout() updated
 * - Added isLoggedIn() and getToken() helpers
 * - NO manual headers needed — AuthInterceptor handles them automatically
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  signup(data: { username: string; email: string; password: string; confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, data).pipe(
      tap((response: any) => {
        if (response?.data?.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
