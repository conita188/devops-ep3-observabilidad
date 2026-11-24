# Evaluación Parcial 3 – Observabilidad y entornos reales en DevOps

## ¿De qué trata este proyecto?

En esta evaluación continué trabajando con el microservicio de las actividades anteriores. En esta oportunidad me enfoqué en incorporar herramientas que me permitieran observar cómo está funcionando la aplicación, revisar sus métricas y automatizar diferentes tareas.

Para esto trabajé con Docker, Prometheus, Grafana y Kubernetes. También utilicé GitHub Actions para automatizar las pruebas, revisar la seguridad de las dependencias y comprobar el proceso de despliegue.

La idea fue llevar el proyecto un poco más allá de su funcionamiento básico y aprender cómo se pueden aplicar estas herramientas dentro de un flujo de trabajo DevOps.

## Herramientas que utilicé

Estas son las principales tecnologías que utilicé durante el desarrollo:

- **Node.js y Express:** para desarrollar y ejecutar el microservicio.
- **Jest y Supertest:** para realizar las pruebas automatizadas.
- **prom-client:** para generar las métricas que utiliza Prometheus.
- **Docker:** para crear y ejecutar los contenedores.
- **Docker Compose:** para levantar los servicios de manera conjunta.
- **Prometheus:** para recopilar las métricas del microservicio.
- **Grafana:** para visualizar las métricas mediante un dashboard.
- **Kubernetes:** para probar la orquestación del microservicio.
- **GitHub Actions:** para automatizar las pruebas, los controles de calidad y el despliegue.

## Organización del proyecto

El repositorio está organizado de la siguiente manera:

```text
devops-ep3-observabilidad/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docs/
├── kubernetes/
│   ├── deployment.yaml
│   └── service.yaml
├── monitoring/
│   └── prometheus.yml
├── src/
├── tests/
├── .gitignore
├── Dockerfile
├── compose.yaml
├── package.json
└── package-lock.json
```

## Cómo ejecutar el proyecto

Para trabajar con el proyecto localmente es necesario tener instalado Node.js, npm y Docker Desktop.

Primero, se deben instalar las dependencias:

```bash
npm ci
```

Para iniciar el microservicio:

```bash
npm start
```

Para ejecutar las pruebas:

```bash
npm test
```

También se puede generar un informe de cobertura con:

```bash
npm run test:coverage
```

Y revisar las vulnerabilidades de las dependencias mediante:

```bash
npm audit
```

## Microservicio y sus endpoints

El microservicio cuenta con diferentes rutas que permiten comprobar su funcionamiento y realizar operaciones con productos.

| Método | Ruta | ¿Para qué sirve? |
|---|---|---|
| GET | `/` | Comprueba la respuesta principal de la aplicación. |
| GET | `/health` | Permite revisar si el servicio está funcionando. |
| GET | `/products` | Obtiene los productos registrados. |
| POST | `/products` | Permite crear un producto. |
| GET | `/metrics` | Entrega las métricas para Prometheus. |

## Docker y monitoreo

Para levantar los servicios utilicé Docker Compose. Con el siguiente comando se construyen las imágenes y se inician los contenedores:

```bash
docker compose up -d --build --wait
```

Para revisar que estén funcionando:

```bash
docker compose ps
```

Las direcciones locales de acceso son:

| Servicio | Dirección |
|---|---|
| Microservicio | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

Prometheus se encarga de consultar las métricas que entrega el microservicio a través de `/metrics`, mientras que Grafana permite visualizar esa información de una forma más sencilla mediante gráficos y paneles.

En el dashboard incorporé indicadores como:

- Cantidad de solicitudes HTTP por ruta.
- Errores HTTP.
- Memoria utilizada.
- Uso de CPU.
- Disponibilidad del microservicio.
- Latencia de las solicitudes.
- Solicitudes HTTP por segundo.
- Tiempo de despliegue y cobertura de pruebas.

Es importante mencionar que los indicadores de tiempo de despliegue y cobertura se agregaron manualmente a partir de resultados obtenidos en las ejecuciones. Por lo tanto, no se actualizan automáticamente desde Prometheus.

## Despliegue con Kubernetes

También incorporé archivos de configuración para desplegar el microservicio utilizando Kubernetes.

Para aplicar los manifiestos:

```bash
kubectl apply -f kubernetes/
```

Para revisar el estado del despliegue:

```bash
kubectl get deployments
kubectl get pods
kubectl get services
```

La configuración utiliza dos réplicas del microservicio e incluye comprobaciones de disponibilidad y funcionamiento mediante `readinessProbe` y `livenessProbe`.

Además, se establecieron límites y solicitudes de CPU y memoria para los contenedores.

El despliegue se probó utilizando Kubernetes de Docker Desktop, por lo que corresponde a un entorno local y no a un clúster alojado en la nube.

El servicio quedó disponible mediante el puerto `30080`, y se puede comprobar su funcionamiento en:

```text
http://localhost:30080/health
```

## Automatización con GitHub Actions

Para automatizar parte del proceso creé dos workflows dentro de `.github/workflows`.

### 1. CI - Calidad y seguridad

Este workflow se encarga de revisar los cambios antes de que puedan integrarse a la rama principal.

Entre sus tareas se encuentran:

- Descargar el repositorio.
- Configurar Node.js.
- Instalar las dependencias.
- Ejecutar las pruebas automatizadas.
- Generar el reporte de cobertura.
- Revisar las dependencias mediante `npm audit`.
- Guardar el reporte de cobertura como artefacto.

Se ejecuta cuando se realizan cambios en `main`, cuando se abre un Pull Request hacia esa rama o cuando se ejecuta manualmente.

### 2. Deploy and Measure

Este workflow permite ejecutar el despliegue mediante Docker Compose dentro de un runner de GitHub Actions.

También mide cuánto demora el proceso y guarda el resultado como un artefacto para poder revisarlo posteriormente.

En una de las ejecuciones realizadas se obtuvo un tiempo de despliegue de **15 segundos**.

Este proceso se ejecuta en un entorno temporal de GitHub Actions, por lo que no representa un despliegue permanente en producción.

## Resultados obtenidos

Después de realizar las pruebas y verificaciones, estos fueron los últimos resultados comprobados:

| Indicador | Resultado |
|---|---:|
| Pruebas aprobadas | 6 de 6 |
| Cobertura de sentencias | 97,61 % |
| Cobertura de ramas | 86,66 % |
| Cobertura de funciones | 100 % |
| Cobertura de líneas | 97,61 % |
| Vulnerabilidades detectadas por npm audit | 0 |
| Réplicas disponibles en Kubernetes | 2 de 2 |
| Tiempo de despliegue medido | 15 segundos |

## Protección de la rama principal y prueba de fallos

Para evitar que se integren cambios sin pasar por los controles establecidos, configuré un ruleset de GitHub para proteger la rama `main`.

Entre las reglas configuradas se encuentra la obligación de utilizar Pull Requests, aprobar los controles requeridos y resolver las conversaciones antes de fusionar cambios.

También realicé una prueba controlada para comprobar que el pipeline pudiera detectar un error. Para esto provoqué intencionalmente un fallo en una de las pruebas automatizadas.

El resultado fue que GitHub Actions detectó el error y el Pull Request quedó bloqueado por el control de calidad requerido. De esta manera pude comprobar que los cambios que no cumplen las verificaciones no pueden integrarse normalmente a la rama principal.

## Uso de inteligencia artificial

Durante el desarrollo de esta evaluación utilicé ChatGPT como apoyo para comprender algunos conceptos, revisar errores, orientarme con comandos y organizar la documentación.

Las pruebas y verificaciones se realizaron sobre el proyecto implementado. Las decisiones técnicas y las reflexiones personales de la evaluación corresponden a mi propio trabajo y debeson explicadas desde mi experiencia.
