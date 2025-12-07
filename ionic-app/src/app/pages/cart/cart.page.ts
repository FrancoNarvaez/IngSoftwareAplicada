import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonProgressBar,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  trashOutline, 
  addOutline, 
  removeOutline, 
  cartOutline,
  checkmarkCircleOutline,
  homeOutline,
  cardOutline,
  checkmarkOutline
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
    FormsModule,
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
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonProgressBar
  ]
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  loading: boolean = false;
  placingOrder: boolean = false;

  // Checkout states
  checkoutStep: 'cart' | 'shipping' | 'payment' | 'confirmation' = 'cart';
  confirmedItems: CartItem[] = []; // Propiedad dedicada para la vista de confirmación
  shippingData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Argentina'
  };

  paymentData = {
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  shippingMethods = [
    { id: 'standard', name: 'Envío Estándar (5-7 días)', cost: 0, selected: true },
    { id: 'express', name: 'Envío Express (2-3 días)', cost: 299, selected: false }
  ];
  selectedShipping = this.shippingMethods[0];
  shippingCost: number = 0;

  confirmationData: any = null;

  constructor(
    private cartService: CartService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    // Registrar iconos
    addIcons({ 
      arrowBackOutline, 
      trashOutline, 
      addOutline, 
      removeOutline, 
      cartOutline,
      checkmarkCircleOutline,
      homeOutline,
      cardOutline,
      checkmarkOutline
    });
  }

  ngOnInit() {
    this.loadCart();
    this.loadUserData();
  }

  loadCart() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.cartTotal$.subscribe(total => {
      this.cartTotal = total;
    });
  }

  loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.shippingData.firstName = user.firstName || '';
      this.shippingData.lastName = user.lastName || '';
      this.shippingData.email = user.email || '';
    }
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

  // Checkout flow methods
  async proceedToCheckout() {
    if (this.cartItems.length === 0) {
      await this.showToast('El carrito está vacío', 'warning');
      return;
    }
    this.checkoutStep = 'shipping';
  }

  goToPreviousStep() {
    if (this.checkoutStep === 'shipping') {
      this.checkoutStep = 'cart';
    } else if (this.checkoutStep === 'payment') {
      this.checkoutStep = 'shipping';
    } else if (this.checkoutStep === 'confirmation') {
      this.checkoutStep = 'payment';
    }
  }

  async proceedToPayment() {
    if (!this.validateShippingData()) {
      return;
    }
    this.checkoutStep = 'payment';
  }

  async proceedToConfirmation() {
    if (!this.validatePaymentData()) {
      return;
    }
    await this.finalizeOrder();
  }

  selectShippingMethod(method: any) {
    this.shippingMethods.forEach(m => m.selected = false);
    method.selected = true;
    this.selectedShipping = method;
    this.shippingCost = method.cost;
  }

  private validateShippingData(): boolean {
    if (!this.shippingData.firstName?.trim()) {
      this.showToast('Por favor ingresa tu nombre', 'warning');
      return false;
    }
    if (!this.shippingData.lastName?.trim()) {
      this.showToast('Por favor ingresa tu apellido', 'warning');
      return false;
    }
    if (!this.shippingData.email?.trim()) {
      this.showToast('Por favor ingresa tu email', 'warning');
      return false;
    }
    if (!this.shippingData.addressLine1?.trim()) {
      this.showToast('Por favor ingresa tu dirección', 'warning');
      return false;
    }
    if (!this.shippingData.city?.trim()) {
      this.showToast('Por favor ingresa tu ciudad', 'warning');
      return false;
    }
    return true;
  }

  private validatePaymentData(): boolean {
    if (!this.paymentData.cardHolder?.trim()) {
      this.showToast('Por favor ingresa el titular de la tarjeta', 'warning');
      return false;
    }
    if (!this.paymentData.cardNumber?.replace(/\s/g, '').match(/^\d{13,19}$/)) {
      this.showToast('Por favor ingresa un número de tarjeta válido', 'warning');
      return false;
    }
    if (!this.paymentData.expiryDate?.match(/^\d{2}\/\d{2}$/)) {
      this.showToast('Por favor usa el formato MM/AA', 'warning');
      return false;
    }
    if (!this.paymentData.cvv?.match(/^\d{3,4}$/)) {
      this.showToast('Por favor ingresa un CVV válido', 'warning');
      return false;
    }
    return true;
  }

  async finalizeOrder() {
    this.placingOrder = true;
    
    // Capturar estado actual del carrito directamente de la propiedad del componente
    // Esto asegura que usamos exactamente lo que el usuario está viendo
    const currentItems = JSON.parse(JSON.stringify(this.cartItems));
    const currentTotal = this.cartTotal;
    const currentShippingCost = this.shippingCost;

    console.log('Iniciando finalizar compra. Items:', currentItems.length);

    if (currentItems.length === 0) {
      this.showToast('El carrito está vacío', 'warning');
      this.placingOrder = false;
      return;
    }

    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const customers = await this.apiService.getCustomers().toPromise();
      let customerId = customers?.find(c => c.userId === user.id || c.user?.login === user.login)?.id;

      if (!customerId) {
        let email = this.shippingData.email;
        if (email === 'admin@localhost' || email === 'user@localhost') {
          email = email.replace('@localhost', '@localhost.com');
        }
        
        const newCustomer = await this.apiService.createCustomer({
          firstName: this.shippingData.firstName,
          lastName: this.shippingData.lastName,
          email: email,
          phone: this.shippingData.phone,
          addressLine1: this.shippingData.addressLine1,
          city: this.shippingData.city,
          country: this.shippingData.country,
          gender: 'OTHER',
          userId: user.id
        }).toPromise();
        customerId = newCustomer?.id;
      }

      if (!customerId) {
        throw new Error('No se pudo crear el cliente');
      }

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

      for (const item of currentItems) {
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

      // Guardar datos de confirmación usando los datos capturados
      this.confirmedItems = [...currentItems]; // Guardar en propiedad dedicada

      this.confirmationData = {
        orderId: createdOrder.id,
        orderCode: createdOrder.code,
        date: new Date(),
        shippingData: { ...this.shippingData },
        shippingMethod: { ...this.selectedShipping },
        items: this.confirmedItems,
        subtotal: currentTotal,
        shippingCost: currentShippingCost,
        total: currentTotal + currentShippingCost
      };

      console.log('Datos de confirmación establecidos. Items:', this.confirmedItems.length);

      await this.cartService.clearCart();
      console.log('Carrito limpiado');
      
      this.placingOrder = false;
      this.checkoutStep = 'confirmation';
      this.cdr.detectChanges(); // Force update view

    } catch (error) {
      console.error('Error al realizar pedido:', error);
      this.placingOrder = false;
      await this.showToast('Error al realizar el pedido', 'danger');
    }
  }

  continueShopping() {
    this.checkoutStep = 'cart';
    this.cartItems = [];
    this.cartTotal = 0;
    this.resetCheckout();
    this.router.navigate(['/products']);
  }

  private resetCheckout() {
    this.shippingData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Argentina'
    };
    this.paymentData = {
      cardHolder: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    };
  }

  goBack() {
    if (this.checkoutStep === 'cart') {
      this.router.navigate(['/products']);
    } else {
      this.goToPreviousStep();
    }
  }

  getProgressPercentage(): number {
    const steps = { 'cart': 25, 'shipping': 50, 'payment': 75, 'confirmation': 100 };
    return steps[this.checkoutStep] || 0;
  }

  getOrderTotal(): number {
    return this.cartTotal + this.shippingCost;
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
