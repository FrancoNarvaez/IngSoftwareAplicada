import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonText,
  IonFab,
  IonFabButton,
  IonRefresher,
  IonRefresherContent,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, logOutOutline, addOutline, checkmarkOutline } from 'ionicons/icons';
import { ApiService, Product } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonText,
    IonFab,
    IonFabButton,
    IonRefresher,
    IonRefresherContent
  ]
})
export class ProductsPage implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  cartCount: number = 0;

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    // Registrar iconos
    addIcons({ cartOutline, logOutOutline, addOutline, checkmarkOutline });
  }

  ngOnInit() {
    this.loadProducts();
    
    // Suscribirse al contador del carrito
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  loadProducts(event?: any) {
    this.loading = !event; // No mostrar spinner si es refresh

    this.apiService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        if (event) {
          event.target.complete();
        }
      },
      error: async (error) => {
        console.error('Error al cargar productos:', error);
        this.loading = false;
        if (event) {
          event.target.complete();
        }
        
        await this.showToast('Error al cargar productos', 'danger');
      }
    });
  }

  async addToCart(product: Product) {
    await this.cartService.addToCart(product, 1);
    await this.showToast(`${product.name} agregado al carrito`, 'success');
  }

  isInCart(productId: number | undefined): boolean {
    if (!productId) return false;
    return this.cartService.isInCart(productId);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  async logout() {
    await this.authService.logout();
    await this.showToast('Sesión cerrada', 'success');
    this.router.navigate(['/login']);
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  }
}
