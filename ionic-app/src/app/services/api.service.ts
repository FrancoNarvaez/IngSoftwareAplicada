import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  productSize?: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  image?: string;
  imageContentType?: string;
  productCategoryId?: number;
  productCategoryName?: string;
}

export interface ProductCategory {
  id?: number;
  name: string;
  description?: string;
}

export interface ProductOrder {
  id?: number;
  placedDate?: string;
  status?: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  code?: string;
  customerId?: number;
  customerUser?: string;
}

export interface OrderItem {
  id?: number;
  quantity: number;
  totalPrice: number;
  status?: 'AVAILABLE' | 'OUT_OF_STOCK' | 'BACK_ORDER';
  productId: number;
  productName?: string;
  orderId?: number;
  orderCode?: string;
}

export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  userId?: number;
  userLogin?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==================== PRODUCTS ====================
  
  getProducts(page?: number, size?: number, sort?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page);
    if (size !== undefined) params = params.set('size', size);
    if (sort) params = params.set('sort', sort);
    
    return this.http.get<Product[]>(`${this.API_URL}/api/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/api/products/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/api/products`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/api/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/api/products/${id}`);
  }

  // ==================== PRODUCT CATEGORIES ====================

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.API_URL}/api/product-categories`);
  }

  // ==================== PRODUCT ORDERS ====================

  getProductOrders(): Observable<ProductOrder[]> {
    return this.http.get<ProductOrder[]>(`${this.API_URL}/api/product-orders`);
  }

  getProductOrder(id: number): Observable<ProductOrder> {
    return this.http.get<ProductOrder>(`${this.API_URL}/api/product-orders/${id}`);
  }

  createProductOrder(order: ProductOrder): Observable<ProductOrder> {
    return this.http.post<ProductOrder>(`${this.API_URL}/api/product-orders`, order);
  }

  updateProductOrder(id: number, order: ProductOrder): Observable<ProductOrder> {
    return this.http.put<ProductOrder>(`${this.API_URL}/api/product-orders/${id}`, order);
  }

  deleteProductOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/api/product-orders/${id}`);
  }

  // ==================== ORDER ITEMS ====================

  getOrderItems(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.API_URL}/api/order-items`);
  }

  getOrderItem(id: number): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${this.API_URL}/api/order-items/${id}`);
  }

  createOrderItem(item: OrderItem): Observable<OrderItem> {
    return this.http.post<OrderItem>(`${this.API_URL}/api/order-items`, item);
  }

  updateOrderItem(id: number, item: OrderItem): Observable<OrderItem> {
    return this.http.put<OrderItem>(`${this.API_URL}/api/order-items/${id}`, item);
  }

  deleteOrderItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/api/order-items/${id}`);
  }

  // ==================== CUSTOMERS ====================

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.API_URL}/api/customers`);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.API_URL}/api/customers/${id}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.API_URL}/api/customers`, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.API_URL}/api/customers/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/api/customers/${id}`);
  }
}
