/**
 * Modelos de datos para la aplicación de tienda tech
 */

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  image: string;
  images?: string[];
  specs: ProductSpecs;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  quantity?: number;
  sku: string;
  tags?: string[];
}

export interface ProductSpecs {
  [key: string]: string | number | boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedDate: Date;
}

export interface Order {
  id: number;
  code: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdDate: Date;
  estimatedDelivery?: Date;
  shippingAddress: Address;
}

export interface OrderItem {
  id?: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Address {
  id?: number;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  createdDate?: Date;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  unhelpful: number;
  createdDate: Date;
  userDisplayName: string;
}

export interface ShoppingCart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  itemCount: number;
  lastUpdated: Date;
}
