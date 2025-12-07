/**
 * Constantes globales de la aplicación
 */

// ==================== COLORES ====================
export const APP_COLORS = {
  primary: '#0066CC',      // Azul profesional
  secondary: '#FF6B35',    // Naranja energético
  success: '#00CC66',      // Verde
  warning: '#FFCC00',      // Amarillo
  danger: '#FF3333',       // Rojo
  dark: '#1A1A1A',         // Negro profundo
  light: '#F5F5F5',        // Gris claro
  darkGray: '#333333',     // Gris oscuro
  mediumGray: '#666666',   // Gris medio
  lightGray: '#E0E0E0'     // Gris claro
};

// ==================== TAMAÑOS ====================
export const SIZES = {
  xs: 320,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

// ==================== MENSAJES ====================
export const MESSAGES = {
  loading: 'Cargando...',
  error: 'Ha ocurrido un error',
  success: 'Operación completada exitosamente',
  noResults: 'No se encontraron resultados',
  addedToCart: 'Producto agregado al carrito',
  removedFromCart: 'Producto removido del carrito',
  loginRequired: 'Debes iniciar sesión para continuar'
};

// ==================== RUTAS ====================
export const ROUTES = {
  home: '/home',
  products: '/products',
  productDetail: '/products/:id',
  cart: '/cart',
  checkout: '/checkout',
  account: '/account',
  login: '/login',
  orders: '/account/orders'
};

// ==================== PAGINACIÓN ====================
export const PAGINATION = {
  defaultPageSize: 12,
  pageSizeOptions: [6, 12, 24, 48]
};

// ==================== PRECIOS ====================
export const PRICES = {
  minPrice: 0,
  maxPrice: 5000,
  currencySymbol: '$',
  currencyCode: 'USD'
};

// ==================== ENVÍO ====================
export const SHIPPING = {
  free: 0,
  standard: 10,
  express: 25,
  overnight: 50,
  freeThreshold: 100 // Envío gratis a partir de $100
};

// ==================== IMPUESTO ====================
export const TAX_RATE = 0.08; // 8% de impuesto

// ==================== TIEMPO ====================
export const TIME = {
  animationDuration: 300,
  debounceTime: 500,
  autoRefreshInterval: 30000 // 30 segundos
};
