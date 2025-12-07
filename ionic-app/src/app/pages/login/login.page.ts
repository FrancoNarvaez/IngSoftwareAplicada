import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCheckbox,
  IonText,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCheckbox,
    IonText,
    IonSpinner
  ]
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Si ya está autenticado, redirigir a productos
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/products']);
    }
  }

  async onLogin() {
    if (!this.username || !this.password) {
      await this.showToast('Por favor ingresa usuario y contraseña', 'warning');
      return;
    }

    this.loading = true;
    
    this.authService.login({
      username: this.username,
      password: this.password,
      rememberMe: this.rememberMe
    }).subscribe({
      next: async () => {
        this.loading = false;
        await this.showToast('¡Bienvenido!', 'success');
        this.router.navigate(['/products']);
      },
      error: async (error) => {
        this.loading = false;
        
        let message = 'Error al iniciar sesión';
        if (error.status === 401) {
          message = 'Usuario o contraseña incorrectos';
        } else if (error.status === 0) {
          message = 'No se puede conectar al servidor';
        }
        
        await this.showToast(message, 'danger');
      }
    });
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
}
