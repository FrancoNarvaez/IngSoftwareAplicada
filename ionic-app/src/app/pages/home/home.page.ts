import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { HeroSectionComponent } from '../../shared/components/hero-section/hero-section.component';
import { CategoryCarouselComponent } from '../../shared/components/category-carousel/category-carousel.component';
import { TrendingProductsComponent } from '../../shared/components/trending-products/trending-products.component';
import { NewsletterSignupComponent } from '../../shared/components/newsletter-signup/newsletter-signup.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    HeroSectionComponent,
    CategoryCarouselComponent,
    TrendingProductsComponent,
    NewsletterSignupComponent
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  constructor() {}
}
