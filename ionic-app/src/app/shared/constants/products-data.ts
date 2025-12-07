/**
 * Datos realistas de productos para tienda tech
 * Categoría: Electrónica y Tecnología
 */

import { Product, Category } from './index';

// ==================== CATEGORÍAS ====================
export const PRODUCT_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Laptops & Computadoras',
    description: 'Laptops de última generación para trabajo y entretenimiento',
    icon: 'laptop',
    image: 'assets/categories/laptops.jpg',
    productCount: 12
  },
  {
    id: 2,
    name: 'Smartphones & Tablets',
    description: 'Dispositivos móviles de los mejores fabricantes',
    icon: 'phone-portrait',
    image: 'assets/categories/smartphones.jpg',
    productCount: 18
  },
  {
    id: 3,
    name: 'Accesorios Tech',
    description: 'Accesorios y complementos de calidad premium',
    icon: 'headset',
    image: 'assets/categories/accesorios.jpg',
    productCount: 25
  },
  {
    id: 4,
    name: 'Periféricos',
    description: 'Teclados, mouses y otros periféricos',
    icon: 'settings',
    image: 'assets/categories/perifericos.jpg',
    productCount: 15
  },
  {
    id: 5,
    name: 'Monitores & Displays',
    description: 'Pantallas de alta resolución para profesionales',
    icon: 'tv',
    image: 'assets/categories/monitores.jpg',
    productCount: 8
  }
];

// ==================== PRODUCTOS ====================
export const MOCK_PRODUCTS: Product[] = [
  // LAPTOPS
  {
    id: 1,
    name: 'MacBook Pro 16" M4 Max',
    description: 'Laptop profesional con procesador M4 Max. Perfecta para diseño, programación y edición de video.',
    price: 3499.99,
    originalPrice: 3999.99,
    discount: 12,
    category: 'Laptops & Computadoras',
    image: 'assets/products/macbook-pro-16.jpg',
    specs: {
      'Procesador': 'Apple M4 Max',
      'Memoria RAM': '16GB',
      'Almacenamiento': '512GB SSD',
      'Pantalla': '16 inch Liquid Retina XDR',
      'GPU': '10-core GPU',
      'Batería': '140Wh'
    },
    rating: 4.8,
    reviewCount: 245,
    inStock: true,
    sku: 'MBP16-M4-512',
    tags: ['Premium', 'Profesional', 'Apple']
  },
  {
    id: 2,
    name: 'Dell XPS 15 Plus',
    description: 'Laptop de precisión con pantalla OLED. Ideal para creadores de contenido.',
    price: 2799.99,
    originalPrice: 3199.99,
    discount: 12,
    category: 'Laptops & Computadoras',
    image: 'assets/products/dell-xps-15.jpg',
    specs: {
      'Procesador': 'Intel Core i9 13th Gen',
      'Memoria RAM': '32GB DDR5',
      'Almacenamiento': '1TB NVMe SSD',
      'Pantalla': '15.6 inch OLED 3.5K',
      'GPU': 'NVIDIA RTX 4080',
      'Peso': '1.95 kg'
    },
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    sku: 'XPS15-I9-32',
    tags: ['Premium', 'Creativo', 'Windows']
  },
  {
    id: 3,
    name: 'Lenovo ThinkPad X1 Carbon',
    description: 'Laptop empresarial ultraligero con seguridad de nivel militar.',
    price: 1899.99,
    originalPrice: 2199.99,
    discount: 13,
    category: 'Laptops & Computadoras',
    image: 'assets/products/lenovo-x1.jpg',
    specs: {
      'Procesador': 'Intel Core i7 vPro',
      'Memoria RAM': '16GB DDR5',
      'Almacenamiento': '512GB SSD',
      'Pantalla': '14 inch FHD IPS',
      'Teclado': 'Chiclet backlit',
      'Seguridad': 'TPM 2.0, Fingerprint'
    },
    rating: 4.6,
    reviewCount: 156,
    inStock: true,
    sku: 'X1C-I7-16',
    tags: ['Empresarial', 'Seguridad', 'Ultraligero']
  },
  {
    id: 4,
    name: 'ASUS VivoBook 15 OLED',
    description: 'Laptop versátil con pantalla OLED de excelente calidad color.',
    price: 899.99,
    category: 'Laptops & Computadoras',
    image: 'assets/products/asus-vivobook.jpg',
    specs: {
      'Procesador': 'AMD Ryzen 7 5800H',
      'Memoria RAM': '16GB DDR4',
      'Almacenamiento': '512GB SSD',
      'Pantalla': '15.6 inch OLED FHD',
      'GPU': 'Radeon Graphics',
      'Batería': '63Wh'
    },
    rating: 4.5,
    reviewCount: 234,
    inStock: true,
    sku: 'VIVO15-R7-16',
    tags: ['Presupuesto', 'OLED', 'Portable']
  },

  // SMARTPHONES
  {
    id: 5,
    name: 'iPhone 15 Pro Max',
    description: 'Smartphone premium con A17 Pro, cámara de 48MP y grabación en 4K.',
    price: 1199.99,
    category: 'Smartphones & Tablets',
    image: 'assets/products/iphone-15-pro-max.jpg',
    specs: {
      'Procesador': 'Apple A17 Pro',
      'Pantalla': '6.7 inch Super Retina XDR',
      'Almacenamiento': '256GB',
      'Cámara Principal': '48MP',
      'Zoom Óptico': '5x',
      'Batería': 'Super batería de larga duración'
    },
    rating: 4.9,
    reviewCount: 542,
    inStock: true,
    sku: 'IP15PM-256',
    tags: ['Premium', 'iOS', 'Cámara profesional']
  },
  {
    id: 6,
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Flagship Android con pantalla Dynamic AMOLED y procesador Snapdragon 8 Gen 3.',
    price: 1299.99,
    originalPrice: 1399.99,
    discount: 7,
    category: 'Smartphones & Tablets',
    image: 'assets/products/samsung-s24-ultra.jpg',
    specs: {
      'Procesador': 'Snapdragon 8 Gen 3',
      'Pantalla': '6.8 inch Dynamic AMOLED',
      'Almacenamiento': '256GB',
      'Cámara Principal': '200MP',
      'Zoom': 'Zoom óptico 10x + digital',
      'Batería': '5000mAh'
    },
    rating: 4.8,
    reviewCount: 389,
    inStock: true,
    sku: 'SGS24U-256',
    tags: ['Premium', 'Android', 'Zoom avanzado']
  },
  {
    id: 7,
    name: 'Google Pixel 8 Pro',
    description: 'Smartphone con IA avanzada y cámara computacional increíble.',
    price: 999.99,
    category: 'Smartphones & Tablets',
    image: 'assets/products/google-pixel-8-pro.jpg',
    specs: {
      'Procesador': 'Google Tensor G3',
      'Pantalla': '6.7 inch LTPO OLED',
      'Almacenamiento': '256GB',
      'Cámara Principal': '50MP',
      'Cámara Ultra Angular': '128MP',
      'IA': 'Pixel AI integrada'
    },
    rating: 4.7,
    reviewCount: 267,
    inStock: true,
    sku: 'PIXEL8P-256',
    tags: ['Premium', 'IA', 'Google']
  },
  {
    id: 8,
    name: 'iPad Pro 12.9" M4',
    description: 'Tablet profesional con pantalla Liquid Retina y Apple Pencil Pro compatible.',
    price: 1199.99,
    originalPrice: 1299.99,
    discount: 8,
    category: 'Smartphones & Tablets',
    image: 'assets/products/ipad-pro-12.jpg',
    specs: {
      'Procesador': 'Apple M4',
      'Pantalla': '12.9 inch Liquid Retina XDR',
      'Almacenamiento': '256GB',
      'RAM': '8GB',
      'Cámaras': '12MP + 12MP',
      'Conectividad': 'Wi-Fi 7'
    },
    rating: 4.8,
    reviewCount: 178,
    inStock: true,
    sku: 'IPADP12-M4',
    tags: ['Premium', 'Tablet profesional', 'CreativoS']
  },

  // ACCESORIOS
  {
    id: 9,
    name: 'Sony WH-1000XM5 - Auriculares Inalámbricos',
    description: 'Auriculares premium con cancelación de ruido líder en la industria.',
    price: 399.99,
    originalPrice: 449.99,
    discount: 11,
    category: 'Accesorios Tech',
    image: 'assets/products/sony-xm5.jpg',
    specs: {
      'Tipo': 'Over-ear inalámbricos',
      'Cancelación Ruido': 'Adaptativa de IA',
      'Batería': '40 horas',
      'Conectividad': 'Bluetooth 5.3',
      'Codecs': 'LDAC',
      'Peso': '250g'
    },
    rating: 4.9,
    reviewCount: 1203,
    inStock: true,
    sku: 'SONY-WH-XM5',
    tags: ['Premium audio', 'Cancelación ruido', 'Inalámbrico']
  },
  {
    id: 10,
    name: 'Apple AirPods Pro 2',
    description: 'Auriculares verdaderamente inalámbricos con cancelación de ruido activa.',
    price: 249.99,
    category: 'Accesorios Tech',
    image: 'assets/products/airpods-pro-2.jpg',
    specs: {
      'Tipo': 'In-ear inalámbricos',
      'Cancelación Ruido': 'Activa adaptativa',
      'Batería': '6 horas + 30 con estuche',
      'Conectividad': 'Bluetooth 5.3',
      'Audio Espacial': 'Sí, dinámico',
      'Sumergibles': 'IPX4'
    },
    rating: 4.8,
    reviewCount: 856,
    inStock: true,
    sku: 'AIRPODS-PRO2',
    tags: ['Premium', 'Apple', 'Inalámbrico']
  },
  {
    id: 11,
    name: 'Anker PowerCore Ultra 100W',
    description: 'Cargador rápido multi-dispositivo con tecnología GaN.',
    price: 89.99,
    category: 'Accesorios Tech',
    image: 'assets/products/anker-powercore.jpg',
    specs: {
      'Potencia': '100W',
      'Puertos': '2 USB-C + 1 USB-A',
      'Materiales': 'Aluminio',
      'Tamaño': 'Compacto',
      'Compatibilidad': 'Universal',
      'Tecnología': 'GaN avanzada'
    },
    rating: 4.7,
    reviewCount: 524,
    inStock: true,
    sku: 'ANKER-POWER100',
    tags: ['Cargador', 'Rápido', 'Portátil']
  },

  // PERIFÉRICOS
  {
    id: 12,
    name: 'Logitech MX Master 3S',
    description: 'Mouse profesional inalámbrico de precisión con rueda smooth.',
    price: 99.99,
    category: 'Periféricos',
    image: 'assets/products/logitech-mx.jpg',
    specs: {
      'Tipo': 'Inalámbrico',
      'Sensor': '8K DPI',
      'Batería': '70 días',
      'Conectividad': 'USB + Bluetooth',
      'Botones': 8 programables,
      'Ergonomía': 'Profesional'
    },
    rating: 4.9,
    reviewCount: 678,
    inStock: true,
    sku: 'LOGI-MX3S',
    tags: ['Profesional', 'Precisión', 'Inalámbrico']
  },
  {
    id: 13,
    name: 'Corsair K95 Platinum XT - Teclado Mecánico',
    description: 'Teclado gaming de calidad premium con switches mecánicos Cherry MX.',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    category: 'Periféricos',
    image: 'assets/products/corsair-k95.jpg',
    specs: {
      'Tipo': 'Mecánico',
      'Switches': 'Cherry MX Red',
      'Retroiluminación': 'RGB per-key',
      'Conectividad': 'USB',
      'Programable': 'Sí, macros',
      'Material': 'Aluminio'
    },
    rating: 4.8,
    reviewCount: 445,
    inStock: true,
    sku: 'CORSAIR-K95',
    tags: ['Gaming', 'Mecánico', 'RGB']
  },

  // MONITORES
  {
    id: 14,
    name: 'LG UltraWide 34" OLED',
    description: 'Monitor ultra ancho con panel OLED para creadores y profesionales.',
    price: 1499.99,
    originalPrice: 1699.99,
    discount: 12,
    category: 'Monitores & Displays',
    image: 'assets/products/lg-ultrawide-34.jpg',
    specs: {
      'Tamaño': '34 inch ultra ancho',
      'Resolución': '3440 x 1440',
      'Panel': 'OLED',
      'Refresh Rate': '240Hz',
      'Respuesta': '0.1ms',
      'Conectividad': 'USB-C, HDMI, DP'
    },
    rating: 4.9,
    reviewCount: 234,
    inStock: true,
    sku: 'LG-OLED34',
    tags: ['Profesional', 'OLED', 'Ultra ancho']
  },
  {
    id: 15,
    name: 'Dell S3423DWC 34" Curved',
    description: 'Monitor 34 pulgadas curvado para inmersión total en trabajo y entretenimiento.',
    price: 899.99,
    category: 'Monitores & Displays',
    image: 'assets/products/dell-s3423.jpg',
    specs: {
      'Tamaño': '34 inch',
      'Resolución': '3440 x 1440',
      'Panel': 'IPS',
      'Curvatura': '1900R',
      'Refresh Rate': '60Hz',
      'USB-C': '90W carga'
    },
    rating: 4.7,
    reviewCount: 289,
    inStock: true,
    sku: 'DELL-S3423',
    tags: ['Productividad', 'Curvado', 'Profesional']
  }
];

// ==================== HELPERS ====================
export function getProductsByCategory(categoryName: string): Product[] {
  return MOCK_PRODUCTS.filter(p => p.category === categoryName);
}

export function getProductById(id: number): Product | undefined {
  return MOCK_PRODUCTS.find(p => p.id === id);
}

export function getNewProducts(limit: number = 5): Product[] {
  return MOCK_PRODUCTS.slice(0, limit);
}

export function getFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS.filter(p => p.rating >= 4.7);
}

export function getDiscountedProducts(): Product[] {
  return MOCK_PRODUCTS.filter(p => p.discount && p.discount > 0).sort((a, b) => (b.discount || 0) - (a.discount || 0));
}
