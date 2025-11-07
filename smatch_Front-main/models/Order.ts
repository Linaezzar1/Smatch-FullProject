import { User } from './User';
import { Product } from './Product';

export interface Order {
  _id?: string;
  user: string; // ObjectId as string
  products: string[]; // Array of ObjectId strings
  quantities?: number[]; // Optional, requires backend support
  orderDate?: string;
  total: number;
}