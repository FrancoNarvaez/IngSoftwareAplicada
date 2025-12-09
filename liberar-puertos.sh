#!/bin/bash

# Script para liberar puertos utilizados por el Frontend y Backend
# Uso: ./liberar-puertos.sh

echo "🔍 Verificando puertos..."

# Función para liberar un puerto
liberar_puerto() {
    PORT=$1
    SERVICE=$2
    
    # Buscar PID del proceso que usa el puerto
    PID=$(lsof -ti :$PORT)
    
    if [ -n "$PID" ]; then
        echo "⚠️  Puerto $PORT ($SERVICE) ocupado por PID $PID. Matando proceso..."
        kill -9 $PID
        echo "✅ Puerto $PORT liberado."
    else
        echo "✅ Puerto $PORT ($SERVICE) está libre."
    fi
}

# Liberar puerto del Backend (Spring Boot)
liberar_puerto 8080 "Backend/Spring Boot"

# Liberar puerto del Frontend (Ionic/Angular)
liberar_puerto 4200 "Frontend/Ionic"

# Liberar puertos del Stack ELK
liberar_puerto 9200 "Elasticsearch"
liberar_puerto 5601 "Kibana"
liberar_puerto 5044 "Logstash"

# Liberar puertos de Bases de Datos
liberar_puerto 3306 "MySQL"
liberar_puerto 27017 "MongoDB"

echo "🚀 Listo para arrancar."
