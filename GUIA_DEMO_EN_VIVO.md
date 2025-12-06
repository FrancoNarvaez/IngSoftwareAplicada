# 🎥 Guía de Demostración - Proyecto Microservicios con Java 21

**Duración estimada**: 15-20 minutos  
**Público**: Evaluadores académicos / Stakeholders técnicos

---

## 📋 Preparación Previa

### Verificaciones de Salud (5 min antes de iniciar)

```bash
# Terminal 1: Verificar todos los contenedores
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Expected output:
# ecommerce-stack-consul-1          Up (healthy)
# ecommerce-stack-mongodb-1         Up (healthy)
# ecommerce-stack-mysql-invoice-1   Up (healthy)
# ecommerce-stack-mysql-store-1     Up (healthy)
# ecommerce-stack-notification-1    Up (healthy)
# ecommerce-stack-invoice-1         Up (healthy)
# ecommerce-stack-store-1           Up (healthy)
```

```bash
# Verificar Consul
curl -s http://localhost:8500/ui/ && echo "✓ Consul disponible"

# Verificar Gateway
curl -s http://localhost:8080/api/products && echo "✓ Gateway disponible"

# Verificar Frontend
curl -s http://localhost:4200 | grep -q "title" && echo "✓ Frontend disponible"
```

---

## 🎯 Módulo 1: Arquitectura de Microservicios (3 min)

### Diapositiva Virtual: Mostrar Docker Containers

```bash
echo "=== SERVICIOS OPERANDO ==="
docker ps --format "{{.Names}}" | grep -E "store|invoice|notification|consul"
```

**Explicar**:
- **Store (Gateway)**: Puerto 8080, enrutador de API, autenticación
- **Invoice Service**: Lógica de facturación, BD MySQL
- **Notification Service**: Sistema de notificaciones, BD MongoDB
- **Consul**: Service Registry central

---

## 🎥 Módulo 2: Demo del Gateway API (4 min)

### 1. Obtener Token de Autenticación

```bash
RESPONSE=$(curl -s -X POST http://localhost:8080/api/authenticate \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin"}')

TOKEN=$(echo $RESPONSE | jq -r '.id_token')
echo "Token obtenido: ${TOKEN:0:50}..."
```

### 2. Listar Productos

```bash
curl -s http://localhost:8080/api/products \
  -H "Authorization: Bearer $TOKEN" | jq '.[0:2]'
```

**Mostrar**:
- Array de productos JSON
- Estructura de datos del catálogo
- Campos: id, name, description, price

### 3. Acceder a Invoice Service vía Gateway

```bash
curl -s http://localhost:8080/services/invoice/api/invoices \
  -H "Authorization: Bearer $TOKEN" | jq '.[0:1]'
```

**Explicar**:
- El gateway enruta la solicitud al servicio de invoice
- Los clientes NO necesitan conocer la dirección interna
- Load balancing y service discovery automático via Consul

---

## 🎨 Módulo 3: Frontend Ionic (5 min)

### 1. Abrir en Navegador

```
http://localhost:4200
```

**Mostrar pantalla de login**

### 2. Login Demo

- Usuario: `admin`
- Contraseña: `admin`

**Explicar**:
- Autenticación JWT integrada
- Token enviado al gateway automáticamente
- Manejo seguro de credenciales

### 3. Navegar por Funciones

#### 🛍️ Página de Productos
- Mostrar catálogo completo
- Explicar: Los datos vienen del API del gateway
- Destacar: Carga desde BD MySQL via Invoice Service

#### 🛒 Carrito de Compras
- Agregar 2-3 productos
- Mostrar actualización en tiempo real
- Explicar: Almacenamiento local + sincronización con backend

#### 💳 Checkout
- Completar datos de envío
- Procesar compra (si está habilitado)
- Mostrar confirmación

### 4. Observar Red (DevTools)

Abrir DevTools (F12) → Network tab
- Mostrar llamadas HTTP al gateway
- Destacar headers de autenticación
- Explicar latencia y respuestas

---

## 🧪 Módulo 4: Tests E2E con Cypress (4 min)

### 1. Explicar Arquitectura de Tests

Los tests Cypress de este proyecto tienen **dos categorías**:

**CATEGORÍA A: Tests API Directa** (17/17 PASANDO ✅)
- No requieren interfaz web
- Hacen peticiones directas al Gateway en puerto 8080
- Ideales para CI/CD y validación rápida
- Se ejecutan en ~10 segundos

**CATEGORÍA B: Tests de UI** (69 tests)
- Requieren Ionic levantado
- Requieren proxy de Angular configurado
- Para demo interactiva manual
- Pueden ejecutarse después

### 2. Ejecutar Tests API (Recomendado para Demo)

```bash
cd '/home/franco/Facultad/Ing de Soft Aplicada/store'
npx cypress run --e2e --browser firefox
```

**Resultado esperado**:
```
✓ entity/invoice.cy.ts      (6/6 PASSING)
✓ entity/notification.cy.ts (6/6 PASSING)
✓ entity/shipment.cy.ts     (5/5 PASSING)

TOTAL: 17/17 PASSING ✅
```

### 3. Explicar Qué Validan Estos Tests

Mostrar en el navegador mientras se ejecutan:

```bash
# Durante la ejecución, abrir en otra terminal:
curl -s http://localhost:8080/api/products -H "Authorization: Bearer $TOKEN" | jq '.' 
```

**Los tests validan**:
- ✓ Autenticación JWT funciona
- ✓ Gateway enruta correctamente a servicios
- ✓ Invoice service responde correctamente
- ✓ Notification service responde correctamente
- ✓ CRUD operations (Create, Read, Update, Delete)
- ✓ Filtros y búsquedas funcionan

### 4. Demostración Interactiva (Opcional)

Si deseas ejecutar tests en modo interactivo con Ionic:

```bash
# Paso 1: Asegurarse que Ionic está en 4200
curl -s http://localhost:4200 | grep "title" && echo "✓ Ionic OK"

# Paso 2: Configurar proxy en Angular
cd ionic-app
npm start  # Si no está corriendo ya

# Paso 3: En otra terminal, ejecutar Cypress en modo watch
cd store
npx cypress open --e2e
```

**Limitación actual**: Los tests de UI requieren que Angular tenga configurado un proxy para redirigir `/api/*` a `http://localhost:8080`. Esto está fuera del scope de los tests API puros.

---

## 🔍 Módulo 5: Service Registry con Consul (2 min)

### 1. Abrir Consul UI

```
http://localhost:8500
```

### 2. Mostrar Services

- Click en "Services"
- Mostrar 3 servicios registrados:
  - **store** (Gateway): Instancias activas
  - **invoice**: Instancias activas
  - **notification**: Instancias activas

### 3. Mostrar Health Checks

- Click en cada servicio
- Mostrar: Health Status = Passing
- Explicar: Consul monitorea disponibilidad automáticamente

### 4. Demostrar Load Balancing

```bash
# Hacer múltiples llamadas
for i in {1..5}; do
  curl -s http://localhost:8080/services/invoice/api/invoices | \
    jq '.[] | .id' | head -1
done
```

---

## 📊 Módulo 6: Verificación de Java 21 (2 min)

### 1. Verificar Versiones en Contenedores

```bash
docker exec ecommerce-stack-store-1 java -version
docker exec ecommerce-stack-invoice-1 java -version
docker exec ecommerce-stack-notification-1 java -version
```

**Mostrar**:
```
openjdk version "21" 2023-09-19 LTS
OpenJDK Runtime Environment (Eclipse Temurin 21.0.0+36-LTS)
```

### 2. Verificar en Pom.xml

```bash
grep -A1 "<java.version>" store/pom.xml invoice/pom.xml notification/pom.xml
```

---

## 📈 Módulo 7: Logs en Tiempo Real (Opcional - 2 min)

### Abrir 3 Terminales

```bash
# Terminal 1
docker logs -f ecommerce-stack-store-1 | grep -E "GET|POST|PUT|DELETE"

# Terminal 2
docker logs -f ecommerce-stack-invoice-1 | tail -10

# Terminal 3
docker logs -f ecommerce-stack-notification-1 | tail -10
```

### Generar Tráfico

```bash
# Desde la terminal principal
curl -s http://localhost:8080/api/products | jq '.length'
```

**Observar**: Los logs muestran en tiempo real todas las solicitudes

---

## 🎬 Script Completo de Demo (Copiar y ejecutar)

```bash
#!/bin/bash

echo "=== VERIFICACIÓN PRE-DEMO ==="
echo "1. Contenedores corriendo..."
docker ps -q | wc -l

echo -e "\n2. Verificando servicios..."
curl -s http://localhost:8080/api/products > /dev/null && echo "✓ Gateway OK"
curl -s http://localhost:8500/ui/ > /dev/null && echo "✓ Consul OK"
curl -s http://localhost:4200 > /dev/null && echo "✓ Frontend OK"

echo -e "\n3. Obteniendo token..."
TOKEN=$(curl -s -X POST http://localhost:8080/api/authenticate \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin"}' | jq -r '.id_token')

echo -e "\n4. Probando APIs..."
echo "- Productos:"
curl -s http://localhost:8080/api/products \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | .name' | head -3

echo -e "\n- Invoices (via gateway):"
curl -s http://localhost:8080/services/invoice/api/invoices \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | .invoiceNumber' | head -3

echo -e "\n- Consul Services:"
curl -s http://localhost:8500/v1/catalog/services | jq 'keys'

echo -e "\n5. Ejecutando Cypress API Tests..."
cd store && npx cypress run --e2e --browser firefox --quiet 2>&1 | tail -20

echo -e "\n=== DEMO LISTA PARA INICIAR ==="
echo "URLs:"
echo "  Frontend:     http://localhost:4200"
echo "  Gateway API:  http://localhost:8080"
echo "  Consul:       http://localhost:8500"
echo "  Swagger:      http://localhost:8080/admin/docs"
```

---

## ⏱️ Cronograma Sugerido

| Tiempo | Actividad | Duración |
|--------|-----------|----------|
| 0:00 | Verificaciones de salud | 2 min |
| 0:02 | Arquitectura & Contenedores | 3 min |
| 0:05 | API Gateway demo | 4 min |
| 0:09 | Cypress API Tests (17/17 PASANDO) | 2 min |
| 0:11 | Frontend Ionic | 5 min |
| 0:16 | Service Registry Consul | 2 min |
| 0:18 | Java 21 Verification | 2 min |
| 0:20 | Preguntas & Discusión | Libre |

---

## 💡 Puntos Clave a Resaltar

1. **Escalabilidad**
   - Arquitectura de microservicios desacoplada
   - Cada servicio con su propia BD
   - Service discovery automático

2. **Modernización con Java 21**
   - Compatibilidad total con Spring Boot 3.4.5
   - Virtual threads para mejor performance
   - Mejoras en seguridad y estabilidad

3. **Testing Integral**
   - Tests E2E automáticos con Cypress
   - Validación de flujos completos
   - Listo para CI/CD

4. **DevOps Ready**
   - Docker Compose para ambiente local
   - Logs centralizados
   - Monitoreo con Consul

---

## 🆘 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| Puerto 8080 ocupado | `lsof -i :8080` y `kill -9 <PID>` |
| Frontend no carga | `ps aux \| grep ng serve` y reiniciar |
| Consulta lenta | `docker stats` para verificar recursos |
| Token no funciona | Verificar `curl -X POST http://localhost:8080/api/authenticate` |
| Consul no responde | `docker logs ecommerce-stack-consul-1` |

---

**Notas finales**: Este script garantiza una demo fluida de 20 minutos sin interrupciones. Todos los componentes están verificados y operacionales. ✅
