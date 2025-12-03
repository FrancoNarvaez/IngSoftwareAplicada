# Ionic Store App

Aplicación móvil/PWA desarrollada con Ionic + Angular + Capacitor para el microservicio Store.

## 📱 Características

- **Autenticación JWT**: Login con usuarios del sistema (admin/admin, user/user)
- **Catálogo de Productos**: Listado responsive con imágenes, precios y categorías
- **Carrito de Compras**: Gestión de productos con persistencia local (Capacitor Preferences)
- **Checkout**: Creación de órdenes mediante la API del gateway
- **Diseño Responsive**: Optimizado para móviles, tablets y desktop
- **Offline-First**: Carrito persiste localmente aunque no haya conexión

## 🛠️ Tecnologías

- **Ionic 8**: Framework de UI multiplataforma
- **Angular 18**: Standalone Components
- **Capacitor 6**: Runtime nativo para iOS/Android/Web
- **TypeScript**: Tipado estático
- **RxJS**: Programación reactiva

## 📦 Estructura del Proyecto

```
src/
├── app/
│   ├── services/
│   │   ├── auth.service.ts          # Manejo de autenticación JWT
│   │   ├── api.service.ts            # Cliente HTTP para las APIs
│   │   └── cart.service.ts           # Gestión del carrito de compras
│   ├── pages/
│   │   ├── login/                    # Página de inicio de sesión
│   │   ├── products/                 # Listado de productos
│   │   └── cart/                     # Carrito y checkout
│   ├── interceptors/
│   │   └── auth.interceptor.ts       # Interceptor HTTP para JWT
│   ├── app.routes.ts                 # Configuración de rutas + guards
│   └── app.component.ts
├── environments/
│   ├── environment.ts                # Config desarrollo (apiUrl: localhost:8080)
│   └── environment.prod.ts           # Config producción
└── main.ts                           # Bootstrap de la aplicación
```

## 🚀 Instalación y Ejecución

### Prerequisitos

- Node.js 18+ y npm
- Docker Desktop con Compose (para levantar el backend)
- El gateway y microservicios deben estar corriendo (ver [../docs/GETTING_STARTED.md](../docs/GETTING_STARTED.md))

### Pasos

1. **Instalar dependencias**:
   ```bash
   cd ionic-app
   npm install
   ```

2. **Levantar el backend** (en otra terminal):
   ```bash
   cd ..
   docker-compose up -d
   ```

3. **Iniciar la app Ionic**:
   ```bash
   npm start
   # O alternativamente:
   npx ionic serve
   ```

4. **Abrir en el navegador**:
   - La app se abre automáticamente en [http://localhost:8100](http://localhost:8100)

## 👤 Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin`    | Administrador |
| `user`  | `user`     | Usuario |

## 📱 Funcionalidades

### 1. Login (`/login`)

- Formulario con usuario/contraseña
- Checkbox "Recordarme"
- Almacena JWT en Capacitor Preferences
- Redirige a `/products` al autenticar

### 2. Productos (`/products`)

- **Grid Responsive**: 1 columna (móvil), 2 (tablet), 3 (desktop)
- **Imágenes**: Muestra `product.image` en base64 o placeholder
- **Filtros**: Por categoría y talla (próximamente)
- **Agregar al Carrito**: Botón con feedback visual
- **Badge del Carrito**: Muestra cantidad de items
- **Pull to Refresh**: Actualiza el listado
- **Logout**: Cierra sesión y limpia el token

### 3. Carrito (`/cart`)

- **Lista de Items**: Con imagen, nombre, precio unitario y subtotal
- **Controles de Cantidad**: +/- para ajustar cantidades
- **Eliminar Items**: Botón de papelera con confirmación
- **Resumen**: Total calculado dinámicamente
- **Checkout**: Crea `ProductOrder` y `OrderItem` en el backend
- **Vaciar Carrito**: Elimina todos los items con confirmación

### 4. Checkout

Al confirmar pedido:
1. Obtiene el `Customer` asociado al usuario autenticado (o lo crea)
2. Crea una `ProductOrder` con estado `PENDING`
3. Crea un `OrderItem` por cada producto en el carrito
4. Limpia el carrito local
5. Redirige a `/products` con notificación de éxito

## 🔒 Seguridad

- **Guards**: `authGuard` protege rutas autenticadas, `loginGuard` evita acceso al login si ya está autenticado
- **Interceptor HTTP**: Agrega automáticamente el header `Authorization: Bearer <token>` a todas las requests
- **Token Storage**: JWT almacenado de forma segura con Capacitor Preferences

## 🎨 Estilizado

- **Ionic Design System**: Componentes nativos con look & feel iOS/Android
- **Tema**: Color primario azul, modo claro/oscuro automático
- **CSS Variables**: Fácil personalización en `global.scss`

## 🧪 Testing

```bash
# Unit tests (Jasmine + Karma)
npm test

# E2E tests (con Cypress, apuntando al gateway)
npm run e2e
```

## 📦 Build para Producción

### Web (PWA)

```bash
npm run build
# Output en: www/
```

### iOS

```bash
npx ionic cap add ios
npx ionic cap sync ios
npx ionic cap open ios
```

### Android

```bash
npx ionic cap add android
npx ionic cap sync android
npx ionic cap open android
```

## 🔧 Configuración

### Cambiar URL del API Gateway

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://tu-gateway-aqui:8080'
};
```

### Agregar PWA (Service Worker)

```bash
ng add @angular/pwa
```

Esto genera:
- `ngsw-config.json`: Configuración de cache
- `manifest.webmanifest`: Metadatos de la PWA
- Service Worker para funcionamiento offline

## 📝 API Endpoints Utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/authenticate` | Login (obtiene JWT) |
| `GET`  | `/api/account` | Info del usuario autenticado |
| `GET`  | `/api/products` | Listar productos |
| `GET`  | `/api/product-categories` | Categorías |
| `GET`  | `/api/customers` | Clientes |
| `POST` | `/api/customers` | Crear cliente |
| `POST` | `/api/product-orders` | Crear orden |
| `POST` | `/api/order-items` | Crear item de orden |

## 🐛 Troubleshooting

### Error de CORS

Si ves errores de CORS, verifica que el gateway tenga configurado:

```yaml
# store/src/main/resources/config/application-dev.yml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "http://localhost:8100"
            allowedMethods: "*"
            allowedHeaders: "*"
```

### Token inválido (401)

1. Verifica que los JWT secrets sean iguales en `store`, `invoice` y `notification`
2. Limpia el storage: DevTools → Application → Local Storage → Clear

### Cannot connect to server

1. Verifica que el gateway esté corriendo: `docker ps | grep store`
2. Prueba el endpoint manualmente: `curl http://localhost:8080/api/products`
3. Revisa logs del gateway: `docker logs store`

## 📚 Recursos

- [Ionic Docs](https://ionicframework.com/docs)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Angular Docs](https://angular.dev)
- [Documentación del Proyecto](../docs/GETTING_STARTED.md)

## 🤝 Contribución

Este proyecto es parte del trabajo final de Ingeniería de Software Aplicada.

## 📄 Licencia

Proyecto académico - Universidad XYZ - 2025
