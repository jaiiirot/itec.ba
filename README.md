# Documentacion del Proyecto ITEC.BA

Este repositorio contiene el codigo fuente de la plataforma ITEC.BA, dividida en dos aplicaciones principales: un frontend interactivo y un backend para la gestion de datos y logica de negocio. Este documento esta disenado para proporcionar a los desarrolladores que se integren al proyecto toda la informacion necesaria para entender la arquitectura, configurar el entorno local y comenzar a contribuir.

## Arquitectura y Estructura del Proyecto

El proyecto esta dividido en dos directorios principales: `itecba-frontend` y `itecba-backend`. Cada uno posee una arquitectura estructurada para favorecer la escalabilidad y el mantenimiento.

### Backend (`itecba-backend`)

El backend esta construido con Node.js y utiliza un enfoque de arquitectura basada en modulos (Feature-based).

**Estructura de directorios:**
* `src/config/`: Archivos de configuracion global, como la conexion a bases de datos (MongoDB, Firebase).
* `src/middlewares/`: Middlewares globales de la aplicacion (ej. manejo de errores, autenticacion).
* `src/modules/`: Contiene la logica de negocio dividida por dominios (ej. ads, ais, courses, groups, links, resources). Cada modulo encapsula sus propios controladores (`*.controller.js`), modelos de datos (`*.model.js`), rutas (`*.routes.js`) y servicios (`*.service.js`).
* `src/index.js`: Punto de entrada principal de la aplicacion Express.

**Librerias principales y su uso:**
* **Express (v5):** Framework principal utilizado para montar el servidor HTTP y enrutar las peticiones.
* **Mongoose:** Object Data Modeling (ODM) para MongoDB, utilizado para definir esquemas y realizar consultas a la base de datos de manera estructurada.
* **Firebase-Admin:** SDK administrativo de Firebase, empleado principalmente para validacion de tokens de autenticacion y gestion segura de usuarios desde el lado del servidor.
* **@google/generative-ai:** SDK oficial de Google utilizado para integrar las capacidades de inteligencia artificial de Gemini, posibilitando funciones como chatbots o asistentes virtuales.
* **Ytpl:** Herramienta utilizada para extraer metadatos e informacion de listas de reproduccion de YouTube, probablemente empleada en el modulo de cursos (`courses`).
* **Cors, Helmet, Morgan, Express-rate-limit:** Conjunto de librerias de infraestructura para manejo de politicas CORS, seguridad de cabeceras HTTP, registro de peticiones (logs) y prevencion de ataques de fuerza bruta o abuso de la API.

### Frontend (`itecba-frontend`)

El frontend es una Single Page Application (SPA) desarrollada con React y TypeScript, empaquetada con Vite. Utiliza una arquitectura hibrida que combina el Patron de Diseno Atomico (Atomic Design) para componentes globales, con una Arquitectura Orientada a Funcionalidades (Feature-Driven Architecture) para encapsular la logica especifica del dominio.

**Estructura de directorios:**
* `src/components/`: Contiene componentes de interfaz grafica reutilizables y agnosticos al contexto, organizados bajo la metodologia Atomic Design (`atoms`, `molecules`, `organisms`, `templates`).
* `src/features/`: El nucleo de la aplicacion. Cada funcionalidad principal (ej. `about`, `admission`, `courses`, `faqs`, `home`, `progress`) tiene su propia carpeta que encapsula sus propios componentes especificos, hooks, servicios y tipos. Esto aisla el alcance y facilita las refactorizaciones.
* `src/pages/`: Componentes de alto nivel que componen las vistas principales mediante el uso de "features" y "components". Estan directamente mapeados a las rutas de la aplicacion.
* `src/context/`: Contextos globales de React (ej. `AuthContext.tsx`).
* `src/lib/`: Instancias y configuraciones de clientes externos, como Firebase y Supabase.

**Librerias principales y su uso:**
* **React 19 & TypeScript:** Base del desarrollo web con un tipado estatico estricto para reducir errores en tiempo de ejecucion.
* **Vite:** Herramienta de compilacion que ofrece un entorno de desarrollo ultra rapido y optimizacion de assets para produccion.
* **Tailwind CSS (v4):** Framework de utilidades CSS utilizado para el diseno responsivo y la estilizacion rapida de los componentes.
* **React Router DOM (v7):** Enrutador utilizado para la navegacion y definicion de vistas dentro de la SPA.
* **@tanstack/react-query:** Herramienta fundamental para el fetching, cacheo y sincronizacion del estado del servidor. Se utiliza para consumir la API de backend de manera eficiente.
* **Firebase & Supabase:** Ambos SDKs estan presentes. Firebase suele emplearse para autenticacion rapida y base de datos en tiempo real (o almacenamiento local), mientras que Supabase ofrece funcionalidades robustas similares a una base de datos relacional de Postgres.
* **@xyflow/react:** Libreria avanzada para la construccion de interfaces basadas en nodos y grafos interactivos, utilizada comunmente para renderizar diagramas de correlatividades o flujos de progreso academico.
* **@google/generative-ai & React Markdown:** Utilizados en conjunto en el frontend para procesar consultas de inteligencia artificial y renderizar respuestas formateadas (ej. para el widget del chatbot).

## Guias de Integracion para Nuevos Desarrolladores

### Requisitos Previos

Para ejecutar este proyecto, tu entorno de desarrollo debe contar con lo siguiente:
* Node.js (version 20.x o superior recomendada).
* Gestor de paquetes NPM.
* Instancia local o remota de MongoDB.
* Credenciales y variables de entorno para Firebase, Supabase y Google Generative AI.

### Configuracion del Entorno de Desarrollo Local

1.  **Clonar el repositorio.**
2.  **Configurar el Backend:**
    * Navegar al directorio: `cd itecba-backend`
    * Instalar dependencias: `npm install`
    * Duplicar el archivo de entorno de ejemplo (si aplica) a `.env` y configurar las credenciales (puerto, URI de MongoDB, keys de Firebase, etc.).
    * Iniciar el servidor en modo desarrollo: `npm run dev` (utiliza Nodemon para recarga automatica). El backend normalmente escuchara en el puerto configurado en el archivo `.env`.

3.  **Configurar el Frontend:**
    * En una nueva terminal, navegar al directorio: `cd itecba-frontend`
    * Instalar dependencias: `npm install`
    * Configurar el archivo `.env` en la raiz del frontend con las URLs base de la API, claves publicas de Firebase/Supabase, etc.
    * Iniciar el servidor de Vite: `npm run dev`

### Flujo de Trabajo en GitHub

Para mantener un codigo limpio y estable, se sugiere a todos los colaboradores seguir este flujo de trabajo tecnico:

* **Ramas (Branches):** El proyecto utiliza una rama `main` o `master` protegida. Ningun desarrollador debe hacer *push* directo a esta rama. Se debe utilizar un modelo tipo Feature Branch:
    * Nuevas funcionalidades: `feature/nombre-de-la-funcionalidad`
    * Correccion de errores: `fix/descripcion-del-bug`
    * Refactorizaciones: `refactor/descripcion-de-mejora`
* **Pull Requests (PRs):** Todo codigo nuevo debe integrarse mediante un PR. Los PRs deben tener un titulo descriptivo y explicar que problema resuelve o que nueva caracteristica anade. Es necesario que el codigo este alineado con las reglas de linting del proyecto (`npm run lint` en el frontend).
* **Linting y Formateo:** El frontend cuenta con ESLint configurado de manera estricta (`@eslint/js`, `typescript-eslint`, etc.). Asegurese de revisar y corregir cualquier advertencia antes de enviar un commit para no fallar en el pipeline de integracion.
* **Dependencias de Modulos:** Al desarrollar una nueva vista en el frontend, priorice la arquitectura "Feature-Driven". Si un componente solo pertenece a "Cursos", creelo dentro de `src/features/courses/components/` en lugar de abarrotar la carpeta global `src/components/`. Reserve los atomos y moleculas globales unicamente para elementos visuales genericos (botones, inputs reutilizables, etc.).