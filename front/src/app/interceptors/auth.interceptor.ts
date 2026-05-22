import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

/**
 * HTTP INTERCEPTOR — Auth Token Injector
 *
 * WHY an interceptor:
 * - Without this, every service must manually add the Authorization header.
 * - With this, ALL HTTP requests automatically get the token header.
 * - Also handles 401 responses globally (redirect to login).
 *
 * CHANGE from original:
 * - Original sent token as custom header: { headers: { token: '...' } }
 * - New backend expects: Authorization: Bearer <token>
 * - This interceptor handles it automatically for ALL requests.
 *
 * USAGE: Register in app.config.ts with withInterceptors([authInterceptorFn])
 * or as a class-based interceptor in providers.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Clone request and add Authorization header if token exists
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid — clear storage and redirect to login
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
