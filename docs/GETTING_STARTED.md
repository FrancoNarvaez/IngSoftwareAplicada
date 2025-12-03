# Guía de Arranque

## 1. Prerrequisitos
- **Java**: Instalar JDK 21 (recomendado) o 17/24. Exportar `JAVA_HOME` apuntando al JDK elegido.
- **Node.js & npm**: Versión global recomendada ≥ 20. Sin embargo, cada subproyecto instala Node 22.15.0 localmente mediante Maven, por lo que solo necesitas Node para tooling adicional.
- **Maven Wrapper**: Incluido en cada módulo (`./mvnw`). No se requiere Maven global.
- **Docker & Docker Compose**: Necesarios para levantar las bases de datos, ELK, Jenkins y despliegues posteriores.
- **Ionic CLI** (pendiente de creación de la app): `npm install -g @ionic/cli`.
- **Python 3.12 + venv**: Ya configurado (`.venv/`) para scripts auxiliares.

## 2. Activar entorno Python (opcional)
```bash
cd "/home/franco/Facultad/Ing de Soft Aplicada"
source .venv/bin/activate
```

## 3. Módulos generados
- `store/`: Gateway React + Spring Boot (JWT, PostgreSQL/MariaDB configurable).
- `invoice/`: Microservicio Maven (MySQL) con API de facturación.
- `notification/`: Microservicio Maven (MongoDB) para notificaciones.

## 4. Ejecución local básica
Cada servicio puede iniciarse con el wrapper de Maven:
```bash
cd store && ./mvnw
cd invoice && ./mvnw
cd notification && ./mvnw
```
> Nota: ejecuta cada comando en terminales separados. Asegúrate de tener las bases de datos configuradas (por ahora los perfiles *dev* usan H2/embedded, los perfiles prod usarán MySQL/Mongo al desplegar).

## 5. Ramas y control de versiones
Tras cada generación JHipster, el generador inicializa un repositorio Git dentro del módulo. Puedes integrar todo en un monorepo superior (`/home/franco/Facultad/Ing de Soft Aplicada`) si lo deseas.

## 6. Configuración y despliegue con Docker Compose

### 6.1. Arquitectura de microservicios
El proyecto utiliza una arquitectura de microservicios con:
- **Gateway (store)**: Puerto 8080, React frontend + Spring Cloud Gateway
- **Invoice service**: Puerto 8081, MySQL en puerto 3307
- **Notification service**: Puerto 8082, MongoDB en puerto 27017
- **Consul**: Puerto 8500, service discovery y configuración distribuida

### 6.2. Levantar toda la infraestructura
Desde el directorio raíz del proyecto:
```bash
docker compose up -d
```

Esto iniciará:
- `mysql-store` (puerto 3308)
- `mysql-invoice` (puerto 3307)
- `mongodb-notification` (puerto 27017)
- `consul` (puerto 8500)
- `store` (puerto 8080)
- `invoice` (puerto 8081)
- `notification` (puerto 8082)

### 6.3. Verificar estado de los servicios
```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver servicios registrados en Consul
curl http://localhost:8500/v1/catalog/services

# Verificar health del gateway
curl http://localhost:8080/management/health
```

### 6.4. Construir imágenes Docker
Para reconstruir las imágenes después de cambios en el código:

```bash
# Store (gateway)
cd store && ./mvnw clean package -DskipTests jib:dockerBuild

# Invoice
cd invoice && ./mvnw clean package -DskipTests jib:dockerBuild

# Notification
cd notification && ./mvnw clean package -DskipTests jib:dockerBuild
```

Luego recrear los contenedores:
```bash
docker compose up -d --force-recreate store invoice notification
```

## 7. Ejecución de pruebas

### 7.1. Tests unitarios

#### Store
```bash
cd store
./mvnw test
```
**Cobertura**: 34 tests pasando (domain entities, security utils, mappers, architecture tests)

#### Invoice
```bash
cd invoice
./mvnw test
```
**Incluye**: `InvoiceServiceTest`, tests de entidades, repositorios

#### Notification
```bash
cd notification
./mvnw test
```
**Incluye**: `SecurityMetersServiceTest`, tests de entidades, servicios

### 7.2. Tests E2E con Cypress

Los tests E2E verifican la integración completa del gateway con los microservicios a través de Consul service discovery.

#### Prerequisitos
Asegúrate de que todos los servicios estén corriendo:
```bash
docker compose up -d
# Espera ~30 segundos para que todos los servicios se registren en Consul
```

#### Ejecutar tests E2E específicos de microservicios
```bash
cd store

# Tests de Invoice (6 tests)
npx cypress run --e2e --browser firefox --spec 'src/test/javascript/cypress/e2e/entity/invoice.cy.ts'

# Tests de Notification (6 tests)
npx cypress run --e2e --browser firefox --spec 'src/test/javascript/cypress/e2e/entity/notification.cy.ts'

# Tests de Shipment (5 tests)
npx cypress run --e2e --browser firefox --spec 'src/test/javascript/cypress/e2e/entity/shipment.cy.ts'

# Ejecutar los 3 specs juntos (17 tests)
npx cypress run --e2e --browser firefox --spec 'src/test/javascript/cypress/e2e/entity/invoice.cy.ts,src/test/javascript/cypress/e2e/entity/notification.cy.ts,src/test/javascript/cypress/e2e/entity/shipment.cy.ts'
```

#### Tests E2E de entidades locales del store
```bash
# Tests de Customer, Product, ProductCategory, etc.
npx cypress run --e2e --browser firefox --spec 'src/test/javascript/cypress/e2e/entity/customer.cy.ts'
npx cypress run --e2e --browser firefox --spec 'src/test/javascript/cypress/e2e/entity/product.cy.ts'
```

#### Ejecutar TODOS los tests E2E
```bash
cd store
npm run e2e:headless
```

#### Modo interactivo con Cypress UI
```bash
cd store
npx cypress open
```

### 7.3. Cobertura de tests E2E

Los tests E2E de microservicios (`invoice.cy.ts`, `notification.cy.ts`, `shipment.cy.ts`) verifican:
- ✅ Listado de entidades a través del gateway
- ✅ Creación de entidades con POST
- ✅ Consulta de entidades específicas con GET
- ✅ Actualización de entidades con PUT
- ✅ Eliminación de entidades con DELETE
- ✅ Filtrado con query parameters

**Resultado actual**: 17/17 tests pasando ✅

## 8. Service Discovery con Consul

### 8.1. Configuración
Todos los servicios están configurados para registrarse automáticamente en Consul al iniciar:

- **store**: `http://localhost:8080` → registrado como `store`
- **invoice**: `http://localhost:8081` → registrado como `invoice`
- **notification**: `http://localhost:8082` → registrado como `notification`

### 8.2. Routing a través del gateway
El gateway `store` enruta las peticiones a los microservicios usando service discovery:

```
GET http://localhost:8080/services/invoice/api/invoices
    ↓ (gateway resuelve 'invoice' en Consul)
    → http://invoice-service:8081/api/invoices

GET http://localhost:8080/services/notification/api/notifications
    ↓ (gateway resuelve 'notification' en Consul)
    → http://notification-service:8082/api/notifications
```

### 8.3. Verificar servicios registrados
```bash
# UI de Consul
open http://localhost:8500/ui

# API de Consul
curl http://localhost:8500/v1/catalog/services | jq
```

### 8.4. JWT compartido
Todos los servicios utilizan el mismo **JWT secret** para validar tokens:
```yaml
jhipster:
  security:
    authentication:
      jwt:
        base64-secret: YjEzYjA2YWRmZDZjZjg4ZjMzNjg5MGUyZjQ4MDQ2N2QzMmQ3ZTg3ZjgzNWE3MzBjYTIzMjU3MmNlZjQxN2QzNGU5OGRhZTZiNmZkM2Q5ZTZhOTM5YmE0MWViZDcyNGU3MTE3ODhiNDZmMzUzMzI2NjE1OWI1M2IxZWVlMjE4MTQ=
```

Esto permite que el token JWT generado por `store` sea válido en `invoice` y `notification`.

## 9. Próximos pasos
- Crear la app Ionic PWA que consuma el gateway
- Configurar pipeline Jenkins para CI/CD
- Agregar monitoreo con ELK stack
- Implementar circuit breakers con Resilience4j

## 10. Troubleshooting

### Los servicios no se registran en Consul
```bash
# Verificar logs del servicio
docker compose logs store

# Verificar que Consul esté corriendo
docker compose ps consul
```

### Tests E2E fallan con 401 Unauthorized
El JWT secret debe ser idéntico en todos los servicios. Verificar:
```bash
grep "base64-secret" store/src/main/resources/config/application-dev.yml
grep "base64-secret" invoice/src/main/resources/config/application-dev.yml
grep "base64-secret" notification/src/main/resources/config/application-dev.yml
```

### Gateway retorna 503 Service Unavailable

## 11. Aplicación Móvil/PWA con Ionic

### 11.1. Descripción
La aplicación Ionic proporciona una interfaz móvil/web para interactuar con el sistema:
- Login con autenticación JWT
- Catálogo de productos con búsqueda
- Carrito de compras con persistencia local
- Checkout y creación de órdenes

### 11.2. Instalación
```bash
cd ionic-app
npm install
```

### 11.3. Ejecución en modo desarrollo
```bash
# Asegúrate de que el backend esté corriendo (docker compose up)
cd ionic-app
npm start
# O alternativamente:
npx ionic serve
```

La aplicación se abrirá en [http://localhost:8100](http://localhost:8100)

### 11.4. Build para producción
```bash
cd ionic-app
npm run build
# Output en: www/
```

### 11.5. Usuarios de prueba
- **Admin**: usuario `admin`, contraseña `admin`
- **User**: usuario `user`, contraseña `user`

### 11.6. Configuración del API Gateway
Editar `ionic-app/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'  // URL del gateway
};
```

### 11.7. Capacitor (opcional) - Build nativo
```bash
# iOS
npx ionic cap add ios
npx ionic cap sync ios
npx ionic cap open ios

# Android
npx ionic cap add android
npx ionic cap sync android
npx ionic cap open android
```

Más detalles en [ionic-app/README.md](../ionic-app/README.md)
