import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, logInOutline } from 'ionicons/icons';
import { HeroSectionComponent } from '../../shared/components/hero-section/hero-section.component';
import { CategoryCarouselComponent } from '../../shared/components/category-carousel/category-carousel.component';
import { TrendingProductsComponent } from '../../shared/components/trending-products/trending-products.component';
import { NewsletterSignupComponent } from '../../shared/components/newsletter-signup/newsletter-signup.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonBadge,
    HeroSectionComponent,
    CategoryCarouselComponent,
    TrendingProductsComponent,
    NewsletterSignupComponent
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  isAuthenticated$: Observable<boolean>;
  cartCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {
    addIcons({ cartOutline, logInOutline });
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.cartCount$ = this.cartService.cartCount$;
  }

  ngOnInit() {}
}
