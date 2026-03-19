export interface User {
  id?: number;
  username: string;
  password?: string;
  role?: string;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stockQuantity: number;
  releaseDate?: Date;
  productAvailable?: boolean;
}

export interface CartItem {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Cart {
  id?: number;
  userId: number;
  items: CartItem[];
  totalPrice: number;
  createdDate?: Date;
  updatedDate?: Date;
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  orderDate?: Date;
  status: string;
}

export interface Payment {
  id?: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  paymentDate?: Date;
  paymentGateway?: string;
}

export interface StripePaymentRequest {
  orderId: number;
  amount: number;
  currency: string;
  token?: string;
  description: string;
  customerEmail: string;
  paymentMethod: string;
}

export interface StripePaymentResponse {
  transactionId: string;
  status: string;
  message: string;
  clientSecret: string;
  paymentIntentId: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}
