import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trending-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    IonButton, IonGrid, IonRow, IonCol,
    RouterLink
  ],
  templateUrl: './trending-products.component.html',
  styleUrls: ['./trending-products.component.scss']
})
export class TrendingProductsComponent implements OnInit {
  trendingProducts: Product[] = [];
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadTrendingProducts();
  }

  loadTrendingProducts() {
    this.productService.getTrendingProducts().subscribe({
      next: (data) => {
        this.trendingProducts = data.slice(0, 8); // Mostrar máximo 8 productos
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onAddToCart(product: Product) {
    console.log('Producto agregado al carrito:', product.name);
    // Aquí irá la lógica de agregar al carrito
  }

  onViewDetails(product: Product) {
    console.log('Ver detalles de:', product.name);
    // Aquí irá la navegación al detalle del producto
  }
}
