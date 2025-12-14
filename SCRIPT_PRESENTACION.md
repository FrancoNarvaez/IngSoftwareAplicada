# 🎤 SCRIPT DE PRESENTACIÓN ORAL - DEFENSA

## **Duración estimada: 10-12 minutos**

---

## **[INTRODUCCIÓN - 1 minuto]**

Buenas [mañana/tardes]. Mi nombre es Franco Narváez y les presento **TechStore**, una aplicación de comercio electrónico moderna desarrollada como proyecto final del curso de **Ingeniería de Software Aplicada**.

TechStore es una plataforma especializada en venta de productos tecnológicos (smartphones, tablets, laptops) que demuestra la implementación de **una arquitectura escalable de microservicios** usando tecnologías de punta como Spring Boot 3.4, Java 21, Angular 15+ y un stack completo de observabilidad con ELK.

**Pregunta guía**: ¿Cómo construir una aplicación robusta, escalable y observable en la era de microservicios?

---

## **[VISIÓN GENERAL - 1 minuto]**

### Estructura General

El proyecto está dividido en **4 componentes principales**:

1. **Ionic Frontend (PWA)** - Interfaz de usuario mobile-first
2. **Store Service (API Gateway)** - Orquestador central
3. **2 Microservicios especializados** - Invoice y Notification
4. **Stack ELK** - Observabilidad centralizada

### Diagrama Simple

```
USUARIO (Browser/Mobile)
    ↓
IONIC FRONTEND (Angular 15+, TypeScript 5)
    ↓
STORE SERVICE (Spring Boot 3.4, Java 21) - API Gateway
    ├─→ INVOICE SERVICE (Genera facturas)
    ├─→ NOTIFICATION SERVICE (Envía notificaciones)
    └─→ CONSUL (Service Discovery)
         ↓
      BASES DE DATOS + ELK STACK (Elasticsearch, Logstash, Kibana)
```

---

## **[COMPONENTE 1: FRONTEND - 1.5 minutos]**

### Ionic App (PWA)

**Ubicación**: `ionic-app/` - Puerto 4200

**¿Qué es una PWA?**
Una Progressive Web App que funciona como app nativa:
- ✅ Instalable en mobile/desktop
- ✅ Funciona offline con Service Workers
- ✅ Sincronización inteligente
- ✅ Cargas rápidas (caché)

**Tecnologías**:
- **Angular 15+**: Framework reactivo con componentes standalone
- **TypeScript 5**: Lenguaje tipado, evita errores
- **RxJS 7**: Programación reactiva con Observables
- **NgRx**: Gestión de estado centralizada (Redux pattern)
- **SCSS**: Estilos con arquitectura BEM
- **Service Workers**: Offline-first capability

**Flujo de Usuario**:
```
Usuario navega → Carga catálogo desde Store Service
               → Agrega items al carrito (estado local)
               → Realiza checkout
               → Sistema genera orden, factura y notificación
               → Ve confirmación en la app
```

**Testing**:
- **266 tests unitarios** (Jasmine/Karma)
- **E2E tests** (Cypress) - flujos completos
- **~85% code coverage**
- **0 ESLint errors** después de fixes

---

## **[COMPONENTE 2: STORE SERVICE (API GATEWAY) - 2 minutos]**

### Store Service

**Ubicación**: `store/` - Puerto 8080  
**Responsabilidades**:
- Gestión de productos y categorías
- Gestión de órdenes de compra
- Gestión de clientes
- Autenticación centralizada (OAuth2 + JWT)
- **API Gateway** que rutea hacia otros servicios

**¿Por qué Spring Boot 3.4 + Java 21?**

**Spring Boot 3.4** es la versión LTS más moderna que ofrece:
- Reactor WebFlux (no-blocking I/O)
- Spring Security 6 con OAuth2
- Spring Data R2DBC (reactive database driver)
- Mejor rendimiento
- Native compilation con GraalVM

**Java 21** introduce:
- **Virtual Threads**: Manejo eficiente de miles de requests concurrentes
- **Pattern Matching**: Código más limpio
- **Record Classes**: Clases immutables simplificadas

**Arquitectura Reactiva con R2DBC**:
```
Usuario Request
    ↓
Spring WebFlux (Non-blocking)
    ↓
R2DBC Reactor (Async DB driver)
    ↓
MySQL (No espera bloqueante)
    ↓
Response inmediata
```

Esto permite manejar **miles de requests simultáneos** sin threads bloqueados.

**Endpoints principales**:
- `GET /api/products` - Listado de productos
- `POST /api/product-orders` - Crear orden
- `GET /services/invoice/*` - Proxy a Invoice Service
- `GET /swagger-ui.html` - Documentación API

**Testing**:
- **34 tests unitarios** (JUnit 5 + Mockito)
- **Integration tests** (TestContainers con BD real)
- **Architecture tests** (ArchUnit)
- **~80% code coverage**

---

## **[COMPONENTES 3 & 4: MICROSERVICIOS ESPECIALIZADOS - 1.5 minutos]**

### Invoice Service (Puerto 8081)

**Responsabilidades**:
- Genera facturas automáticamente cuando se crea una orden
- Registra envíos (Shipments)
- Expone API para consulta de invoices

**Cómo funciona**:
```
1. Store Service crea Order
2. Emite evento: OrderCreatedEvent
3. Invoice Service escucha el evento
4. Consulta datos de la orden
5. Genera factura en MySQL
6. Persiste automáticamente
```

**Testing**: 28 tests ✅

### Notification Service (Puerto 8082)

**Responsabilidades**:
- Envía notificaciones (email/SMS)
- Escucha eventos de órdenes y facturas
- Almacena historial en MongoDB

**¿Por qué MongoDB?**
- Schema flexible para diferentes tipos de notificaciones
- Mejor rendimiento para writes
- Almacenamiento denormalizado sin joins

**Testing**: 24 tests ✅

### Patrón Event-Driven

Ambos servicios funcionan de forma **asíncrona** mediante eventos:
```
Store (Order Created)
    ↓
Kafka/RabbitMQ o Spring Cloud Bus
    ↓
├─→ Invoice Service (crea factura)
└─→ Notification Service (envía email)
```

Esto permite que si uno falla, el otro sigue funcionando.

---

## **[BASES DE DATOS - 1 minuto]**

### Estrategia: Database Per Service

**MySQL (Relacional)**
- Store DB: Productos, órdenes, clientes (normalizado)
- Invoice DB: Facturas, envíos (separado por dominio)
- Ventajas: ACID transactions, data integrity

**MongoDB (NoSQL)**
- Notifications: Eventos, historial (flexible)
- Ventajas: Schema flexible, rápido para writes

```
Ventaja arquitectónica:
- Cada servicio es independiente
- Puede escalar su BD por separado
- No comparten data model
- Si Invoice cae, Store sigue funcionando
```

**Acceso No-Bloqueante**:
- MySQL: R2DBC Reactor (async driver)
- MongoDB: Spring Data Reactive MongoDB

---

## **[OBSERVABILIDAD - ELK STACK - 1.5 minutos]**

### El Problema
Sin observabilidad es difícil saber:
- ¿Qué pasó cuando falló un request?
- ¿Cuál servicio es lento?
- ¿Dónde ocurrió el error?

### La Solución: ELK Stack

```
Logstash (Agregador)
    ↑
    │ TCP:5044 (JSON logs)
    │
[Store] [Invoice] [Notification]
    │
    ↓
Elasticsearch (Búsqueda distribuida)
    │
    ├─ Índice: app-logs-2025.12.09
    ├─ Índice: app-logs-2025.12.10
    └─ Índice: app-logs-2025.12.11
    │
    ↓
Kibana (Dashboard visual)
```

### ¿Cómo funciona?

1. **Cada app loguea en JSON** (Logback + Logstash Encoder)
   ```json
   {
     "@timestamp": "2025-12-09T15:30:45.123Z",
     "service": "store",
     "level": "INFO",
     "message": "Order created",
     "orderId": "12345",
     "userId": "user123",
     "duration_ms": 523
   }
   ```

2. **Logstash recibe en TCP:5044** y enriquece:
   - Agrega hostname, pod name
   - Parsea timestamps
   - Enriquece con contexto

3. **Elasticsearch indexa en índices diarios**
   - app-logs-2025.12.09 (10 GB)
   - app-logs-2025.12.10 (8 GB)
   - Retención: 30 días por defecto

4. **Kibana visualiza**
   - Dashboard con gráficos en tiempo real
   - Búsquedas ad-hoc
   - Alertas automáticas

### Beneficios

✅ **Troubleshooting rápido**: Buscar un error en segundos
✅ **Performance insights**: Identificar operaciones lentas
✅ **Auditoría**: Registro de todos los eventos
✅ **Alerts**: Notificaciones si hay picos de errores

---

## **[FLUJO DE COMPRA COMPLETO - 2 minutos]**

Ahora vamos a ver un flujo completo de cómo funciona todo junto:

### Paso 1: Usuario navega catálogo (1 sec)
```
Frontend: GET /api/products
    ↓
Store Service: Consulta MySQL
    ↓
Retorna lista de 50 productos con precios
```

### Paso 2: Usuario agrega al carrito (0 sec)
```
Frontend: Guarda en localStorage + NgRx State
(No toca el servidor aún)
```

### Paso 3: Usuario realiza checkout (2 sec)
```
Frontend: POST /api/product-orders
Body: { items: [{productId, qty}], customerId, total }
    ↓
Store Service:
  1. Valida datos
  2. Verifica stock en MySQL
  3. Crea ProductOrder en MySQL (id=12345)
  4. Crea OrderItems para cada línea
  5. Emite evento: OrderCreatedEvent
    ↓
```

### Paso 4: Trigger automático - Generar factura (1 sec)
```
Invoice Service escucha OrderCreatedEvent
    ↓
Consulta Order #12345
    ↓
Calcula impuestos
    ↓
Crea Invoice en su MySQL
    ↓
Marca como EMITTED
```

### Paso 5: Trigger automático - Notificación (1 sec)
```
Notification Service escucha OrderCreatedEvent
    ↓
Prepara email de confirmación
    ↓
Envía a: usuario@email.com
    ↓
Guarda registro en MongoDB
    └─> {userId, type: ORDER_CONFIRMED, timestamp, status: SENT}
```

### Paso 6: Logs centralizados (Instantáneo)
```
Todos los servicios loguean en JSON
    ↓
Logstash recibe en TCP:5044
    ↓
Elasticsearch indexa en app-logs-*
    ↓
Kibana visualiza en dashboard

Timeline visible:
15:30:45.100 [Store]        Order created #12345
15:30:45.200 [Store]        Order persisted
15:30:45.300 [Invoice]      Invoice generated
15:30:45.400 [Notification] Email sent
```

### Resultado final
- ✅ Usuario ve orden confirmada en app
- ✅ Recibe email de confirmación
- ✅ Admin ve toda la secuencia en Kibana en tiempo real
- ✅ Si algo falla, logs permiten identificar causa inmediatamente

---

## **[TESTING Y CALIDAD - 1 minuto]**

### Cobertura Exhaustiva

```
Backend Java:
├─ Store Service:        34 tests
├─ Invoice Service:      28 tests
└─ Notification Service: 24 tests
   TOTAL: 86 tests | ~80% coverage

Frontend TypeScript:
├─ Unit tests (Jasmine): 266 tests
├─ E2E tests (Cypress):  6 suites
└─ ESLint:              0 errors
   TOTAL: 266+ tests | ~85% coverage

TOTAL PROYECTO: 352+ tests ✅
```

### Tipos de Tests

**Unit Tests**: Función individual, mocks de dependencias
```java
@Test
void testCreateOrder() {
    Order order = new Order(customerId, items, total);
    assertNotNull(order.getId());
    assertEquals(OrderStatus.PENDING, order.getStatus());
}
```

**Integration Tests**: Con BD real (TestContainers)
```java
@SpringBootTest
@Testcontainers
void testOrderPersistence() {
    // MySQL real en Docker
    orderRepository.save(order);
    Order found = orderRepository.findById(order.getId());
    assertNotNull(found);
}
```

**E2E Tests**: Flujos completos (Cypress)
```javascript
it('Should complete purchase flow', () => {
    cy.visit('http://localhost:4200');
    cy.login('user', 'password');
    cy.addToCart('iPhone 15');
    cy.checkout();
    cy.contains('Order Confirmed').should('exist');
});
```

### Beneficios

- 🚀 Refactorizar sin miedo (tests lo validan)
- 🐛 Bugs detectados temprano (no en producción)
- 📊 ~80% coverage significa código core bien probado
- ✅ CI/CD ready (tests automáticos antes de merge)

---

## **[SEGURIDAD - 1 minuto]**

### Capas de Seguridad

**1. Autenticación (OAuth2 + JWT)**
```
Usuario ingresa credenciales
    ↓
Store Service valida con BD
    ↓
Retorna JWT token:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 3600
}
    ↓
Frontend almacena en localStorage (o sessionStorage)
    ↓
Cada request lleva header: Authorization: Bearer <token>
```

**2. Autorización (Spring Security 6)**
```
@GetMapping("/api/orders")
@PreAuthorize("hasRole('USER')")
public List<Order> getMyOrders() { ... }

Si usuario NO tiene ROLE_USER → 403 Forbidden
```

**3. Validación de Inputs**
```
Frontend: Reactive Forms (valida antes de enviar)
Backend: Bean Validation (@Valid @NotNull @Email etc.)
         Si falla → 400 Bad Request con detalles
```

**4. Headers de Seguridad**
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
```

---

## **[VENTAJAS DE ESTA ARQUITECTURA - 1 minuto]**

### ✅ Escalabilidad
- Servicios independientes → Escalar cada uno por separado
- DB per service → No hay cuello de botella
- R2DBC non-blocking → Maneja más requests con menos threads

### ✅ Resiliencia
- Si Invoice falla → Store sigue funcionando
- Health checks en Consul → Auto-deregistro de servicios caídos
- Circuit breakers → Fallback cuando un servicio no responde

### ✅ Observabilidad
- Logs centralizados en ELK → Troubleshooting rápido
- Dashboards en Kibana → Visibilidad en tiempo real
- Alertas automáticas → Notificación de problemas

### ✅ Mantenibilidad
- 352+ tests → Código confiable
- Separación clara de responsabilidades
- API Gateway patrón → Fácil agregar nuevos servicios

### ✅ Developer Experience
- Docker Compose → Setup en 2 minutos
- Hot reload → Cambios reflejados instantáneamente
- Swagger docs → API autodocumentada

---

## **[CONCLUSIONES - 1 minuto]**

### Lo que TechStore demuestra

✅ **Arquitectura moderna**: Microservicios, API Gateway, Event-Driven  
✅ **Backend robusto**: Spring Boot 3.4, Java 21, R2DBC reactivo  
✅ **Frontend escalable**: Angular 15+, TypeScript, PWA  
✅ **Testing exhaustivo**: 352+ tests, ~80% coverage  
✅ **Observabilidad real**: Stack ELK completo  
✅ **DevOps profesional**: Docker, Compose, Service Discovery  
✅ **Seguridad**: OAuth2, JWT, validación multicapa  

### Estado actual

- ✅ **Completamente funcional**
- ✅ **Production-ready**
- ✅ **Escalable horizontalmente**
- ✅ **Bien documentado**
- ✅ **Listo para defensa**

### Repositorio
github.com/FrancoNarvaez/IngSoftwareAplicada

**Preguntas?**

---

## **[DEMOSTRACIÓN EN VIVO - Opcional, 3-5 minutos]**

Si hay tiempo, puedes:

1. **Levantar la app**:
   ```bash
   cd /path/to/project
   bash liberar-puertos.sh
   docker-compose up -d
   cd ionic-app && npm start
   ```

2. **Mostrar frontend**:
   - Navegar a http://localhost:4200
   - Login, agregar productos, checkout
   - Ver orden confirmada

3. **Mostrar API**:
   - http://localhost:8080/swagger-ui.html
   - Ejecutar requests ejemplo

4. **Mostrar logs en Kibana**:
   - http://localhost:5601
   - Buscar logs de compra
   - Mostrar timeline de eventos

5. **Explicar Consul** (si preguntan):
   - http://localhost:8500/ui/
   - Mostrar servicios registrados

---

**¡Éxito en la defensa!** 🎓
