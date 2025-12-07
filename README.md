# TechStore - E-commerce Application

## 📋 Descripción
Aplicación de comercio electrónico moderna desarrollada para la asignatura **Ingeniería de Software Aplicada**. El sistema implementa una arquitectura robusta con un backend reactivo en Spring Boot y un frontend "Mobile-First" desarrollado con Ionic y Angular, optimizado para funcionar como una PWA (Progressive Web App).

## 🚀 Tecnologías

### Frontend (`ionic-app`)
- **Framework**: Angular 15+ & Ionic 7
- **Lenguaje**: TypeScript 5 (Strict Mode)
- **Estilos**: SCSS (Optimizado con presupuestos de rendimiento)
- **Arquitectura**: Componentes Standalone
- **PWA**: Soporte Offline completo con Service Workers y estrategia de precarga (prefetch).

### Backend (`store`)
- **Framework**: Spring Boot 3.x (Generado con JHipster)
- **Lenguaje**: Java 21
- **Base de Datos**: MySQL 8.0
- **Persistencia**: R2DBC (Reactive Relational Database Connectivity)
- **API**: RESTful con documentación Swagger/OpenAPI

## 🛠️ Requisitos Previos
- **Java**: JDK 21
- **Node.js**: v18 o superior
- **MySQL**: Servicio corriendo en el puerto 3306

## ⚙️ Instalación y Ejecución

### 1. Configuración de Base de Datos
El proyecto está configurado para conectar a una instancia local de MySQL.
- **Base de datos**: `store`
- **Usuario**: `root`
- **Contraseña**: `(vacía)`
- **Puerto**: `3306`

Asegúrate de que el servicio MySQL esté activo:
```bash
sudo systemctl status mysql
```

### 2. Iniciar Backend (Store Service)
```bash
cd store
./mvnw spring-boot:run
```
- **URL API**: `http://localhost:8080/api`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`

### 3. Iniciar Frontend (Ionic App)
```bash
cd ionic-app
npm install  # Solo la primera vez
npm start
```
- **URL App**: `http://localhost:4200`

## ✨ Funcionalidades Principales

### 🛒 Experiencia de Compra
- **Catálogo Interactivo**: Grid de productos con imágenes reales, filtrado y categorías.
- **Carrito Avanzado**: Flujo de checkout en 4 pasos:
  1.  **Carrito**: Gestión de items y cantidades.
  2.  **Envío**: Formulario de datos de entrega.
  3.  **Pago**: Selección de método de pago.
  4.  **Confirmación**: Resumen de orden y validación final.

### 📱 Progressive Web App (PWA)
- **Modo Offline**: La aplicación descarga y cachea todos los recursos (imágenes, estilos, scripts) para funcionar sin conexión a internet.
- **Instalable**: Puede instalarse como una aplicación nativa en dispositivos móviles y escritorio.

## 📂 Estructura del Proyecto

```
/
├── ionic-app/       # Frontend (Angular/Ionic)
├── store/           # Backend Principal (Spring Boot)
├── invoice/         # Microservicio de Facturación (Estructura)
├── notification/    # Microservicio de Notificaciones (Estructura)
├── jdl/             # Definiciones de modelo JHipster
└── docs/            # Documentación adicional
```

## 🧪 Testing

### Pruebas Unitarias (Frontend)
Para ejecutar las pruebas unitarias del frontend (Karma/Jasmine):
```bash
cd ionic-app
npm test
```

### Pruebas End-to-End (Cypress)
El proyecto incluye una suite completa de pruebas E2E con Cypress ubicadas en el directorio `store/src/test/javascript/cypress/`. Estas pruebas verifican flujos críticos como autenticación, gestión de cuenta y checkout.

#### Requisitos para E2E
Asegúrate de tener el backend y el frontend corriendo antes de iniciar Cypress, o utiliza los comandos que levantan todo el entorno.

#### Ejecutar Cypress (Modo Interactivo)
Abre la interfaz gráfica de Cypress para ver los tests correr en tiempo real:
```bash
cd store
npm run cypress
```

#### Ejecutar Cypress (Modo Headless)
Para integración continua o ejecución rápida en consola:
```bash
cd store
npm run e2e
```

#### Estructura de Tests E2E
- **account/**: Pruebas de registro, login y gestión de perfil.
- **administration/**: Pruebas de paneles administrativos.
- **checkout/**: Flujos de compra y carrito.
- **entity/**: CRUD de entidades.
- **test-login-ionic.cy.ts**: Pruebas específicas de integración con el frontend Ionic.

