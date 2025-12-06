# 🚀 GUÍA RÁPIDA - COMIENZO DEMO EN 5 MIN

## 1️⃣ Pre-requisitos (2 min)

```bash
# Verificar ambiente
java -version          # ✅ Java 21
docker --version       # ✅ Docker operacional
node --version         # ✅ Node 18+
```

## 2️⃣ Levantar Infraestructura (1 min)

```bash
cd /home/franco/Facultad/Ing\ de\ Soft\ Aplicada
docker-compose up -d
echo "Esperando 30 segundos..."
sleep 30
docker-compose ps     # Verificar 7/7 UP
```

## 3️⃣ Compilar y Testear (3 min - opcional, saltar si hay prisa)

```bash
# En 3 terminales paralelas:
cd store && mvn compile -DskipTests -q
cd ../invoice && mvn compile -DskipTests -q
cd ../notification && mvn compile -DskipTests -q

# Todos: BUILD SUCCESS ✅
```

## 4️⃣ Iniciar Frontend (2 min)

```bash
cd ionic-app
npm install  # Solo primera vez
npm start
# Se abre en http://localhost:4200
```

## 5️⃣ Verificaciones (5 min)

### API Gateway
```bash
curl -s http://localhost:8080/api/products | jq '.content[0]'
```

### Service Registry
```
http://localhost:8500/ui/
```

### Frontend
```
URL: http://localhost:4200
Login: admin / admin
```

### E2E Tests
```bash
cd ionic-app
npm run cypress:run
# Esperado: 17/17 tests PASSING ✅
```

---

## 📚 Documentación de Referencia

| Documento | Propósito | Lectura |
|-----------|----------|---------|
| **CHECKLIST_DEMO.md** | Guía paso a paso | 10 min |
| **FINAL_STATUS.md** | Estado actual | 5 min |
| **README.md** | Arquitectura completa | 15 min |
| **DEMO_STATUS.md** | Estado de servicios | 5 min |

---

## 🔐 Credenciales

```
Frontend:    admin / admin
Backend:     (sin requerimiento, acceso abierto)
```

---

## 📍 URLs Principales

```
Store Gateway:  http://localhost:8080
Invoice Service:http://localhost:8282
Notification:   http://localhost:8283
Consul UI:      http://localhost:8500/ui/
Frontend:       http://localhost:4200
```

---

## ⏱️ Timeline Demo Total: ~37 minutos

```
Setup (5 min)
  └─ Levantar Docker, verificar servicios

Backend Demo (5 min)
  └─ Health checks, API endpoints

Frontend Demo (10 min)
  └─ Login, catálogo, carrito, checkout

Testing Demo (5 min)
  └─ E2E Cypress tests

Q&A & Explicación (7 min)
  └─ Arquitectura, Java 21, componentes
```

---

## 🆘 Si algo falla

```bash
# Reset completo
docker-compose down -v
docker-compose up -d
sleep 30

# Verificar logs
docker-compose logs <service_name>

# Limpiar npm cache
cd ionic-app
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Checklist Antes de Demo

- [ ] Java 21 disponible
- [ ] Docker corriendo
- [ ] Node/npm funcional
- [ ] Internet disponible (para downloads)
- [ ] Terminal preparada
- [ ] Navegador abierto
- [ ] Documentación lista

---

## 🎯 Puntos Clave a Mencionar

1. **Java 21 Upgrade**: Modernización completada desde Java 17
2. **Microservicios**: 3 servicios independientes registrados
3. **Testing**: 46/47 tests pasando (97.8%)
4. **Dockerización**: Stack completo containerizado
5. **Frontend Moderno**: Ionic con Angular 15
6. **Escalabilidad**: Service Registry con Consul

---

**¡A demostrar! 🎉**

Última actualización: 6 Dic 2025  
Status: ✅ Ready
