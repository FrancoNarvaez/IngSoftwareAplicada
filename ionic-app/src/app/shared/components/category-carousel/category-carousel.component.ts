import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonButton, IonBadge, IonIcon, IonGrid, IonRow, IonCol, IonSkeletonText } from '@ionic/angular/standalone';
import { ProductService } from '../../../services/product.service';
import { Category } from '../../models';
import { RouterLink } from '@angular/router';
import { arrowForward } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-category-carousel',
  standalone: true,
  imports: [
    CommonModule,
    IonCard, IonCardContent, IonButton, IonBadge, IonIcon, IonGrid, IonRow, IonCol, IonSkeletonText,
    RouterLink
  ],
  templateUrl: './category-carousel.component.html',
  styleUrls: ['./category-carousel.component.scss']
})
export class CategoryCarouselComponent implements OnInit {
  categories: Category[] = [];
  loading = true;

  constructor(private productService: ProductService) {
    addIcons({ arrowForward });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getCategoryIcon(categoryId: number): string {
    const icons: { [key: number]: string } = {
      1: '💻',
      2: '📱',
      3: '🎧',
      4: '⌨️',
      5: '🖥️'
    };
    return icons[categoryId] || '🛒';
  }

  getProductCount(categoryId: number): number {
    const counts: { [key: number]: number } = {
      1: 4, // Laptops
      2: 4, // Phones
      3: 3, // Accessories
      4: 2, // Peripherals
      5: 2  // Monitors
    };
    return counts[categoryId] || 0;
  }
}
