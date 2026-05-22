import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';
  showSuccessModal = false;
  addedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to load products';
      }
    });
  }

  handleImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80';
  }

  addToCart(productId: string): void {
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to add items to your cart.');
      this.router.navigate(['/login']);
      return;
    }

    const prod = this.products.find(p => p._id === productId);

    this.cartService.addToCart(productId, 1).subscribe({
      next: () => {
        if (prod) {
          this.addedProduct = prod;
          this.showSuccessModal = true;
        } else {
          this.showSuccess('Product added to cart!');
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to add item to cart';
        setTimeout(() => this.errorMessage = '', 3000);
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

  ngOnInit(): void {
    this.loadProducts();
  }
}
