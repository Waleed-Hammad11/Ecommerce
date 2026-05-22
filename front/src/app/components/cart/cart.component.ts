import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../interfaces/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cartService.getMyCart().subscribe({
      next: (res) => {
        this.cart = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        // 404 is returned by backend if no active cart exists yet
        if (err.status === 404) {
          this.cart = null;
        } else {
          this.errorMessage = err.error?.message || 'Failed to load cart';
        }
      }
    });
  }

  updateQuantity(productId: string, currentQty: number, change: number): void {
    const newQty = currentQty + change;
    if (newQty < 1) {
      this.removeItem(productId);
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.updateCartItem(productId, newQty).subscribe({
      next: (res) => {
        this.cart = res.data;
        this.loading = false;
        this.showSuccess('Cart updated successfully');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to update quantity';
      }
    });
  }

  removeItem(productId: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.removeCartItem(productId).subscribe({
      next: (res) => {
        this.cart = res.data;
        this.loading = false;
        this.showSuccess('Item removed from cart');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to remove item';
      }
    });
  }

  clearCart(): void {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.clearCart().subscribe({
      next: () => {
        this.cart = null;
        this.loading = false;
        this.showSuccess('Cart cleared successfully');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to clear cart';
      }
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => {
      if (this.successMessage === msg) {
        this.successMessage = '';
      }
    }, 3000);
  }
}
