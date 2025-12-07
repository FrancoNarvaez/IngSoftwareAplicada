import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonButton, IonBadge, IonIcon, IonImg } from '@ionic/angular/standalone';
import { Product } from '../../models';
import { ProductService } from '../../../services/product.service';
import { star, cartOutline, heartOutline, heart } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonButton, IonBadge, IonIcon, IonImg],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() viewDetails = new EventEmitter<Product>();

  isFavorite = false;
  discountedPrice: number = 0;

  constructor(private productService: ProductService) {
    addIcons({ star, cartOutline, heartOutline, heart });
  }

  ngOnInit() {
    this.discountedPrice = this.productService.calculateDiscountedPrice(this.product);
  }

  onAddToCart() {
    this.addToCart.emit(this.product);
  }

  onViewDetails() {
    this.viewDetails.emit(this.product);
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  get starArray(): any[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(this.product.rating));
  }
}
