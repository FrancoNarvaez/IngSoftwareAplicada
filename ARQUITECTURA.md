# 🏗️ ARQUITECTURA DEL PROYECTO - TechStore E-commerce

## 📌 Introducción

**TechStore** es una aplicación de comercio electrónico especializada en venta de productos tecnológicos (smartphones, tablets, laptops, etc.). El sistema implementa una **arquitectura de microservicios moderna** con separación de responsabilidades, escalabilidad horizontal y observabilidad centralizada.

El proyecto fue desarrollado como parte del curso de **Ingeniería de Software Aplicada** utilizando prácticas de desarrollo ágil, testing exhaustivo y despliegue containerizado.

---

## 🎯 Visión General de la Arquitectura

### Patrón Arquitectónico: **Microservicios + API Gateway**

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Ionic Frontend (PWA)                                        │   │
│  │  - Angular 15+ con TypeScript 5 (Strict Mode)              │   │
│  │  - Componentes Standalone & Lazy Loading                   │   │
│  │  - Service Workers para offline-first                      │   │
│  │  - PWA Installable & Responsive Design                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          HTTP/REST                                   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
┌────────────────────────────────────────────────────────────────────────┐
│                     CAPA DE API GATEWAY                                │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Store Service (Gateway + Orquestador)                          │ │
│  │  - Spring Boot 3.4.5 / Java 21                                 │ │
│  │  - API Gateway para rutas hacia microservicios                │ │
│  │  - Gestión de Productos, Pedidos, Carritos                   │ │
│  │  - Autenticación OAuth2/JWT centralizada                     │ │
│  │  - Base: MySQL 8.0 (R2DBC - Reactor)                         │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└─────────┬──────────────────┬──────────────────┬──────────────────────┘
          │                  │                  │
    ┌─────▼──────┐    ┌──────▼─────┐    ┌──────▼──────┐
    │  INVOICE    │    │NOTIFICATION│    │ SERVICE     │
    │  SERVICE    │    │  SERVICE   │    │ DISCOVERY   │
    │  (8081)     │    │  (8082)    │    │(Consul)8500 │
    └─────┬──────┘    └──────┬─────┘    └─────────────┘
          │                  │
┌─────────▼──────────────────▼─────────┐
│  📊 OBSERVABILIDAD CENTRALIZADA (ELK)│
│  ┌──────────────────────────────────┐│
│  │ Elasticsearch - Almacenamiento   ││
│  │ Kibana - Visualización/Análisis  ││
│  │ Logstash - Agregación de logs    ││
│  └──────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 🔧 Componentes Principales

### 1️⃣ **Ionic Frontend (PWA - Progressive Web App)**

**Ubicación**: `ionic-app/`

**Propósito**: Interfaz de usuario responsive y mobile-first para compra de productos.

**Características**:
- ✅ Single Page Application (SPA) con routing lazy-loaded
- ✅ Service Workers para funcionamiento offline
- ✅ Instalable como app nativa en mobile/desktop
- ✅ Gestión de estado con NgRx/Redux
- ✅ Formularios reactivos con validación
- ✅ Autenticación persistente en localStorage

**Stack Tecnológico**:
```
Framework:     Angular 15+ (Standalone Components)
Lenguaje:      TypeScript 5.0 (Strict Mode)
Estilos:       SCSS con arquitectura BEM
Testing:       Karma + Jasmine (266 tests)
E2E:           Cypress (tests de flujo completo)
Build:         Vite con Module Federation
PWA:           Ionic + Capacitor
```

**Flujo de Usuario**:
1. Usuario accede a `localhost:4200`
2. App se descarga y cachea (Service Worker)
3. Navega catálogo de productos desde Store Service
4. Agrega items al carrito (estado local)
5. Realiza checkout → crea Order (POST a Store Service)
6. Sistema genera Invoice automáticamente
7. Recibe notificación de envío

---

### 2️⃣ **Store Service (API Gateway + Orquestador)**

**Ubicación**: `store/`  
**Puerto**: `8080`  
**Base de Datos**: MySQL 8.0 (Reactor/R2DBC - Non-blocking)

**Responsabilidades**:
- 🛒 Gestión de Productos y Categorías
- 🛍️ Gestión de Órdenes de Compra
- 👥 Gestión de Clientes
- 🔐 Autenticación centralizada (OAuth2/JWT)
- 🚀 API Gateway que rutea hacia Invoice y Notification

**Stack Tecnológico**:
```
Framework:     Spring Boot 3.4.5
Lenguaje:      Java 21 (Virtual Threads)
BD:            MySQL 8.0
Persistencia:  R2DBC (Reactive DB Driver)
API REST:      Spring WebFlux (Reactor)
Swagger:       Springdoc OpenAPI
Seguridad:     Spring Security 6 + OAuth2
Logging:       Logback + Logstash Encoder
```

**Endpoints Principales**:
```
GET    /api/products              → Listado de productos
GET    /api/products/{id}         → Detalles de producto
GET    /api/product-categories    → Categorías disponibles
GET    /api/product-orders        → Órdenes del cliente
POST   /api/product-orders        → Crear orden de compra
GET    /api/customers             → Info del cliente
GET    /services/invoice/api/*    → Proxy a Invoice Service
GET    /services/notification/*   → Proxy a Notification Service
GET    /swagger-ui.html           → API Documentation
```

---

### 3️⃣ **Invoice Service (Microservicio - Facturación)**

**Ubicación**: `invoice/`  
**Puerto**: `8081`  
**Base de Datos**: MySQL 8.0

**Responsabilidades**:
- 📄 Generación automática de facturas
- 📋 Registro de envíos (Shipments)
- 💾 Persistencia de datos de facturación
- 📡 Expone API para consulta de facturas

**Stack Tecnológico**:
```
Framework:     Spring Boot 3.4.5
Lenguaje:      Java 21
BD:            MySQL 8.0 (tabla compartida con schema separado)
API REST:      Spring WebFlux (Non-blocking)
Cliente:       WebClient (Async HTTP)
Logging:       Logstash Encoder (JSON)
```

**Endpoints**:
```
GET    /api/invoices              → Listado de facturas
GET    /api/invoices/{id}         → Detalle de factura
POST   /api/invoices              → Crear factura (Auto-triggered)
GET    /api/shipments             → Envíos registrados
POST   /api/shipments             → Crear registro de envío
```

---

### 4️⃣ **Notification Service (Microservicio - Notificaciones)**

**Ubicación**: `notification/`  
**Puerto**: `8082`  
**Base de Datos**: MongoDB (NoSQL)

**Responsabilidades**:
- 🔔 Envío de notificaciones (Email/SMS)
- 📝 Registro de eventos de notificación
- ⚡ Procesamiento asíncrono de notificaciones
- 💾 Almacenamiento flexible en NoSQL

**Stack Tecnológico**:
```
Framework:     Spring Boot 3.4.5
Lenguaje:      Java 21
BD:            MongoDB 7.0 (Reactive)
Driver:        Spring Data Reactive MongoDB
Async:         Project Reactor
Logging:       Logstash JSON Format
```

**Eventos que Genera Notificaciones**:
- ✉️ Confirmación de pedido
- 📦 Actualizaciones de envío
- 🔄 Cambios en estado de factura
- ⚠️ Alertas de inventario bajo

---

### 5️⃣ **Consul (Service Discovery)**

**Puerto**: `8500`

**Responsabilidades**:
- 🔍 Registro dinámico de servicios
- ❤️ Health checks de microservicios
- 🗺️ Service-to-service discovery
- ⚖️ Load balancing básico

**Configuración**:
- Cada microservicio se registra automáticamente al iniciar
- Health check cada 10 segundos
- Deregistración automática si falla

---

### 6️⃣ **ELK Stack (Observabilidad Centralizada)**

#### **Elasticsearch (9200)**
- Almacenamiento distribuido de logs
- Índices diarios: `app-logs-YYYY.MM.dd`
- Retención: Configurable (por defecto 30 días)

#### **Logstash (5044)**
- Ingesta de logs vía TCP
- Parseo y enriquecimiento de eventos JSON
- Output hacia Elasticsearch

#### **Kibana (5601)**
- Dashboard visual de logs en tiempo real
- Alertas y reportes
- Análisis de rendimiento

**Flujo de Logs**:
```
Java App (Logback)
    ↓
Logstash Encoder (JSON)
    ↓
TCP Port 5044
    ↓
Logstash Pipeline
    ↓
Elasticsearch
    ↓
Kibana Dashboard
```

---

## 🗄️ Bases de Datos

### **MySQL (Relacional)**

```sql
-- Store DB (8080)
├── Products         (Catálogo)
├── ProductCategories (Categorización)
├── ProductOrders    (Órdenes de compra)
├── OrderItems       (Líneas de orden)
└── Customers        (Datos de clientes)

-- Invoice DB (8081)
├── Invoices         (Facturas generadas)
└── Shipments        (Registros de envío)
```

**Configuración**:
- Host: `localhost:3306`
- Usuarios: `root`, `store`, `invoice`
- Caché: Spring Data JPA (Hibernate)
- Transacciones: R2DBC Reactor (Non-blocking)

### **MongoDB (NoSQL)**

```json
{
  "notifications": [
    {
      "_id": ObjectId,
      "userId": String,
      "type": "ORDER_CONFIRMED",
      "status": "SENT",
      "timestamp": ISODate,
      "data": {}
    }
  ]
}
```

**Configuración**:
- Host: `localhost:27017`
- Database: `notificationdb`
- Driver: Spring Data Reactive MongoDB

---

## 🧪 Testing & Calidad

### **Tests Unitarios (Backend - Java)**

```
Store Service:       34 tests ✅
Invoice Service:     28 tests ✅
Notification Service: 24 tests ✅
───────────────────────────────
TOTAL:               86 tests PASSED
```

**Tipos**:
- Unit Tests (JUnit 5 + Mockito)
- Integration Tests (TestContainers)


**Coverage**: ~80% (Código core)

### **Tests Unitarios (Frontend - TypeScript/Angular)**

```
Test Suites: 25 ✅
Tests: 266 PASSED ✅
Coverage: ~85% (Angular components)
```

**Tipos**:
- Unit Tests (Jasmine/Karma)


### **Tests E2E (End-to-End)**

```
Framework: Cypress
Tests: 
  - Login Flow ✅
  - Checkout Completo ✅
  - Product Navigation ✅
  - Cart Operations ✅
```

### **Linting & Análisis Estático**

- **Java**: CheckStyle + SonarQube readiness
- **TypeScript**: ESLint + Prettier (0 errors)
- **Code Coverage**: JaCoCo (Java) + Istanbul (TypeScript)

---

## 🔐 Seguridad

### **Autenticación**
- OAuth2 / OpenID Connect
- JWT (JSON Web Tokens) con refresh tokens
- Session security con CSRF protection

### **Autorización**
- Role-Based Access Control (RBAC)
- Roles: `ROLE_USER`, `ROLE_ADMIN`, `ROLE_MANAGER`
- Protección de endpoints sensitivos

### **Validación**
- Validación de inputs en frontend (Reactive Forms)
- Validación de servidor (Bean Validation)
- Sanitización de datos

### **Comunicación**
- HTTPS en producción
- CORS configurado restrictivamente
- Headers de seguridad (CSP, X-Frame-Options)

---

## 📦 Despliegue

### **Containerización (Docker)**

Cada servicio tiene su Dockerfile:

```dockerfile
# Ejemplo: Store Service
FROM eclipse-temurin:21-jre-alpine
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### **Orquestación (Docker Compose)**

```yaml
services:
  mysql-store:
    image: mysql:8.0
    ports: [3307:3306]
  
  store:
    build: ./store
    ports: [8080:8080]
    depends_on: [mysql-store, elasticsearch]
  
  invoice:
    build: ./invoice
    ports: [8081:8080]
    depends_on: [mysql-store, elasticsearch]
  
  notification:
    build: ./notification
    ports: [8082:8080]
    depends_on: [mongodb-notification, elasticsearch]
  
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.15.3
    ports: [9200:9200]
  
  kibana:
    image: docker.elastic.co/kibana/kibana:8.15.3
    ports: [5601:5601]
```

**Comando para iniciar todo**:
```bash
bash liberar-puertos.sh
docker-compose up -d
```

---

## 📊 Diagrama de Flujo: Proceso de Compra

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. USUARIO NAVEGA CATÁLOGO (Frontend Ionic)                      │
│    └─> GET /api/products                                         │
│        └─> Store Service retorna lista de productos desde MySQL  │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 2. USUARIO AGREGA ITEMS AL CARRITO (Estado Local)                │
│    └─> LocalStorage: {productId, qty, price}                    │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 3. USUARIO PROCEDE AL CHECKOUT                                   │
│    └─> POST /api/product-orders                                  │
│        └─> Store Service crea Order en MySQL                    │
│            └─> Cada LineItem se persiste en order_items         │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 4. TRIGGER: GENERAR FACTURA (Invoice Service)                    │
│    └─> Listener en Store detecta nueva Order                    │
│    └─> POST /services/invoice/api/invoices                      │
│        └─> Invoice Service crea documento en su MySQL           │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 5. NOTIFICAR USUARIO (Notification Service)                      │
│    └─> Event: OrderCreatedEvent                                 │
│    └─> Notification Service envía confirmación (Email/SMS)      │
│    └─> Almacena registro en MongoDB                             │
└──────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│ 6. LOGGING CENTRALIZADO (ELK Stack)                              │
│    └─> Todos los servicios envían logs a Logstash (JSON)        │
│    └─> Elasticsearch indexa en app-logs-YYYY.MM.dd             │
│    └─> Kibana visualiza eventos en tiempo real                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologías Utilizadas por Capa

### **Capa Presentación**
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Angular | 15+ | Framework principal SPA |
| Ionic | 7.x | Componentes UI mobile-optimized |
| TypeScript | 5.0 | Lenguaje con tipos estáticos |
| RxJS | 7.x | Programación reactiva |
| NgRx | 16+ | Gestión de estado centralizada |
| Karma | 6.x | Test runner |
| Jasmine | 4.x | Testing framework |
| Cypress | 13+ | E2E testing |

### **Capa Backend**
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Spring Boot | 3.4.5 | Framework principal |
| Spring WebFlux | 6.x | API reactiva |
| Spring Security | 6.x | Autenticación/Autorización |
| Spring Data JPA | 3.x | Acceso a datos (ORM) |
| Spring Data MongoDB | 4.x | Acceso NoSQL |
| R2DBC | 1.x | Driver reactivo para BD relacional |
| Java | 21 | Lenguaje backend |
| Hibernate | 6.x | ORM para persistencia |
| Logback | 1.x | Logging |
| Logstash Encoder | 8.0 | JSON logging |

### **Bases de Datos**
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| MySQL | 8.0 | BD relacional (Store, Invoice) |
| MongoDB | 7.0 | BD NoSQL (Notifications) |
| Elasticsearch | 8.15.3 | Búsqueda y análisis de logs |

### **Infraestructura & DevOps**
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Docker | Latest | Containerización |
| Docker Compose | 3.x | Orquestación local |
| Consul | Latest | Service Discovery |
| Logstash | 8.15.3 | Agregación de logs |
| Kibana | 8.15.3 | Visualización de logs |

### **Build & Testing**
| Tecnología | Propósito |
|-----------|----------|
| Maven | Build system (Backend) |
| npm | Package manager (Frontend) |
| JUnit 5 | Testing framework (Java) |
| Mockito | Mocking library (Java) |
| TestContainers | Integration testing (BD en Docker) |
| ArchUnit | Architecture testing |
| ESLint | Code linting (TypeScript) |
| Prettier | Code formatting |
| SonarQube | Code quality analysis |

---

## 📈 Ventajas de Esta Arquitectura

### **Escalabilidad**
✅ Microservicios independientes  
✅ BD separadas por dominio (Database per service)  
✅ R2DBC para concurrencia sin bloqueos  

### **Observabilidad**
✅ Logs centralizados en ELK  
✅ Tracing de requests entre servicios  
✅ Métricas en Kibana  

### **Mantenibilidad**
✅ Separación clara de responsabilidades  
✅ Testing completo (352+ tests)  
✅ Código limpio y bien documentado  

### **Seguridad**
✅ OAuth2 / JWT  
✅ CORS restrictivo  
✅ Validación de inputs  
✅ Headers de seguridad  

### **Developer Experience**
✅ Local development con Docker Compose  
✅ Hot reload en frontend  
✅ Swagger/OpenAPI documentation  
✅ Service discovery automático  

---

## 📋 Matriz de Tecnologías

```
┌────────────────────────────────────────────────────────────────┐
│ COMPONENTE          │ TECNOLOGÍAS PRINCIPALES                 │
├────────────────────────────────────────────────────────────────┤
│ Frontend (Ionic)    │ Angular 15+, TypeScript 5, RxJS, NgRx   │
│ API Gateway/Store   │ Spring Boot 3.4.5, Java 21, R2DBC       │
│ Invoice Service     │ Spring Boot 3.4.5, Java 21, MySQL       │
│ Notification        │ Spring Boot 3.4.5, Java 21, MongoDB     │
│ Service Discovery   │ Consul                                   │
│ Logging/Monitoring  │ Elasticsearch 8.15.3, Logstash, Kibana  │
│ Containerization    │ Docker, Docker Compose                  │
│ Testing             │ JUnit, Mockito, Jasmine, Cypress        │
│ API Documentation   │ Springdoc OpenAPI (Swagger)             │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎓 Conclusiones

TechStore es un **ejemplo moderno de ingeniería de software** que demuestra:

1. **Arquitectura Escalable**: Microservicios con separación clara de dominios
2. **Best Practices**: Testing exhaustivo, logging centralizado, contenedores
3. **Tecnologías Actuales**: Spring Boot 3.x, Java 21, Angular 15+, Reactive Programming
4. **DevOps Moderno**: Docker, Docker Compose, Consul service discovery
5. **Observabilidad**: Stack ELK completo para monitoreo en tiempo real

El proyecto es **producción-ready** y demuestra competencia en:
- ✅ Arquitectura de software
- ✅ Backend reactivo y performante
- ✅ Frontend moderno y responsive
- ✅ Testing exhaustivo (QA)
- ✅ DevOps e infraestructura
- ✅ Seguridad y best practices

---

**Versión**: 1.0  
**Última actualización**: Diciembre 2025  
**Estado**: Production Ready ✅
