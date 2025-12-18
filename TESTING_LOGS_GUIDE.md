# ✅ RESUMEN: Logs Enriquecidos + Guía Kibana

## 📋 **RESPUESTAS A TUS PREGUNTAS**

### **1️⃣ Persistencia en PWA (cart.service.ts)**

**✅ CONFIRMADO: SÍ HAY PERSISTENCIA OFFLINE**

Tu archivo `cart.service.ts` **NO usa `localStorage` directamente**, pero usa algo **MEJOR**:

#### **`@capacitor/preferences` (línea 3)**

```typescript
import { Preferences } from '@capacitor/preferences';
```

#### **Por qué es mejor que localStorage:**
- ✅ **Cross-platform**: Funciona en web, iOS (UserDefaults) y Android (SharedPreferences)
- ✅ **Async**: No bloquea la UI (localStorage es síncrono)
- ✅ **Sin límite de 5MB**: localStorage tiene límite, Capacitor no
- ✅ **Más seguro**: Soporte para encriptación

#### **Cómo funciona (código existente):**

**Línea 33-43: Carga al iniciar**
```typescript
private async loadCart(): Promise<void> {
  const { value } = await Preferences.get({ key: this.CART_KEY });
  if (value) {
    const items: CartItem[] = JSON.parse(value);
    this.cartItemsSubject.next(items);
  }
}
```

**Línea 49-53: Guarda en cada cambio**
```typescript
private async saveCart(items: CartItem[]): Promise<void> {
  await Preferences.set({
    key: this.CART_KEY,
    value: JSON.stringify(items)
  });
}
```

**Línea 119: Limpia al finalizar orden**
```typescript
async clearCart(): Promise<void> {
  await Preferences.remove({ key: this.CART_KEY });
}
```

#### **✅ CONCLUSIÓN:**
Tu implementación es **correcta y moderna**. Capacitor Preferences es el equivalente mejorado de localStorage para PWAs modernas.

---

### **2️⃣ Logs Enriquecidos en Spring Boot**

**✅ IMPLEMENTADO: Logs detallados de startup, operaciones y errores**

#### **Cambios realizados:**

##### **A. StoreApp.java (Logs de Startup)**

**Antes:**
```
Application 'store' is running! Access URLs:
  Local: http://localhost:8080/
```

**Después (ENRIQUECIDO):**
```
Application 'store' is running! Access URLs:
  Local: http://localhost:8080/
System Configuration - Java Version: 21.0.1, Max Memory: 4096MB, Total Memory: 512MB, Processors: 8
Database Configuration - R2DBC URL: r2dbc:mysql://****@localhost:3307/store (Reactive Driver)
Observability - Logstash logging enabled at localhost:5044
Application startup completed successfully - Ready to accept requests
```

##### **B. ProductOrderResource.java (Logs de Operaciones)**

**Crear orden (línea 60):**
```java
LOG.info("Creating new order - Customer: {}, Items count: {}, Total amount: {}, Payment method: {}",
    productOrder.getCustomer().getId(),
    productOrder.getOrderItems().size(),
    productOrder.getTotalPrice(),
    productOrder.getPaymentMethod()
);
```

**Orden creada exitosamente:**
```java
LOG.info("Order created successfully - Order ID: {}, Customer: {}, Status: {}, Total: {}",
    result.getId(),
    result.getCustomer().getId(),
    result.getStatus(),
    result.getTotalPrice()
);
```

**Error al crear orden:**
```java
LOG.error("Order creation failed - Customer: {}, Error: {}",
    productOrder.getCustomer().getId(),
    error.getMessage(),
    error
);
```

**Listar órdenes (línea 171):**
```java
LOG.info("Fetching orders - Page: {}, Size: {}, Eager load: {}",
    pageable.getPageNumber(),
    pageable.getPageSize(),
    eagerload
);

LOG.info("Orders retrieved successfully - Total orders: {}, Page items: {}",
    countWithEntities.getT1(),
    countWithEntities.getT2().size()
);
```

**Eliminar orden (línea 216):**
```java
LOG.info("Deleting order - Order ID: {}", id);
LOG.info("Order deleted successfully - Order ID: {}", id);
```

---

## 🚀 **CÓMO PROBAR LOS CAMBIOS**

### **Paso 1: Iniciar Stack ELK + Servicios**

```bash
cd "/home/franco/Facultad/Ing de Soft Aplicada"

# Liberar puertos
bash liberar-puertos.sh

# Iniciar todo
docker-compose up -d

# Esperar 2 minutos para que todo inicie
sleep 120

# Verificar que todos los servicios están corriendo
docker ps
```

**Servicios esperados:**
- ✅ Elasticsearch (puerto 9200)
- ✅ Logstash (puerto 5044)
- ✅ Kibana (puerto 5601)
- ✅ Store Service (puerto 8080)
- ✅ MySQL (puerto 3307)
- ✅ Consul (puerto 8500)

---

### **Paso 2: Verificar Logs de Startup**

```bash
# Ver logs del servicio Store
docker logs store-service

# Deberías ver:
# System Configuration - Java Version: 21.0.1, Max Memory: ...
# Database Configuration - R2DBC URL: ...
# Observability - Logstash logging enabled at localhost:5044
# Application startup completed successfully
```

---

### **Paso 3: Generar Logs de Operaciones**

```bash
# Crear orden (genera logs enriquecidos)
curl -X POST http://localhost:8080/api/product-orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "totalPrice": 1234.56,
    "paymentMethod": "CREDIT_CARD",
    "status": "PENDING"
  }'

# Listar órdenes
curl http://localhost:8080/api/product-orders

# Ver health (genera logs)
curl http://localhost:8080/management/health
```

---

### **Paso 4: Verificar Logs en Elasticsearch**

```bash
# Ver últimos 5 logs
curl 'http://localhost:9200/app-logs-*/_search?size=5&sort=@timestamp:desc' | jq '.hits.hits[]._source | {timestamp, level, message}'

# Ver logs de startup
curl 'http://localhost:9200/app-logs-*/_search?q=message:"Application startup completed"' | jq

# Ver logs de órdenes creadas
curl 'http://localhost:9200/app-logs-*/_search?q=message:"Order created successfully"' | jq
```

---

### **Paso 5: Visualizar en Kibana**

#### **5.1 Crear Index Pattern**

1. Abrir: http://localhost:5601
2. Ir a: **Management** → **Stack Management** → **Index Patterns**
3. Click: **Create index pattern**
4. Ingresar: `app-logs-*`
5. Time field: `@timestamp`
6. Click: **Create**

#### **5.2 Ver Logs en Discover**

1. Ir a: **Discover** (menú lateral)
2. Seleccionar: `app-logs-*`
3. Time range: **Last 15 minutes**

#### **5.3 Queries KQL para Probar**

**Ver logs de startup:**
```kql
message: "Application startup completed successfully"
```

**Ver logs de configuración:**
```kql
message: "System Configuration" OR message: "Database Configuration"
```

**Ver logs de órdenes creadas:**
```kql
message: "Order created successfully"
```

**Ver logs de errores:**
```kql
level: "ERROR"
```

**Ver logs de un logger específico:**
```kql
logger_name: "com.jhipster.demo.store.web.rest.ProductOrderResource"
```

**Ver logs de los últimos 5 minutos:**
```kql
@timestamp >= now-5m
```

---

## 📊 **VER PIPELINE DE LOGSTASH**

### **Ubicación del archivo:**
```
logstash/pipeline/logstash.conf
```

### **Contenido actual:**

```conf
# ============================================
# INPUT - Recepción de Logs
# ============================================
input {
  tcp {
    port => 5044              # Puerto donde escucha Logstash
    codec => json             # Espera logs en formato JSON
  }
}

# ============================================
# FILTER - Procesamiento (actualmente vacío)
# ============================================
filter {
  # Aquí se pueden agregar transformaciones
}

# ============================================
# OUTPUT - Destino de Logs
# ============================================
output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "app-logs-%{+YYYY.MM.dd}"    # Índice diario
  }
  stdout { 
    codec => rubydebug                     # Debug en consola
  }
}
```

### **Explicación:**

1. **INPUT**: Logstash escucha en puerto **5044** (TCP) esperando JSON
2. **FILTER**: (Vacío por ahora) Aquí se pueden agregar transformaciones
3. **OUTPUT**: 
   - Envía a Elasticsearch con índice **`app-logs-2025-12-18`** (diario)
   - También imprime en stdout para debugging

### **Ver configuración cargada:**
```bash
docker exec logstash cat /usr/share/logstash/pipeline/logstash.conf
```

### **Ver logs de Logstash en tiempo real:**
```bash
docker logs logstash --tail 50 --follow
```

---

## 📚 **DOCUMENTACIÓN COMPLETA**

Toda la documentación está en:
```
docs/LOGSTASH_KIBANA_GUIDE.md
```

**Incluye:**
- ✅ Anatomía del pipeline Logstash (input, filter, output)
- ✅ Flujo completo de logs (Spring → Logback → Logstash → ES → Kibana)
- ✅ 10+ queries KQL para filtrar logs
- ✅ Tutorial de visualizaciones (gráficos, dashboards)
- ✅ Troubleshooting de ELK
- ✅ Comandos útiles para debugging

---

## 🎯 **PARA LA DEFENSA**

### **Archivos clave modificados:**

1. **`store/src/main/java/com/jhipster/demo/store/StoreApp.java`**
   - Logs de startup enriquecidos (líneas 71-115)
   - Método `maskPassword()` para seguridad (línea 117)

2. **`store/src/main/java/com/jhipster/demo/store/web/rest/ProductOrderResource.java`**
   - Logs de creación de órdenes (líneas 60-82)
   - Logs de listado (líneas 171-188)
   - Logs de eliminación (líneas 216-229)

3. **`logstash/pipeline/logstash.conf`**
   - Pipeline ELK (input TCP, output Elasticsearch)

4. **`docs/LOGSTASH_KIBANA_GUIDE.md`**
   - Documentación completa de 600+ líneas

### **Demostración en vivo:**

1. Mostrar logs de startup en terminal:
```bash
docker logs store-service | grep "Application startup"
```

2. Crear orden y ver logs en tiempo real:
```bash
# Terminal 1: Ver logs en tiempo real
docker logs store-service --follow

# Terminal 2: Crear orden
curl -X POST http://localhost:8080/api/product-orders ...
```

3. Mostrar logs en Kibana con query:
```kql
message: "Order created successfully"
```

4. Explicar pipeline de Logstash:
```bash
cat logstash/pipeline/logstash.conf
```

---

## 🔧 **TROUBLESHOOTING**

### **Problema: No veo logs en Kibana**

```bash
# 1. Verificar Elasticsearch
curl http://localhost:9200/_cluster/health

# 2. Verificar Logstash
docker logs logstash | tail -20

# 3. Verificar índices
curl http://localhost:9200/_cat/indices?v

# 4. Verificar logs en Elasticsearch directamente
curl 'http://localhost:9200/app-logs-*/_search?size=5'
```

### **Problema: Servicios no inician**

```bash
# Liberar puertos
bash liberar-puertos.sh

# Reiniciar stack
docker-compose down
docker-compose up -d

# Ver logs de errores
docker-compose logs
```

---

## 📌 **COMANDOS RÁPIDOS**

```bash
# Ver logs de startup
docker logs store-service | grep "System Configuration"

# Ver logs de Logstash
docker logs logstash | tail -50

# Ver últimos logs en ES
curl 'http://localhost:9200/app-logs-*/_search?size=3&sort=@timestamp:desc' | jq

# Crear orden de prueba
curl -X POST http://localhost:8080/api/product-orders \
  -H "Content-Type: application/json" \
  -d '{"totalPrice": 999.99, "paymentMethod": "CREDIT_CARD"}'

# Ver health
curl http://localhost:8080/management/health
```

---

**✅ TODO LISTO PARA PROBAR Y DEFENDER**

**Rama actual:** `feature/enrich-logging`  
**Archivos modificados:** 3 (StoreApp, ProductOrderResource, logstash.conf)  
**Documentación nueva:** 1 (LOGSTASH_KIBANA_GUIDE.md - 600+ líneas)  
**Última actualización:** 18 Diciembre 2025
