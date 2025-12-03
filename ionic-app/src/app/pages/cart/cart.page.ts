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
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonNote,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  trashOutline, 
  addOutline, 
  removeOutline, 
  cartOutline 
} from 'ionicons/icons';
import { CartService, CartItem } from '../../services/cart.service';
import { ApiService, ProductOrder, OrderItem } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
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
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonNote,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner
  ]
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  loading: boolean = false;
  placingOrder: boolean = false;

  constructor(
    private cartService: CartService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    // Registrar iconos
    addIcons({ 
      arrowBackOutline, 
      trashOutline, 
      addOutline, 
      removeOutline, 
      cartOutline 
    });
  }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.cartTotal$.subscribe(total => {
      this.cartTotal = total;
    });
  }

  async increaseQuantity(item: CartItem) {
    if (item.product.id) {
      await this.cartService.updateQuantity(item.product.id, item.quantity + 1);
    }
  }

  async decreaseQuantity(item: CartItem) {
    if (item.product.id && item.quantity > 1) {
      await this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    }
  }

  async removeItem(item: CartItem) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Eliminar ${item.product.name} del carrito?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            if (item.product.id) {
              await this.cartService.removeFromCart(item.product.id);
              await this.showToast('Producto eliminado del carrito', 'success');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async clearCart() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Vaciar todo el carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Vaciar',
          role: 'destructive',
          handler: async () => {
            await this.cartService.clearCart();
            await this.showToast('Carrito vaciado', 'success');
          }
        }
      ]
    });

    await alert.present();
  }

  async checkout() {
    if (this.cartItems.length === 0) {
      await this.showToast('El carrito está vacío', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Pedido',
      message: `¿Realizar pedido por ${this.formatPrice(this.cartTotal)}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.placeOrder();
          }
        }
      ]
    });

    await alert.present();
  }

  private async placeOrder() {
    this.placingOrder = true;

    try {
      // Obtener el usuario actual
      const user = this.authService.getCurrentUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Buscar el customer asociado al usuario
      const customers = await this.apiService.getCustomers().toPromise();
      let customerId = customers?.find(c => c.userLogin === user.login)?.id;

      // Si no existe, crear el customer
      if (!customerId) {
        const newCustomer = await this.apiService.createCustomer({
          firstName: user.firstName || 'Usuario',
          lastName: user.lastName || 'App',
          email: user.email,
          phone: '0000000000',
          addressLine1: 'Dirección no especificada',
          city: 'Ciudad',
          country: 'Argentina',
          gender: 'OTHER'
        }).toPromise();
        customerId = newCustomer?.id;
      }

      if (!customerId) {
        throw new Error('No se pudo crear el cliente');
      }

      // Crear la orden
      const order: ProductOrder = {
        placedDate: new Date().toISOString(),
        status: 'PENDING',
        code: `ORDER-${Date.now()}`,
        customerId: customerId
      };

      const createdOrder = await this.apiService.createProductOrder(order).toPromise();
      
      if (!createdOrder?.id) {
        throw new Error('No se pudo crear la orden');
      }

      // Crear los items de la orden
      for (const item of this.cartItems) {
        if (item.product.id) {
          const orderItem: OrderItem = {
            quantity: item.quantity,
            totalPrice: item.product.price * item.quantity,
            status: 'AVAILABLE',
            productId: item.product.id,
            orderId: createdOrder.id
          };

          await this.apiService.createOrderItem(orderItem).toPromise();
        }
      }

      // Limpiar el carrito
      await this.cartService.clearCart();
      
      this.placingOrder = false;
      await this.showToast('¡Pedido realizado exitosamente!', 'success');
      this.router.navigate(['/products']);

    } catch (error) {
      console.error('Error al realizar pedido:', error);
      this.placingOrder = false;
      await this.showToast('Error al realizar el pedido', 'danger');
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}
