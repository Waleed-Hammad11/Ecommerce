import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  showSuccessModal = false;
  addedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  displayData() {
    this.loading = true;
    this.errorMessage = '';
    this.productService.getProducts({ limit: 3 }).subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
        this.errorMessage = 'Could not retrieve products. Check backend connection.';
      }
    });
  }

  handleImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80';
  }

  addToCart(productId: string): void {
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Please log in to add items to your cart.';
      setTimeout(() => this.errorMessage = '', 3000);
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
          this.successMessage = 'Product added to cart successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to add item to cart';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  ngOnInit(): void {
    this.displayData();
  }
}




