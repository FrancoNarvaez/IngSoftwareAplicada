#!/bin/bash

# Script de prueba de integración Ionic ↔ Gateway ↔ Microservicios
# Este script verifica que todos los componentes estén funcionando correctamente

set -e

echo "=================================================="
echo "  PRUEBA DE INTEGRACIÓN END-TO-END"
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar que Docker Compose esté corriendo
echo -e "${YELLOW}[1/7]${NC} Verificando servicios Docker..."
if docker ps | grep -q "store.*healthy"; then
    echo -e "${GREEN}✓${NC} Gateway (store) está corriendo"
else
    echo -e "${RED}✗${NC} Gateway no está corriendo"
    exit 1
fi

if docker ps | grep -q "invoice.*healthy"; then
    echo -e "${GREEN}✓${NC} Invoice service está corriendo"
else
    echo -e "${RED}✗${NC} Invoice service no está corriendo"
    exit 1
fi

if docker ps | grep -q "notification.*healthy"; then
    echo -e "${GREEN}✓${NC} Notification service está corriendo"
else
    echo -e "${RED}✗${NC} Notification service no está corriendo"
    exit 1
fi

if docker ps | grep -q "consul.*healthy"; then
    echo -e "${GREEN}✓${NC} Consul está corriendo"
else
    echo -e "${RED}✗${NC} Consul no está corriendo"
    exit 1
fi

echo ""

# 2. Verificar registro en Consul
echo -e "${YELLOW}[2/7]${NC} Verificando registro de servicios en Consul..."
SERVICES=$(curl -s http://localhost:8500/v1/catalog/services)
if echo "$SERVICES" | grep -q "store"; then
    echo -e "${GREEN}✓${NC} Store registrado en Consul"
else
    echo -e "${RED}✗${NC} Store NO registrado en Consul"
fi

if echo "$SERVICES" | grep -q "invoice"; then
    echo -e "${GREEN}✓${NC} Invoice registrado en Consul"
else
    echo -e "${RED}✗${NC} Invoice NO registrado en Consul"
fi

if echo "$SERVICES" | grep -q "notification"; then
    echo -e "${GREEN}✓${NC} Notification registrado en Consul"
else
    echo -e "${RED}✗${NC} Notification NO registrado en Consul"
fi

echo ""

# 3. Probar autenticación en el gateway
echo -e "${YELLOW}[3/7]${NC} Probando autenticación (POST /api/authenticate)..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:8080/api/authenticate \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin", "rememberMe": false}')

if echo "$AUTH_RESPONSE" | grep -q "id_token"; then
    echo -e "${GREEN}✓${NC} Autenticación exitosa"
    JWT_TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.id_token')
else
    echo -e "${RED}✗${NC} Autenticación falló"
    echo "Response: $AUTH_RESPONSE"
    exit 1
fi

echo ""

# 4. Probar API de productos
echo -e "${YELLOW}[4/7]${NC} Probando GET /api/products..."
PRODUCTS_RESPONSE=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" http://localhost:8080/api/products)
PRODUCTS_COUNT=$(echo "$PRODUCTS_RESPONSE" | jq '. | length')

if [ "$PRODUCTS_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} API de productos funciona ($PRODUCTS_COUNT productos encontrados)"
else
    echo -e "${YELLOW}⚠${NC} API de productos funciona pero está vacía (crear productos en la BD)"
fi

echo ""

# 5. Probar Invoice service a través del gateway
echo -e "${YELLOW}[5/7]${NC} Probando GET /services/invoice/api/invoices..."
INVOICES_RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:8080/services/invoice/api/invoices)

HTTP_CODE=$(echo "$INVOICES_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓${NC} Invoice service accesible a través del gateway"
else
    echo -e "${RED}✗${NC} Invoice service no accesible (HTTP $HTTP_CODE)"
fi

echo ""

# 6. Probar Notification service a través del gateway
echo -e "${YELLOW}[6/7]${NC} Probando GET /services/notification/api/notifications..."
NOTIFICATIONS_RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:8080/services/notification/api/notifications)

HTTP_CODE=$(echo "$NOTIFICATIONS_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓${NC} Notification service accesible a través del gateway"
else
    echo -e "${RED}✗${NC} Notification service no accesible (HTTP $HTTP_CODE)"
fi

echo ""

# 7. Verificar aplicación Ionic
echo -e "${YELLOW}[7/7]${NC} Verificando aplicación Ionic..."
if curl -s http://localhost:4200 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Aplicación Ionic está corriendo en http://localhost:4200"
else
    echo -e "${YELLOW}⚠${NC} Aplicación Ionic no está corriendo"
    echo "    Ejecuta: cd ionic-app && npm start"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}  ¡PRUEBA DE INTEGRACIÓN COMPLETADA!${NC}"
echo "=================================================="
echo ""
echo "Prueba manual recomendada:"
echo "  1. Abrir http://localhost:4200"
echo "  2. Login con admin/admin"
echo "  3. Ver catálogo de productos"
echo "  4. Agregar productos al carrito"
echo "  5. Realizar checkout"
echo ""
echo "URLs útiles:"
echo "  - Frontend Ionic: http://localhost:4200"
echo "  - Gateway API:    http://localhost:8080"
echo "  - Consul UI:      http://localhost:8500"
echo "  - Swagger Store:  http://localhost:8080/admin/docs"
echo ""
