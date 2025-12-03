import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Product } from './api.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'shopping_cart';
  
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  
  private cartTotalSubject = new BehaviorSubject<number>(0);
  public cartTotal$ = this.cartTotalSubject.asObservable();
  
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  /**
   * Carga el carrito desde el almacenamiento
   */
  private async loadCart(): Promise<void> {
    const { value } = await Preferences.get({ key: this.CART_KEY });
    if (value) {
      try {
        const items: CartItem[] = JSON.parse(value);
        this.cartItemsSubject.next(items);
        this.updateTotals(items);
      } catch (error) {
        console.error('Error al cargar carrito:', error);
      }
    }
  }

  /**
   * Guarda el carrito en el almacenamiento
   */
  private async saveCart(items: CartItem[]): Promise<void> {
    await Preferences.set({
      key: this.CART_KEY,
      value: JSON.stringify(items)
    });
  }

  /**
   * Actualiza los totales del carrito
   */
  private updateTotals(items: CartItem[]): void {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    
    this.cartTotalSubject.next(total);
    this.cartCountSubject.next(count);
  }

  /**
   * Agrega un producto al carrito
   */
  async addToCart(product: Product, quantity: number = 1): Promise<void> {
    const items = this.cartItemsSubject.value;
    const existingItem = items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    
    this.cartItemsSubject.next([...items]);
    this.updateTotals(items);
    await this.saveCart(items);
  }

  /**
   * Actualiza la cantidad de un producto
   */
  async updateQuantity(productId: number, quantity: number): Promise<void> {
    const items = this.cartItemsSubject.value;
    const item = items.find(i => i.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        await this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartItemsSubject.next([...items]);
        this.updateTotals(items);
        await this.saveCart(items);
      }
    }
  }

  /**
   * Elimina un producto del carrito
   */
  async removeFromCart(productId: number): Promise<void> {
    let items = this.cartItemsSubject.value;
    items = items.filter(item => item.product.id !== productId);
    
    this.cartItemsSubject.next(items);
    this.updateTotals(items);
    await this.saveCart(items);
  }

  /**
   * Limpia el carrito completamente
   */
  async clearCart(): Promise<void> {
    this.cartItemsSubject.next([]);
    this.cartTotalSubject.next(0);
    this.cartCountSubject.next(0);
    await Preferences.remove({ key: this.CART_KEY });
  }

  /**
   * Obtiene los items del carrito
   */
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  /**
   * Obtiene el total del carrito
   */
  getCartTotal(): number {
    return this.cartTotalSubject.value;
  }

  /**
   * Obtiene la cantidad de items en el carrito
   */
  getCartCount(): number {
    return this.cartCountSubject.value;
  }

  /**
   * Verifica si un producto está en el carrito
   */
  isInCart(productId: number): boolean {
    return this.cartItemsSubject.value.some(item => item.product.id === productId);
  }

  /**
   * Obtiene la cantidad de un producto en el carrito
   */
  getProductQuantity(productId: number): number {
    const item = this.cartItemsSubject.value.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  }
}
