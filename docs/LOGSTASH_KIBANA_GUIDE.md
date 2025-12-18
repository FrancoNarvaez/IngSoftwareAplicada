# 📊 Guía Completa: Logstash Pipeline y Visualización en Kibana

## 🔍 **PARTE 1: Pipeline de Logstash Explicado**

### **Ubicación del Pipeline**
```
logstash/pipeline/logstash.conf
```

### **Anatomía del Pipeline (3 Etapas)**

```conf
# ============================================
# ETAPA 1: INPUT - Recepción de Logs
# ============================================
input {
  tcp {
    port => 5044              # Puerto donde escucha Logstash
    codec => json             # Espera logs en formato JSON
  }
}

# ============================================
# ETAPA 2: FILTER - Procesamiento (Opcional)
# ============================================
filter {
  # Aquí se pueden agregar transformaciones:
  # - Parseo de campos
  # - Enriquecimiento con geolocalización
  # - Agregación de metadatos
  # - Filtrado por condiciones
  
  # Ejemplo de filtro (actualmente vacío):
  # mutate {
  #   add_field => { "environment" => "development" }
  # }
}

# ============================================
# ETAPA 3: OUTPUT - Destino de Logs
# ============================================
output {
  # Output principal: Elasticsearch
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "app-logs-%{+YYYY.MM.dd}"    # Índice diario (app-logs-2025-12-18)
  }
  
  # Output secundario: Consola (debugging)
  stdout { 
    codec => rubydebug                     # Formato legible en consola
  }
}
```

---

## 🔧 **PARTE 2: Cómo Funcionan los Filtros**

### **Tipos de Filtros Comunes**

#### 1. **Mutate** - Modificar campos
```conf
filter {
  mutate {
    add_field => { "service_name" => "store-service" }
    rename => { "msg" => "message" }
    remove_field => [ "unnecessary_field" ]
  }
}
```

#### 2. **Grok** - Parsear logs no estructurados
```conf
filter {
  grok {
    match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
  }
}
```

#### 3. **Date** - Parsear timestamps
```conf
filter {
  date {
    match => [ "timestamp", "ISO8601" ]
    target => "@timestamp"
  }
}
```

#### 4. **Geoip** - Enriquecer con geolocalización
```conf
filter {
  geoip {
    source => "client_ip"
    target => "geoip"
  }
}
```

---

## 📤 **PARTE 3: Cómo Llegan los Logs a Logstash**

### **Flujo Completo de un Log**

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FLUJO DE LOGS EN ELK STACK                     │
└─────────────────────────────────────────────────────────────────────┘

1. Spring Boot genera log:
   ┌────────────────────────────────────┐
   │ LOG.info("Order created - ID: 123")│
   └────────────────┬───────────────────┘
                    │
                    v
2. Logback convierte a JSON:
   ┌─────────────────────────────────────────────────────────────┐
   │ {                                                           │
   │   "@timestamp": "2025-12-18T10:30:00.123Z",                │
   │   "level": "INFO",                                          │
   │   "logger_name": "com.jhipster.demo.store.ProductOrder",   │
   │   "message": "Order created - ID: 123",                    │
   │   "thread_name": "reactor-http-nio-2",                     │
   │   "level_value": 20000                                     │
   │ }                                                           │
   └──────────────────────────┬──────────────────────────────────┘
                              │
                              v
3. Logback envía por TCP a Logstash:
   ┌────────────────────────────────────┐
   │ TCP Connection                     │
   │ localhost:5044                     │
   │ Payload: JSON (gzip comprimido)    │
   └──────────────┬─────────────────────┘
                  │
                  v
4. Logstash recibe y procesa:
   ┌────────────────────────────────────┐
   │ INPUT: TCP port 5044               │
   │ FILTER: (opcional) parseo/enriquec.│
   │ OUTPUT: Elasticsearch + stdout     │
   └──────────────┬─────────────────────┘
                  │
                  v
5. Elasticsearch indexa:
   ┌────────────────────────────────────┐
   │ Índice: app-logs-2025-12-18        │
   │ Document ID: auto-generado UUID    │
   │ Campos indexados: todos            │
   └──────────────┬─────────────────────┘
                  │
                  v
6. Kibana visualiza:
   ┌────────────────────────────────────┐
   │ Query: GET /app-logs-*/_search     │
   │ Result: Logs en tiempo real        │
   └────────────────────────────────────┘
```

---

## 🔍 **PARTE 4: Configuración de Logback (Spring Boot)**

### **Archivo: `store/src/main/resources/logback-spring.xml`**

```xml
<!-- Appender de Logstash -->
<appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
    <destination>localhost:5044</destination>
    
    <!-- Encoder JSON -->
    <encoder class="net.logstash.logback.encoder.LogstashEncoder">
        <customFields>{"service":"store-service"}</customFields>
    </encoder>
    
    <!-- Configuración de conexión -->
    <keepAliveDuration>5 minutes</keepAliveDuration>
    <writeBufferSize>16384</writeBufferSize>
</appender>

<!-- Root logger -->
<root level="INFO">
    <appender-ref ref="LOGSTASH" />
    <appender-ref ref="CONSOLE" />
</root>
```

### **Campos JSON Generados Automáticamente**

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `@timestamp` | Timestamp ISO8601 | `2025-12-18T10:30:00.123Z` |
| `level` | Nivel de log | `INFO`, `ERROR`, `DEBUG` |
| `logger_name` | Clase Java que generó el log | `com.jhipster.demo.store.web.rest.ProductOrderResource` |
| `message` | Mensaje del log | `Order created successfully - Order ID: 123` |
| `thread_name` | Thread de ejecución | `reactor-http-nio-2` |
| `stack_trace` | Stack trace (si es error) | `java.lang.NullPointerException: ...` |
| `service` | Nombre del servicio (custom) | `store-service` |

---

## 📊 **PARTE 5: Visualización en Kibana**

### **Paso 1: Crear Index Pattern**

1. Abrir Kibana: http://localhost:5601
2. Ir a **Management** → **Stack Management** → **Index Patterns**
3. Click **Create index pattern**
4. Ingresar pattern: `app-logs-*` (el asterisco matchea todas las fechas)
5. Seleccionar **@timestamp** como Time field
6. Click **Create index pattern**

---

### **Paso 2: Ver Logs en Discover**

1. Ir a **Discover** (menú lateral)
2. Seleccionar index pattern: `app-logs-*`
3. Ajustar rango de tiempo: **Last 15 minutes** (esquina superior derecha)

---

### **Paso 3: Queries KQL (Kibana Query Language)**

#### **Ver logs de inicio de aplicación (startup)**
```kql
message: "Application startup completed successfully"
```

#### **Ver logs de creación de órdenes**
```kql
message: "Order created successfully"
```

#### **Ver logs de errores**
```kql
level: "ERROR"
```

#### **Ver logs de un servicio específico**
```kql
logger_name: "com.jhipster.demo.store.web.rest.ProductOrderResource"
```

#### **Ver logs de operaciones de base de datos**
```kql
message: "Database Configuration" OR message: "R2DBC"
```

#### **Ver logs de health checks**
```kql
message: "health" OR message: "readiness"
```

#### **Combinaciones (AND/OR)**
```kql
level: "INFO" AND message: "Order created"
```

```kql
level: "ERROR" OR level: "WARN"
```

#### **Filtrar por rango de tiempo específico**
```kql
@timestamp >= "2025-12-18T10:00:00" AND @timestamp <= "2025-12-18T11:00:00"
```

---

### **Paso 4: Crear Visualizaciones**

#### **1. Gráfico de Línea: Logs por Minuto**

1. Ir a **Visualize** → **Create visualization**
2. Seleccionar **Line**
3. Configurar:
   - **Metrics**: Count
   - **Buckets**: X-Axis → Date Histogram → @timestamp → Interval: **1 minute**
4. Click **Update** → **Save**

#### **2. Pie Chart: Logs por Nivel (INFO, ERROR, WARN)**

1. **Visualize** → **Create** → **Pie**
2. Configurar:
   - **Metrics**: Count
   - **Buckets**: Split slices → Terms → Field: **level.keyword**
3. **Update** → **Save**

#### **3. Data Table: Top 10 Loggers más activos**

1. **Visualize** → **Create** → **Data table**
2. Configurar:
   - **Metrics**: Count
   - **Buckets**: Split rows → Terms → Field: **logger_name.keyword** → Size: 10
3. **Update** → **Save**

#### **4. Tag Cloud: Palabras más frecuentes en mensajes**

1. **Visualize** → **Create** → **Tag cloud**
2. Configurar:
   - **Tags**: Terms → Field: **message.keyword** → Size: 20
3. **Update** → **Save**

---

### **Paso 5: Crear Dashboard**

1. Ir a **Dashboard** → **Create dashboard**
2. Click **Add** → Seleccionar las visualizaciones creadas
3. Arrastrar y organizar paneles
4. Agregar filtros globales (ej: `level: "ERROR"`)
5. **Save dashboard** con nombre: "TechStore Monitoring"

---

## 🔥 **PARTE 6: Logs Enriquecidos que Agregamos**

### **Logs de Startup (StoreApp.java)**

#### **Antes:**
```
Application 'store' is running! Access URLs:
  Local: http://localhost:8080/
```

#### **Después:**
```
Application 'store' is running! Access URLs:
  Local: http://localhost:8080/
System Configuration - Java Version: 21.0.1, Max Memory: 4096MB, Total Memory: 512MB, Processors: 8
Database Configuration - R2DBC URL: r2dbc:mysql://****@localhost:3307/store (Reactive Driver)
Observability - Logstash logging enabled at localhost:5044
Application startup completed successfully - Ready to accept requests
```

**Query en Kibana:**
```kql
message: "Application startup completed successfully"
```

---

### **Logs de Creación de Órdenes (ProductOrderResource.java)**

#### **Antes:**
```
REST request to save ProductOrder : ProductOrder{...}
```

#### **Después:**
```
Creating new order - Customer: 1, Items count: 3, Total amount: 2549.99, Payment method: CREDIT_CARD
Order created successfully - Order ID: 123, Customer: 1, Status: PENDING, Total: 2549.99
```

**Query en Kibana:**
```kql
message: "Order created successfully"
```

**Filtrar órdenes de más de $1000:**
```kql
message: "Order created successfully" AND message: /Total: [1-9][0-9]{3}/
```

---

### **Logs de Errores en Órdenes**

#### **Nuevo Log:**
```
Order creation failed - Customer: 1, Error: Insufficient stock for product ID: 5
```

**Query en Kibana:**
```kql
message: "Order creation failed"
```

---

### **Logs de Operaciones de Listado**

#### **Nuevo Log:**
```
Fetching orders - Page: 0, Size: 20, Eager load: true
Orders retrieved successfully - Total orders: 156, Page items: 20
```

**Query en Kibana:**
```kql
message: "Orders retrieved successfully"
```

---

### **Logs de Eliminación**

#### **Nuevo Log:**
```
Deleting order - Order ID: 123
Order deleted successfully - Order ID: 123
```

**Query en Kibana:**
```kql
message: "Order deleted successfully"
```

---

## 🎯 **PARTE 7: Queries Avanzadas para Defensa**

### **1. Ver todas las operaciones de un customer específico**
```kql
message: "Customer: 1"
```

### **2. Ver logs de los últimos 5 minutos con errores**
```kql
level: "ERROR" AND @timestamp >= now-5m
```

### **3. Ver cuántas órdenes se crearon hoy**
```kql
message: "Order created successfully" AND @timestamp >= now/d
```

### **4. Ver logs de configuración de sistema**
```kql
message: "System Configuration" OR message: "Database Configuration"
```

### **5. Ver logs de health checks**
```kql
message: "health" OR logger_name: "HealthCheck"
```

### **6. Ver logs de un thread específico (debugging)**
```kql
thread_name: "reactor-http-nio-2"
```

### **7. Ver logs con stack traces (excepciones)**
```kql
_exists_: stack_trace
```

---

## 🛠️ **PARTE 8: Troubleshooting**

### **Problema 1: No veo logs en Kibana**

#### **Checklist:**
1. ✅ Verificar que Elasticsearch está corriendo:
```bash
curl http://localhost:9200/_cluster/health
```

2. ✅ Verificar que Logstash está corriendo:
```bash
docker logs logstash | tail -20
```

3. ✅ Verificar que Spring Boot está enviando logs:
```bash
# Debe aparecer "Observability - Logstash logging enabled"
docker logs store-service | grep Logstash
```

4. ✅ Verificar que hay índices en Elasticsearch:
```bash
curl http://localhost:9200/_cat/indices?v
```

5. ✅ Verificar que el Index Pattern en Kibana matchea:
```
Index pattern: app-logs-*
Índices existentes: app-logs-2025-12-18
```

---

### **Problema 2: Logs aparecen sin formato JSON**

**Solución:** Verificar `logback-spring.xml`:
```xml
<encoder class="net.logstash.logback.encoder.LogstashEncoder" />
```

---

### **Problema 3: Timezone incorrecto**

**Solución en Kibana:**
1. **Management** → **Stack Management** → **Advanced Settings**
2. Buscar: `dateFormat:tz`
3. Cambiar a: `America/Argentina/Buenos_Aires`

---

## 📌 **PARTE 9: Comandos Útiles para Defensa**

### **Generar logs de prueba**
```bash
# Crear orden
curl -X POST http://localhost:8080/api/product-orders \
  -H "Content-Type: application/json" \
  -d '{"totalPrice": 1234.56, "paymentMethod": "CREDIT_CARD"}'

# Listar órdenes
curl http://localhost:8080/api/product-orders

# Ver health
curl http://localhost:8080/management/health
```

### **Ver logs directamente en Elasticsearch**
```bash
# Últimos 5 logs
curl 'http://localhost:9200/app-logs-*/_search?size=5&sort=@timestamp:desc' | jq '.hits.hits[]._source'

# Logs de errores
curl 'http://localhost:9200/app-logs-*/_search?q=level:ERROR&size=10' | jq

# Contar logs por nivel
curl 'http://localhost:9200/app-logs-*/_search' \
  -H 'Content-Type: application/json' \
  -d '{"size":0,"aggs":{"levels":{"terms":{"field":"level.keyword"}}}}' | jq
```

### **Ver pipeline de Logstash en ejecución**
```bash
# Ver configuración cargada
docker exec logstash cat /usr/share/logstash/pipeline/logstash.conf

# Ver logs de Logstash
docker logs logstash --tail 50 --follow
```

---

## 🎓 **PARTE 10: Puntos Clave para la Defensa**

### **1. Flujo de Logs (explicar con diagrama)**
```
Spring Boot → Logback (JSON) → TCP:5044 → Logstash → Elasticsearch → Kibana
```

### **2. Por qué JSON en lugar de texto plano**
- ✅ Estructurado = búsquedas más rápidas
- ✅ Campos indexables (filtrar por `level`, `logger_name`, etc.)
- ✅ No necesita parseo con Grok (más rápido)

### **3. Por qué índices diarios (`app-logs-%{+YYYY.MM.dd}`)**
- ✅ Performance: búsquedas más rápidas (menos datos por índice)
- ✅ Gestión: fácil eliminar logs antiguos (`DELETE /app-logs-2025-11-*`)
- ✅ Escalabilidad: distribuir índices en múltiples nodos

### **4. Ventajas de ELK vs Logs en archivo**
- ✅ Centralizado: todos los microservicios en un solo lugar
- ✅ Búsqueda: encontrar un log en 100GB en segundos
- ✅ Real-time: ver logs mientras suceden
- ✅ Visualización: gráficos, dashboards, alertas

### **5. Logs enriquecidos que agregamos**
- ✅ Startup: versión Java, memoria, configuración BD
- ✅ Operaciones: crear/listar/eliminar órdenes con contexto
- ✅ Errores: mensajes descriptivos con stack traces
- ✅ Performance: contar items, total de registros

---

**Última actualización: 18 Diciembre 2025**  
**Rama: feature/enrich-logging**
