export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  imageUrl?: string;
  isActive?: boolean;
}