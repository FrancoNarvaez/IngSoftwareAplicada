# Plan de Trabajo - Proyecto JHipster / Ionic / CI-CD

## 1. Alcance General
- Plataforma principal generada con JHipster v8 (stack Angular) a partir del modelo `microservice-ecommerce-store-k8s.jdl`.
- Arquitectura microservicios (gateway, registry, servicios de negocio y ms de soporte) con PostgreSQL como motor relacional principal.
- Complementos obligatorios: pruebas unitarias, pruebas E2E con Cypress, despliegue Docker, stack ELK, app Ionic/PWA y pipeline Jenkins con publicación en Docker Hub.

## 2. Fases
1. **Preparación**: instalación de prerequisitos (Java 17+, Node 18+, Yarn/NPM, Docker, Jenkins local, Ionic CLI). Creación de entorno virtual Python para scripts auxiliares. *(Completado: `.venv/` disponible y dependencias clave validadas.)*
2. **Generación base**: descarga del JDL, ejecución de `jhipster import-jdl microservice-ecommerce-store-k8s.jdl`, revisión de entidades y ajustes de configuración (DB, puertos, perfiles). *(Completado: aplicaciones `store` (gateway React), `invoice` y `notification` generadas con Maven + configuración JWT.)*
3. **Pruebas**: añadir al menos dos pruebas unitarias en los microservicios clave y configurar Cypress con 3 flujos end-to-end autenticados mediante API.
4. **Contenedores y logging**: consolidar Dockerfiles/docker-compose, añadir servicios de Elastic, Logstash y Kibana más forwarders para logs de todos los contenedores.
5. **Aplicación Ionic/PWA**: crear app Ionic independiente que consuma endpoints del gateway, implementar funcionalidad offline (cache + fallback) y build PWA.
6. **CI/CD**: preparar Jenkinsfile, parametrizar credenciales (`DOCKERHUB_USERNAME`, `DOCKERHUB_PASSWORD`, `JENKINS_ADMIN_PASSWORD`, etc.), construir imagen y push a Docker Hub.

## 3. Entregables Clave
- Repositorio con módulos generados por JHipster y documentación de configuración.
- Scripts/compose para levantar todo el ecosistema (apps + ELK + Jenkins + Ionic).
- Suite de pruebas automatizadas (unitarias + Cypress) con instrucciones de ejecución.
- App Ionic con capacidades PWA y guía de despliegue.
- Pipeline Jenkins funcional con placeholders para credenciales reales.

## 4. Supuestos y Parámetros
- Jenkins correrá en la máquina local dentro de contenedor Docker.
- Credenciales sensibles se manejarán mediante variables de entorno/secretos.
- No hay requisitos adicionales de branding para Ionic; se enfocará en funcionalidades y UX clara.
- Se utilizará PostgreSQL salvo que el JDL requiera otro tipo de almacenamiento específico (se documentará si hay excepciones).

## 5. Próximos pasos inmediatos
1. Normalizar requisitos de Node/Java en cada módulo (`mvnw` instala Node 22.15.0 localmente; documentar que se requiere JDK 17/21/24 en runtime).
2. Diseñar y codificar las pruebas unitarias adicionales (mínimo 2) en `invoice` y/o `notification` + refinar pruebas existentes.
3. Preparar los 3 flujos Cypress (login vía API, CRUD entidad, flujo de compra) dentro de `store`.
4. Montar `docker-compose` unificado (store + invoice + notification + bases + registry + ELK + Jenkins + Ionic).
5. Bootstrap de la app Ionic/PWA y definición de endpoints a consumir desde el gateway.

## 6. Plan detallado de pruebas y despliegues
- **Pruebas unitarias**: extender los módulos `invoice` y `notification` con casos específicos (servicios InvoiceService/NotificationService validando reglas de negocio, controladores con MockMvc/WebTestClient). Asegurar cobertura de mínima 2 pruebas nuevas y reportes con Maven Surefire.
- **Pruebas E2E Cypress**: reutilizar el entorno Cypress existente en `store` agregando suites `auth-login-via-api.cy.ts`, `catalogue-order.cy.ts` y `admin-orderstatus.cy.ts`. Cada suite iniciará sesión pegando a `/api/authenticate` para obtener el token JWT y luego usará comandos personalizados para peticiones autenticadas.
- **Docker/ELK**: partir de los `src/main/docker/*.yml` generados y componer un `docker-compose` raíz que orqueste `store`, `invoice`, `notification`, PostgreSQL, MongoDB, Elasticsearch, Logstash, Kibana y Filebeat/Fluentd para forwardear logs. Exponer volumenes y variables para credenciales placeholder (`ELASTIC_PASSWORD`, `LOGSTASH_JWT_SECRET`).
- **Ionic/PWA**: crear proyecto `ionic-app/` (Angular + Capacitor), consumir endpoints públicos del gateway (`/api/products`, `/api/product-orders`). Convertirlo en PWA con `@angular/pwa`, implementar caching de catálogos (Workbox) y modo offline para el carrito.
- **CI/CD (Jenkins)**: definir `Jenkinsfile` con stages `Build`, `Test`, `Docker Build`, `Docker Push`. Usar agentes dockerizados, inyectar `DOCKERHUB_USERNAME/DOCKERHUB_PASSWORD`, `JENKINS_ADMIN_PASSWORD` como credenciales. Pipeline apuntará a ramas principales, levantará contenedores para pruebas e invocará `npm run test`, `./mvnw -Pprod verify` y `docker build`.
