# Historial de Cambios

Registro cronológico de artefactos creados y razones asociadas.

| Fecha | Módulo/Artefacto | Descripción | Motivo |
|-------|------------------|-------------|--------|
| 2025-11-30 | `trabajo_final.txt` | Conversión del PDF "Trabajo Final - Ing de Software Aplicada" a texto. | Facilitar lectura y extracción de requisitos. |
| 2025-11-30 | `.venv/` + `ENV_SETUP.md` | Creación del entorno virtual Python y documentación del procedimiento. | Aislar scripts auxiliares para automatizaciones futuras. |
| 2025-11-30 | `PLAN_PROYECTO.md` | Plan maestro con fases (JHipster, pruebas, Docker/ELK, Ionic, Jenkins). | Trazabilidad de alcance y próximos pasos. |
| 2025-11-30 | `jdl/microservice-ecommerce-store-k8s.jdl` | Descarga del JDL oficial y ajustes (`useSass` eliminado, relación `User` marcada como `builtInEntity`). | Garantizar compatibilidad con JHipster 8.11.0. |
| 2025-11-30 | `store/`, `invoice/`, `notification/` | Generación de gateway React y microservicios (MySQL + MongoDB) mediante `jhipster import-jdl`. | Cumplir requerimiento de usar JHipster con el modelo provisto. |
| 2025-11-30 | `.yo-rc.json` | Configuración raíz producida por JHipster para trazabilidad de opciones de generación. | Mantener metadata necesaria para regeneraciones/blueprints. |
| 2025-11-30 | `docs/HISTORIAL_CAMBIOS.md`, `docs/GETTING_STARTED.md` | Documentos solicitados para versionado manual y guía de arranque. | Dar visibilidad del progreso y pasos de ejecución. |

> Este cuadro se actualizará cada vez que se agreguen nuevas capacidades (pruebas, contenedores, Ionic, Jenkins, etc.).
