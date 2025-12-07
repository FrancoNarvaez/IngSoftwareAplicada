import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonBadge, IonText } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, IonButton, IonBadge, IonText, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent {
  @Input() title: string = 'Tienda Tech';
  @Input() subtitle: string = 'Las mejores tecnologías a tu alcance';
  @Input() backgroundImage: string = 'assets/images/hero-bg.jpg';
  @Input() promotion: { badge: string; discount: number } = { badge: 'Flash Sale', discount: 25 };
  @Input() cta: { text: string; route: string } = { text: 'Explorar Productos', route: '/products' };
}
