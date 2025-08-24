import { Component, OnInit } from '@angular/core';
import { TestService } from '../../services/test.service';
import { Product } from '../../interfaces/product';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = []; 

  constructor(private TestService: TestService) {}

  displayData() {
    this.TestService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  ngOnInit(): void {
    this.displayData();
  }
}




