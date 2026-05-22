import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Modals / forms state
  isEditing = false;
  selectedProductId: string | null = null;
  selectedFile: File | null = null;

  productForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    quantity: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.productService.getProducts({ limit: 100 }).subscribe({
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValues = this.productForm.value;

    if (this.isEditing && this.selectedProductId) {
      // 1. Update text details first
      const updateData = {
        title: formValues.title || '',
        description: formValues.description || '',
        price: Number(formValues.price),
        quantity: Number(formValues.quantity),
      };

      this.productService.updateProduct(this.selectedProductId, updateData).subscribe({
        next: (res) => {
          const updatedProduct = res.data;
          
          // 2. If a new image was chosen, upload it now
          if (this.selectedFile) {
            const imgFormData = new FormData();
            imgFormData.append('image', this.selectedFile);

            this.productService.uploadImage(this.selectedProductId!, imgFormData).subscribe({
              next: () => {
                this.finishSubmit('Product and image updated successfully');
              },
              error: (imgErr) => {
                this.loading = false;
                this.errorMessage = imgErr.error?.message || 'Product updated, but image upload failed';
                this.loadProducts();
              }
            });
          } else {
            this.finishSubmit('Product updated successfully');
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Failed to update product';
        }
      });

    } else {
      // Create mode
      const formData = new FormData();
      formData.append('title', formValues.title || '');
      formData.append('description', formValues.description || '');
      formData.append('price', String(formValues.price || 0));
      formData.append('quantity', String(formValues.quantity || 0));
      
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.finishSubmit('Product created successfully');
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Failed to create product';
        }
      });
    }
  }

  finishSubmit(message: string): void {
    this.successMessage = message;
    this.loading = false;
    this.resetForm();
    this.loadProducts();
    setTimeout(() => {
      if (this.successMessage === message) {
        this.successMessage = '';
      }
    }, 4000);
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.selectedProductId = product._id;
    this.selectedFile = null;

    this.productForm.setValue({
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    });

    // Scroll smoothly to form
    const formElement = document.getElementById('admin-form-anchor');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  deleteProduct(productId: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Product deleted successfully';
        this.loadProducts();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to delete product';
      }
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedProductId = null;
    this.selectedFile = null;
    this.productForm.reset();
    
    // Clear file input manually
    const fileInput = document.getElementById('product-image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}
