import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product, Category } from '../shared/models/index';
import {
  MOCK_PRODUCTS,
  PRODUCT_CATEGORIES,
  getProductsByCategory,
  getProductById,
  getFeaturedProducts,
  getDiscountedProducts
} from '../shared/constants/products-data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>(MOCK_PRODUCTS);
  public products$ = this.productsSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<Category[]>(PRODUCT_CATEGORIES);
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {}

  /**
   * Obtiene todos los productos
   */
  getAllProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS).pipe(delay(300));
  }

  /**
   * Obtiene un producto por ID
   */
  getProductById(id: number): Observable<Product | undefined> {
    return of(getProductById(id)).pipe(delay(200));
  }

  /**
   * Obtiene productos por categoría
   */
  getProductsByCategory(categoryName: string): Observable<Product[]> {
    return of(getProductsByCategory(categoryName)).pipe(delay(300));
  }

  /**
   * Obtiene todas las categorías
   */
  getCategories(): Observable<Category[]> {
    return of(PRODUCT_CATEGORIES).pipe(delay(200));
  }

  /**
   * Obtiene una categoría por ID
   */
  getCategoryById(id: number): Observable<Category | undefined> {
    return of(PRODUCT_CATEGORIES.find(c => c.id === id)).pipe(delay(200));
  }

  /**
   * Obtiene productos destacados
   */
  getFeaturedProducts(): Observable<Product[]> {
    return of(getFeaturedProducts()).pipe(delay(300));
  }

  /**
   * Obtiene productos con descuento
   */
  getDiscountedProducts(): Observable<Product[]> {
    return of(getDiscountedProducts()).pipe(delay(300));
  }

  /**
   * Busca productos por nombre o descripción
   */
  searchProducts(query: string): Observable<Product[]> {
    const lowerQuery = query.toLowerCase();
    const results = MOCK_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    return of(results).pipe(delay(300));
  }

  /**
   * Filtra productos por rango de precio
   */
  filterByPrice(minPrice: number, maxPrice: number): Observable<Product[]> {
    const results = MOCK_PRODUCTS.filter(
      p => p.price >= minPrice && p.price <= maxPrice
    );
    return of(results).pipe(delay(300));
  }

  /**
   * Filtra productos por rating mínimo
   */
  filterByRating(minRating: number): Observable<Product[]> {
    const results = MOCK_PRODUCTS.filter(p => p.rating >= minRating);
    return of(results).pipe(delay(300));
  }

  /**
   * Ordena productos
   */
  sortProducts(
    products: Product[],
    sortBy: 'name' | 'price' | 'rating' | 'newest' = 'name'
  ): Product[] {
    const sorted = [...products];
    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => a.price - b.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.reverse(); // Simular orden de más nuevo
      case 'name':
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  /**
   * Obtiene productos relacionados
   */
  getRelatedProducts(productId: number, limit: number = 4): Observable<Product[]> {
    const product = getProductById(productId);
    if (!product) {
      return of([]);
    }

    const related = MOCK_PRODUCTS.filter(
      p => p.category === product.category && p.id !== productId
    ).slice(0, limit);

    return of(related).pipe(delay(300));
  }

  /**
   * Calcula el precio con descuento
   */
  calculateDiscountedPrice(product: Product): number {
    if (!product.discount) {
      return product.price;
    }
    return product.price - (product.price * product.discount) / 100;
  }

  /**
   * Calcula el ahorro
   */
  calculateSavings(product: Product): number {
    if (!product.originalPrice) {
      return 0;
    }
    return product.originalPrice - product.price;
  }

  /**
   * Verifica si un producto está en stock
   */
  isInStock(productId: number): boolean {
    const product = getProductById(productId);
    return product ? product.inStock : false;
  }

  /**
   * Obtiene productos sugeridos (trending/nuevos)
   */
  getTrendingProducts(limit: number = 6): Observable<Product[]> {
    return of(MOCK_PRODUCTS.filter(p => p.rating >= 4.7).slice(0, limit)).pipe(delay(300));
  }
}
