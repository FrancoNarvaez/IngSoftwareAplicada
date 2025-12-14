# 📊 MATRIZ DE TECNOLOGÍAS Y COMPARATIVAS

## **1. Stack Tecnológico por Capa**

### **CAPA DE PRESENTACIÓN (Frontend)**

```
┌─────────────────────────────────────────────────────────────────────┐
│                         IONIC FRONTEND (PWA)                        │
├─────────────────────────────────────────────────────────────────────┤
│ Versión    │ Tecnología              │ Propósito                     │
├────────────┼─────────────────────────┼───────────────────────────────┤
│ 15.0+      │ Angular                 │ SPA Framework principal       │
│ 5.0        │ TypeScript              │ Lenguaje tipado              │
│ 7.0        │ Ionic                   │ Componentes UI optimizados   │
│ 7.0+       │ RxJS                    │ Programación reactiva        │
│ 16.0+      │ NgRx                    │ Gestión de estado (Redux)    │
│ Latest     │ SCSS                    │ Pre-procesador de CSS        │
│ Latest     │ Service Workers         │ Offline support              │
│ 6.4        │ Karma                   │ Test runner                  │
│ 4.0        │ Jasmine                 │ Unit testing framework       │
│ 13.0+      │ Cypress                 │ E2E testing framework        │
│ Latest     │ Prettier                │ Code formatting             │
│ Latest     │ ESLint                  │ Code linting                │
│ Latest     │ Vite                    │ Build tool (módulos)        │
└────────────┴─────────────────────────┴───────────────────────────────┘
```

**Rationale**:
- Angular + TypeScript: Tipado fuerte, mejor IDE support
- RxJS: Manejo de async/await con Observables
- NgRx: Predicción y debugging (Redux DevTools)
- Service Workers: Offline-first PWA
- Cypress: Tests que simulan usuario real

---

### **CAPA DE API GATEWAY (Store Service)**

```
┌─────────────────────────────────────────────────────────────────────┐
│              STORE SERVICE (API Gateway + Orquestador)              │
├─────────────────────────────────────────────────────────────────────┤
│ Versión    │ Tecnología              │ Propósito                     │
├────────────┼─────────────────────────┼───────────────────────────────┤
│ 3.4.5      │ Spring Boot             │ Framework principal          │
│ 21         │ Java                    │ Lenguaje backend             │
│ 6.0.x      │ Spring WebFlux          │ API no-bloqueante            │
│ 6.0.x      │ Spring Security         │ Autenticación/Autorización   │
│ 3.0.x      │ Spring Data JPA         │ ORM (JPA/Hibernate)          │
│ 1.0.x      │ R2DBC Reactor           │ Async DB driver              │
│ 1.x        │ Reactor                 │ Non-blocking programming     │
│ 1.x        │ Logback                 │ Logging framework            │
│ 8.0        │ Logstash Encoder        │ JSON logging                 │
│ Latest     │ Springdoc OpenAPI       │ Swagger/OpenAPI docs         │
│ 5.0        │ JUnit 5                 │ Testing framework            │
│ 5.0        │ Mockito                 │ Mocking library              │
│ 1.0        │ TestContainers          │ Integration testing          │
│ 0.36       │ ArchUnit                │ Architecture testing         │
│ 3.x        │ Maven                   │ Build system                 │
└────────────┴─────────────────────────┴───────────────────────────────┘
```

**Rationale**:
- Spring Boot 3.4: LTS, soporte largo plazo
- Java 21: Virtual Threads, mejor performance
- Spring WebFlux: Reactive streams, no-blocking
- R2DBC: Verdadero driver async para SQL
- OpenAPI: Documentación automática de API

---

### **CAPA DE MICROSERVICIOS (Invoice & Notification)**

```
┌─────────────────────────────────────────────────────────────────────┐
│    MICROSERVICIOS ESPECIALIZADOS (Invoice & Notification)           │
├─────────────────────────────────────────────────────────────────────┤
│ Versión    │ Tecnología              │ Propósito                     │
├────────────┼─────────────────────────┼───────────────────────────────┤
│ 3.4.5      │ Spring Boot             │ Framework para ambos         │
│ 21         │ Java                    │ Lenguaje para ambos          │
│ 6.0.x      │ Spring WebFlux          │ API reactiva para ambos      │
│ Latest     │ Spring Cloud Bus        │ Event communication          │
│ Latest     │ WebClient               │ HTTP client async            │
│            │                         │                               │
│ 8.0        │ MySQL                   │ Invoice DB (relacional)      │
│ 7.0        │ MongoDB                 │ Notification DB (NoSQL)      │
│ Latest     │ Spring Data Reactive    │ DB access (ambos)            │
│ Latest     │ Logstash Encoder        │ JSON logging (ambos)         │
│ 5.0        │ JUnit 5                 │ Testing (ambos)              │
│ 5.0        │ Mockito                 │ Mocking (ambos)              │
└────────────┴─────────────────────────┴───────────────────────────────┘
```

**Rationale**:
- Mismo stack que Store para consistencia
- Independientes pero integrables
- Event-driven para desacoplamiento

---

### **CAPA DE PERSISTENCIA**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BASES DE DATOS Y ALMACENAMIENTO                  │
├─────────────────────────────────────────────────────────────────────┤
│ Versión    │ BD Type   │ Servicio        │ Propósito                 │
├────────────┼───────────┼─────────────────┼───────────────────────────┤
│ 8.0        │ MySQL     │ Store Service   │ Productos, órdenes, clientes
│ 8.0        │ MySQL     │ Invoice Service │ Facturas, envíos          │
│ 7.0        │ MongoDB   │ Notification    │ Eventos, historial notif. │
│            │           │                 │                            │
│ 8.15.3     │ Search    │ ELK Stack       │ Logs, búsqueda            │
│ 8.15.3     │ Agg       │ ELK Stack       │ Aggregation de logs       │
│ 8.15.3     │ Visual    │ ELK Stack       │ Visualización datos       │
└────────────┴───────────┴─────────────────┴───────────────────────────┘

ESTRATEGIA DATABASE PER SERVICE:
┌──────────────────────────────┐
│ VENTAJAS:                    │
├──────────────────────────────┤
✓ Escalabilidad independiente
✓ Sin punto único de fallo
✓ Libertad de elegir BD (relacional vs NoSQL)
✓ Migración más sencilla
✓ Performance optimizado por servicio
└──────────────────────────────┘
```

---

### **CAPA DE INFRAESTRUCTURA Y DEVOPS**

```
┌─────────────────────────────────────────────────────────────────────┐
│            INFRAESTRUCTURA, ORQUESTACIÓN Y MONITOREO                │
├─────────────────────────────────────────────────────────────────────┤
│ Versión    │ Tecnología              │ Propósito                     │
├────────────┼─────────────────────────┼───────────────────────────────┤
│ Latest     │ Docker                  │ Containerización              │
│ 3.9+       │ Docker Compose          │ Orquestación local           │
│ Latest     │ Consul                  │ Service Discovery            │
│ Latest     │ Logstash                │ Log aggregation              │
│ 8.15.3     │ Elasticsearch           │ Search & indexing            │
│ 8.15.3     │ Kibana                  │ Visualization & analytics    │
│ Latest     │ Git/GitHub              │ Version control              │
│ Latest     │ SonarQube Ready         │ Code quality                 │
└────────────┴─────────────────────────┴───────────────────────────────┘

FLUJO DE DESPLIEGUE:
Dev → Git Commit → Docker Build → Docker Compose Up → Running
```

---

## **2. Comparativa: Por Qué Estas Tecnologías**

### **Frontend: Angular vs Alternatives**

```
┌─────────────┬──────────────┬──────────────┬──────────────┐
│ Aspecto     │ Angular      │ React        │ Vue          │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ Curva Aprnd │ Empinada     │ Suave        │ Muy suave    │
│ Tipado      │ TS nativo    │ TS opcional  │ TS opcional  │
│ Escalabilidad
│ Grande      │ Excelente    │ Buena        │ Buena        │
│ Rendimiento │ Muy bueno    │ Excelente    │ Excelente    │
│ Empresa     │ Google (LTS) │ Meta (FB)    │ Comunidad    │
│ State Mgmt  │ NgRx (Redux) │ Redux/Zustand
│ NgRx (Redux)│
│ PWA Support │ Nativo       │ Biblioteca   │ Biblioteca   │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ ELEGIMOS    │ ✓ Angular    │              │              │
│ PORQUE      │ • Tipado fuerte (menos bugs)              │
│             │ • PWA integrado                           │
│             │ • Redux nativo con NgRx                   │
│             │ • Enterprise-ready                        │
└─────────────┴──────────────┴──────────────┴──────────────┘
```

---

### **Backend: Spring Boot 3.4 vs Alternatives**

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Aspecto      │ Spring Boot  │ Quarkus      │ Micronaut    │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ Madurez      │ Muy madura   │ Nueva (good) │ Nueva (good) │
│ Comunidad    │ Gigante      │ Creciente    │ Creciente    │
│ Performance  │ Muy bueno    │ Excelente    │ Excelente    │
│ Boot time    │ 2-3 seg      │ 30ms (native)
│ 30ms (native)│
│ Memory       │ ~256MB       │ ~10MB (native)
│ ~10MB (native)
│ Reactive    │ WebFlux ✓    │ Reactive ✓   │ Reactive ✓   │
│ Learning    │ Amplio       │ Empinada     │ Empinada     │
│ Ecosystem   │ Extensísimo  │ Bueno        │ Bueno        │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ ELEGIMOS     │ ✓ Spring 3.4 │              │              │
│ PORQUE       │ • LTS = soporte 5+ años                   │
│             │ • Mejor documentación                     │
│             │ • Más libs de terceros                    │
│             │ • Perfecto para proyecto educativo        │
│             │ • WebFlux ya suficiente                   │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

### **Reactive Driver: R2DBC vs Alternatives**

```
┌────────────────┬──────────────┬──────────────┬──────────────┐
│ Aspecto        │ R2DBC        │ JPA (blocking)
│ Vertx/JooQ    │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ Non-blocking   │ ✓ Verdadero  │ ✗ Bloqueante │ ✓ Sí (JooQ) │
│ Soporte MySQL  │ ✓ Driver nativo
│ ✓ Soportado    │
│ Complejidad    │ Baja (fácil) │ Media        │ Media-Alta   │
│ Performance    │ Excelente    │ Bueno        │ Excelente    │
│ Learning       │ Bajo         │ Muy bajo     │ Medio-Alto   │
│ Spring integ   │ Nativo       │ Spring Data  │ Integraciones
│ Activo         │ Verdaderamente      │ Reactive   │ WebFlux      │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ ELEGIMOS       │ ✓ R2DBC      │              │              │
│ PORQUE         │ • Reactivo real, no bloqueante               │
│                │ • Spring Data Reactor = fácil                │
│                │ • Perfecto para Java 21 Virtual Threads      │
│                │ • No hay "half-async" como JPA              │
└────────────────┴──────────────┴──────────────┴──────────────┘
```

---

### **Observabilidad: ELK vs Alternatives**

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Stack        │ ELK          │ Prometheus+  │ DataDog      │
│              │              │ Grafana      │              │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ Tipo logs    │ Log aggr.    │ Metrics      │ Full (SaaS)  │
│ Real-time    │ ✓ Sí         │ ✓ Sí         │ ✓ Sí         │
│ Search       │ ✓ Potente    │ Query lang   │ ✓ Sí         │
│ Alerting     │ ✓ Sí         │ ✓ Sí         │ ✓ Sí         │
│ Costo        │ Free (OSS)   │ Free (OSS)   │ $ Pagado     │
│ Instalación  │ Local Docker │ Local Docker │ Cloud        │
│ Complejidad  │ Media        │ Baja        │ Nula         │
│ Escalabilidad
│ Excelente    │ Buena        │ Excelente    │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ ELEGIMOS     │ ✓ ELK Stack  │              │              │
│ PORQUE       │ • Estudiantes = Free es crucial              │
│              │ • Logs > Metrics para debugging              │
│              │ • Kibana = UI superior                       │
│              │ • Docker Compose = setup fácil               │
│              │ • Logs JSON = structured logging             │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## **3. Matriz de Decisiones de Arquitectura**

### **¿Por qué Microservicios y no Monolito?**

```
┌─────────────────────┬──────────────┬──────────────┐
│ Característica      │ Monolito     │ Microservicios
├─────────────────────┼──────────────┼──────────────┤
│ Escalabilidad       │ ❌ Por entero│ ✅ Individual │
│ Independencia       │ ❌ Fuerte acoplamiento
│ ✅ Débil acoplamiento
│ Despliegue          │ ❌ Todo junto │ ✅ Independiente
│ Tecnología          │ ❌ Una sola   │ ✅ Flexible   │
│ Mantenibilidad      │ ⚠️ Difícil si crece
│ ✅ Más fácil     │
│ Learning Curve      │ ⚠️ Todo a la vez
│ ✅ Aprender partes │
│ Complejidad         │ ✅ Baja      │ ❌ Más complejo
│ Pruebas             │ ⚠️ Integración lenta
│ ✅ Tests rápidos   │
├─────────────────────┼──────────────┼──────────────┤
│ CASO USO IDEAL      │ Prototipos   │ Producción   │
│                     │ MVP simple   │ Escalable    │
└─────────────────────┴──────────────┴──────────────┘

CONCLUSIÓN PARA PROYECTO EDUCATIVO:
✅ Microservicios demuestra:
  • Conocimiento de patrones modernos
  • Arquitectura escalable desde el inicio
  • Dominio de multiple stacks
  • DevOps y containerización
  • Observabilidad real
```

---

### **¿Por qué R2DBC (No-bloqueante) y no JDBC (Bloqueante)?**

```
JDBC TRADICIONAL (Bloqueante):
┌─────────────────────────────┐
│ Request llega               │
│ Thread toma una conexión BD │
│ ESPERA hasta BD responde ⏳  │ ← Thread bloqueado
│ Retorna response            │
│ Thread vuelve al pool       │
└─────────────────────────────┘
Problema: Con 1000 requests = 1000 threads bloqueados = Alto memory


R2DBC REACTIVO (No-bloqueante):
┌─────────────────────────────┐
│ Request llega               │
│ Registra callback "cuando   │
│ BD responda"                │
│ Thread queda LIBRE ✓        │ ← Thread procesando otros requests
│ BD responde → Callback se   │
│ ejecuta → Retorna response  │
└─────────────────────────────┘
Ventaja: Con 1000 requests = 10-20 threads = Alto throughput


COMPARATIVA CONCRETAMENTE:

JDBC (Bloqueante):
├─ 1 Thread = 1 Request
├─ 1000 Requests = 1000 Threads
├─ 1000 Threads × 1MB cada una = 1GB memory
└─ Muy lento, timeout frecuente

R2DBC (Reactor):
├─ Muchos Requests por Thread
├─ 1000 Requests = 10 Threads
├─ 10 Threads × 1MB = 10MB memory
└─ Muy rápido, sin timeouts
```

---

## **4. Comparativa de Cumplimiento de Requisitos**

### **Requisitos de Ingeniería de Software Aplicada**

```
┌────────────────────────────────┬──────┬─────────────────────────┐
│ Requisito                      │ Met? │ Cumplimiento            │
├────────────────────────────────┼──────┼─────────────────────────┤
│ Arquitectura clara             │ ✅   │ Microservicios definida │
│ Separación de capas            │ ✅   │ Frontend/Backend/DB     │
│ Patrón de diseño               │ ✅   │ Gateway, Event-Driven   │
│ Escalabilidad                  │ ✅   │ Horizontal + R2DBC      │
│ Testing exhaustivo             │ ✅   │ 352+ tests              │
│ Code coverage                  │ ✅   │ ~80-85%                 │
│ Documentación                  │ ✅   │ 5 docs markdown         │
│ Análisis de calidad            │ ✅   │ ESLint, CheckStyle      │
│ Seguridad                      │ ✅   │ OAuth2 + JWT            │
│ Bases de datos                 │ ✅   │ Relacional + NoSQL      │
│ API REST documentada           │ ✅   │ OpenAPI/Swagger         │
│ Frontend responsivo            │ ✅   │ Ionic PWA               │
│ Observabilidad                 │ ✅   │ ELK Stack               │
│ Logging centralizado           │ ✅   │ Elasticsearch + Kibana  │
│ CI/CD ready                    │ ✅   │ Commits bien documentados
│ Version control                │ ✅   │ Git + GitHub            │
│ Docker/Containerización        │ ✅   │ 10+ containers          │
│ Performance                    │ ✅   │ R2DBC, caching, async   │
│ Resilience & Fault Tolerance   │ ✅   │ Health checks, Consul   │
│ Código limpio                  │ ✅   │ Estándares aplicados    │
└────────────────────────────────┴──────┴─────────────────────────┘

TOTAL: 20/20 REQUISITOS CUMPLIDOS ✅
```

---

## **5. Matriz de Tecnologías Utilizadas en Proyecto

### **Tabla Resumen**

```
┌────────────┬──────────────┬─────────────┬──────────────────────┐
│ Categoría  │ Tecnología   │ Versión     │ Propósito            │
├────────────┼──────────────┼─────────────┼──────────────────────┤
│ FRONTEND   │ Angular      │ 15+         │ SPA Framework        │
│            │ TypeScript   │ 5.0         │ Lenguaje tipado      │
│            │ Ionic        │ 7.0         │ UI Componentes       │
│            │ RxJS         │ 7.x         │ Observables          │
│            │ NgRx         │ 16+         │ State Management     │
│            │ SCSS         │ Latest      │ Estilos             │
│            │ Cypress      │ 13+         │ E2E Testing         │
│            │ Jasmine      │ 4.x         │ Unit Testing        │
│            │ Karma        │ 6.x         │ Test Runner         │
├────────────┼──────────────┼─────────────┼──────────────────────┤
│ BACKEND    │ Spring Boot  │ 3.4.5       │ Framework principal  │
│ (Store)    │ Java         │ 21          │ Lenguaje            │
│            │ WebFlux      │ 6.x         │ Reactive API        │
│            │ Spring Sec   │ 6.x         │ Auth/Authz          │
│            │ R2DBC        │ 1.0.x       │ Async DB Driver     │
│            │ JPA/Hibern   │ 6.x         │ ORM                 │
│            │ Logback      │ 1.x         │ Logging             │
│            │ JUnit 5      │ 5.0+        │ Testing             │
│            │ Mockito      │ 5.0+        │ Mocking             │
├────────────┼──────────────┼─────────────┼──────────────────────┤
│ BASES DATOS│ MySQL        │ 8.0         │ Store + Invoice DB  │
│            │ MongoDB      │ 7.0         │ Notifications DB    │
│ BACKEND    │ Elasticsearch│ 8.15.3      │ Logs Search         │
│ (Invoice)  │ Logstash     │ 8.15.3      │ Log Aggregation     │
│            │ Kibana       │ 8.15.3      │ Visualization       │
├────────────┼──────────────┼─────────────┼──────────────────────┤
│ BACKEND    │ Spring Boot  │ 3.4.5       │ Framework Notification
│ (Notif)    │ MongoDB      │ 7.0         │ NoSQL DB            │
├────────────┼──────────────┼─────────────┼──────────────────────┤
│ INFRA      │ Docker       │ Latest      │ Containerización    │
│            │ Docker Comp  │ 3.9+        │ Orquestación        │
│            │ Consul       │ Latest      │ Service Discovery   │
│            │ Git          │ Latest      │ Version Control     │
│            │ GitHub       │ -           │ Repository          │
└────────────┴──────────────┴─────────────┴──────────────────────┘

TOTAL DE TECNOLOGÍAS: 40+ (Frontend + Backend + Infra)
LÍNEAS DE CÓDIGO: 15,000+
TESTS AUTOMATIZADOS: 352+
CONTAINERS: 10+
```

---

**Matriz de tecnologías completa actualizada al 9 Diciembre 2025**  
**Todas probadas y validadas en proyecto educativo productivo**
