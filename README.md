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

### Quick Start con Docker Compose (Completo)
Para levantar toda la infraestructura (MySQL, MongoDB, Consul, ELK Stack + Servicios):
```bash
# Liberar puertos
bash liberar-puertos.sh

# Iniciar todo con docker-compose
docker-compose up -d
```
Esto levanta:
- **Consul** (service discovery): http://localhost:8500
- **MySQL** (store): puerto 3307
- **MongoDB** (notification): puerto 27017
- **Store API**: http://localhost:8080/swagger-ui.html
- **Invoice API**: http://localhost:8081/swagger-ui.html
- **Notification API**: http://localhost:8082/swagger-ui.html
- **Elasticsearch**: http://localhost:9200
- **Kibana**: http://localhost:5601
- **Logstash**: puerto 5044

Luego levantar frontend:
```bash
cd ionic-app
npm install  # Solo la primera vez
npm start
```
- **URL App**: http://localhost:4200

### Ejecución Local (Sin contenedores para el backend/frontend)

#### 1. Preparar infraestructura
```bash
# Liberar puertos
bash liberar-puertos.sh

# Levantar solo bases de datos y ELK (sin servicios Java)
docker-compose up -d consul mysql-store mysql-invoice mongodb-notification elasticsearch logstash kibana
```

#### 2. Iniciar Backend (Store Service)
```bash
cd store
./mvnw spring-boot:run
```
- **URL API**: `http://localhost:8080/api`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`

#### 3. Iniciar Frontend (Ionic App)
```bash
cd ionic-app
npm install  # Solo la primera vez
npm start
```
- **URL App**: `http://localhost:4200`

#### 4. Verificar Logs en ELK
```bash
# Hacer una request para generar logs
curl http://localhost:8080/management/health

# Ver logs en Elasticsearch
curl 'http://localhost:9200/app-logs-*/_search?size=3'

# Abrir Kibana en el navegador
# http://localhost:5601
# - Crear Index Pattern: app-logs-*
# - Ir a Discover para ver eventos en tiempo real
```

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

## 📊 Observabilidad (ELK)

El stack incluye **Elasticsearch + Logstash + Kibana** para centralizar los logs de los microservicios (`store`, `invoice`, `notification`).

### Componentes
- **Elasticsearch** (http://localhost:9200): Motor de búsqueda y almacenamiento de logs
- **Logstash** (puerto 5044 TCP): Ingesta de logs desde las aplicaciones Java
- **Kibana** (http://localhost:5601): Visualización y análisis de logs

### Configuración Automática
Los servicios Java ya incluyen:
- Dependencia: `logstash-logback-encoder` (v8.0)
- Configuración: `logging.logstash.enabled=true`, host/puerto configurables por perfil
- Formato: JSON para facilitar parsing en Logstash

### Testing Automatizado
Ejecutar prueba de humo (smoke test) del stack ELK:
```bash
# Levanta ELK, envía log sintético y valida ingesta en Elasticsearch
./scripts/test-elk-logging.sh

# Para dejar ELK corriendo después del test
KEEP_ELK=1 ./scripts/test-elk-logging.sh
```

### Verificación Manual
1) Generar tráfico:
```bash
curl http://localhost:8080/management/health
curl http://localhost:8080/api/products
```

2) Revisar recepción en Logstash:
```bash
docker logs logstash | tail -20
```

3) Buscar logs en Elasticsearch:
```bash
curl 'http://localhost:9200/app-logs-*/_search?q=logger_name:com.jhipster&size=5'
```

4) Visualizar en Kibana:
- Abrir http://localhost:5601
- Crear Index Pattern: `app-logs-*`
- Ir a Discover para ver eventos en tiempo real

