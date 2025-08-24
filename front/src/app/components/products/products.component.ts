import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { TestService } from '../../services/test.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private testService: TestService) {}

  loadProducts() {
    this.testService.getProducts().subscribe({
      next: (res) => {
        console.log(res);
          console.log("Response:", res);
          console.log("Products:", res.data);
        this.products = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

    ngOnInit(): void {
    this.loadProducts();
  }
}
