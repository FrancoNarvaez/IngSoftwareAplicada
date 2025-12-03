# Entorno Virtual del Proyecto

Este proyecto utiliza un entorno virtual de Python para aislar scripts de automatización y tooling auxiliar.

## Creación
El entorno ya fue creado en la ruta `.venv/` ejecutando:

```
python3 -m venv .venv
```

*(Se instaló el paquete del sistema `python3.12-venv` para habilitar ensurepip antes de crear el entorno.)*

## Activación
En Linux/macOS:

```
source .venv/bin/activate
```

En Windows (PowerShell):

```
.venv\Scripts\Activate.ps1
```

## Uso previsto
- Instalar utilidades auxiliares (por ejemplo, CLI para automatizaciones, scripts de soporte para CI/CD).
- Mantener requerimientos Python separados del stack principal (Java/Node). Añadiremos un `requirements.txt` si incorporamos librerías adicionales.

## Desactivación
```
deactivate
```
