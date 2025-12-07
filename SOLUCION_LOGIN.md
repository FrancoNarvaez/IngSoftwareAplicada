# 🔧 Solución al Problema de Login - Ionic App

## 📋 Diagnóstico Completo

### ✅ Lo que está funcionando correctamente:

1. **Backend (Puerto 8080)**: Responde correctamente a peticiones de autenticación
   ```bash
   curl -X POST http://localhost:8080/api/authenticate \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin","rememberMe":false}'
   # Resultado: 200 OK + JWT token
   ```

2. **Proxy (Puerto 4200 → 8080)**: Redirige correctamente las peticiones
   ```bash
   curl -X POST http://localhost:4200/api/authenticate \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin","rememberMe":false}'
   # Resultado: 200 OK + JWT token
   ```

3. **Tests de Cypress**: Todos los tests pasaron exitosamente
   - ✅ Backend responde
   - ✅ Proxy funciona
   - ✅ Página de login carga
   - ✅ Login a través del formulario funciona
   - ✅ No hay errores de JavaScript

### 🔍 El Problema

El problema es **caché del navegador** que mantiene una versión antigua del código que apuntaba a `http://localhost:8080` directamente (causando errores CORS).

## 🛠️ Cambios Realizados

### 1. Configuración del Proxy (`ionic-app/proxy.conf.json`)
```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  },
  "/services": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug"
  },
  "/management": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug"
  }
}
```

### 2. Configuración de Angular (`ionic-app/angular.json`)
Agregado en `projects.app.architect.serve.options`:
```json
"proxyConfig": "proxy.conf.json"
```

### 3. Configuración de Environment (`ionic-app/src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: ''  // ← Cambiado de 'http://localhost:8080' a ''
};
```

### 4. Logging Mejorado
Agregado logging detallado en:
- `auth.service.ts`: Logs de peticiones HTTP
- `login.page.ts`: Logs de intentos de login

## 🚀 Cómo Usar la Aplicación

### Iniciar Servicios

```bash
# 1. Levantar Docker Compose (backend)
cd '/home/franco/Facultad/Ing de Soft Aplicada'
docker-compose up -d

# 2. Verificar que todos los contenedores estén UP
docker-compose ps

# 3. Iniciar servidor Ionic (frontend)
cd ionic-app
ng serve --proxy-config proxy.conf.json
```

### Acceder a la Aplicación

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **Consul UI**: http://localhost:8500/ui/

### Credenciales de Login

- **Usuario**: `admin`
- **Contraseña**: `admin`

## 🐛 Si el Login Sigue Fallando

### Paso 1: Limpiar Caché del Navegador

**Opción A - Recarga Forzada:**
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

**Opción B - Modo Incógnito:**
- Abre el navegador en modo incógnito/privado
- Navega a http://localhost:4200
- Intenta login

**Opción C - Limpiar Caché Manualmente:**
1. F12 → Application (Chrome) / Storage (Firefox)
2. Borrar:
   - Local Storage
   - Session Storage
   - Cookies
   - Cache Storage

### Paso 2: Limpiar Caché de Angular

```bash
cd ionic-app
rm -rf .angular .cache node_modules/.cache
pkill -9 -f "ng serve"
ng serve --proxy-config proxy.conf.json
```

### Paso 3: Verificar Consola del Navegador

1. Presiona F12
2. Ve a la pestaña "Console"
3. Intenta hacer login
4. Busca mensajes que empiecen con:
   - 🔐 (intentos de login)
   - 🌐 (peticiones HTTP)
   - ✅ (éxitos)
   - ❌ (errores)

### Paso 4: Verificar Network Tab

1. F12 → Network
2. Marca "Disable cache"
3. Intenta login
4. Busca la petición `/api/authenticate`
5. Verifica:
   - Status Code (debería ser 200)
   - Response (debería tener `id_token`)

## 📊 Tests Disponibles

### Test de Cypress

```bash
cd store
npm run e2e:headless -- --spec "src/test/javascript/cypress/e2e/test-login-ionic.cy.ts"
```

Este test verifica:
1. Backend responde correctamente
2. Proxy funciona
3. Página de login carga
4. Login a través del formulario funciona
5. No hay errores en consola

### Test Manual HTML

Archivo: `/ionic-app/www/debug-login.html`

Acceso: http://localhost:4200/debug-login.html

Este archivo HTML te permite probar el login sin caché ni redirecciones de Angular.

## 🔐 Arquitectura de Autenticación

```
Browser (localhost:4200)
    ↓
    POST /api/authenticate
    ↓
Angular Dev Server (Proxy)
    ↓
    POST http://localhost:8080/api/authenticate
    ↓
Store Service (Backend)
    ↓
    JWT Token Response
    ↓
Browser Storage (Capacitor Preferences)
```

## 📝 Notas Importantes

1. **Proxy solo funciona en desarrollo**: En producción, debes configurar CORS en el backend para permitir el dominio del frontend.

2. **CORS actual del backend**: Configurado para puertos 8100 y 9000 en `store/src/main/resources/config/application-dev.yml`.

3. **Por qué el proxy**: Evita problemas de CORS al hacer que todas las peticiones pasen por el mismo origen (localhost:4200).

4. **Logging**: Los logs agregados en auth.service.ts y login.page.ts pueden removerse una vez que todo funcione correctamente.

## ✅ Checklist de Verificación

- [ ] Docker Compose UP (7/7 contenedores)
- [ ] Backend responde en :8080
- [ ] ng serve corriendo con proxy
- [ ] Caché del navegador limpio
- [ ] Modo incógnito funciona
- [ ] Tests de Cypress pasan
- [ ] Login exitoso redirige a /products

## 🎯 Próximos Pasos

Una vez que el login funcione:

1. **Probar navegación**: Products → Cart → Checkout
2. **Verificar API calls**: Todas las peticiones deberían pasar por el proxy
3. **Testing E2E completo**: Ejecutar suite completa de Cypress
4. **Documentar para producción**: Planificar configuración de CORS para deploy

---

**Status**: ✅ Todos los tests automáticos pasan. El problema es caché del navegador.
**Solución**: Forzar recarga sin caché (Ctrl+Shift+R) o usar modo incógnito.
