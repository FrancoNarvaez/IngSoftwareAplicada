import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../shared/models';
import { ActivatedRoute } from '@angular/router';
import { gridOutline, listOutline, logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonButtons,
    ProductCardComponent
  ],
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss']
})
export class ProductsPage implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  selectedCategoryId: number | null = null;
  currentPage = 1;
  pageSize = 12;
  viewMode: 'grid' | 'list' = 'grid';
  Math = Math; // Para usar en template
  
  // Iconos para template
  gridOutline = gridOutline;
  listOutline = listOutline;
  logOutOutline = logOutOutline;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ gridOutline, listOutline, logOutOutline });
  }

  ngOnInit() {
    this.loadProducts();
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategoryId = parseInt(params['category']);
        this.filterByCategory(this.selectedCategoryId);
      }
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterByCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.filteredProducts = this.products.filter(p => {
      const productCategory = this.getProductCategory(p.id);
      return productCategory === categoryId;
    });
    this.currentPage = 1;
  }

  getProductCategory(productId: number): number {
    const categoryMap: { [key: number]: number } = {
      1: 1, 2: 1, 3: 1, 4: 1,    // Laptops
      5: 2, 6: 2, 7: 2, 8: 2,    // Phones
      9: 3, 10: 3, 11: 3,        // Accessories
      12: 4, 13: 4,              // Peripherals
      14: 5, 15: 5               // Monitors
    };
    return categoryMap[productId] || 1;
  }

  clearFilter() {
    this.selectedCategoryId = null;
    this.filteredProducts = this.products;
    this.currentPage = 1;
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo(0, 0);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo(0, 0);
    }
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  onAddToCart(product: Product) {
    console.log('Producto agregado al carrito:', product.name);
  }

  onViewDetails(product: Product) {
    console.log('Ver detalles de:', product.name);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
