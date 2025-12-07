import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendSharp } from 'ionicons/icons';

@Component({
  selector: 'app-newsletter-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, IonInput, IonIcon],
  templateUrl: './newsletter-signup.component.html',
  styleUrls: ['./newsletter-signup.component.scss']
})
export class NewsletterSignupComponent {
  @ViewChild('emailInput') emailInput!: ElementRef;
  
  email = '';
  subscribed = false;
  loading = false;

  constructor() {
    addIcons({ sendSharp });
  }

  onSubscribe() {
    if (!this.email || !this.isValidEmail(this.email)) {
      alert('Por favor, ingresa un email válido');
      return;
    }

    this.loading = true;
    
    // Simular suscripción (en producción sería una llamada API)
    setTimeout(() => {
      this.subscribed = true;
      this.loading = false;
      this.email = '';
      
      // Resetear estado después de 3 segundos
      setTimeout(() => {
        this.subscribed = false;
      }, 3000);
    }, 600);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSubscribe();
    }
  }
}
