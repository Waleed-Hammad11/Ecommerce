import { Product } from './product';

export interface CartItem {
  _id?: string;
  productId: Product;
  quantity: number;
  priceAtTime: number;
}

export interface Cart {
  _id: string;
  createdBy: string;
  products: CartItem[];
  createdAt?: string;
  updatedAt?: string;
  totalPrice?: number;
  itemCount?: number;
}
