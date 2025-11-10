'''
# Bookstore App - Gestión con Colas de Mensajes

Este proyecto es una aplicación web completa (backend y frontend) que demuestra cómo gestionar datos de forma diferida utilizando una cola de mensajes con **CloudAMQP** (RabbitMQ as a Service). La aplicación permite administrar un catálogo de autores y editoriales.

## Características

- **Backend**: Creado con Node.js y Express. Publica mensajes en una cola para operaciones de creación, actualización y eliminación (CRUD).
- **Frontend**: Aplicación de una sola página (SPA) creada con HTML, CSS y JavaScript vainilla. Permite a los usuarios interactuar con la API.
- **Gestión Diferida**: Las operaciones de escritura no se ejecutan instantáneamente. Se encolan y son procesadas por un *worker* independiente. Esto desacopla la interfaz de usuario de la lógica de negocio.
- **Actualización Manual**: El frontend incluye un botón para que el usuario pueda solicitar y visualizar los datos más recientes, reflejando los cambios procesados por el worker.

## Requisitos Previos

1.  **Node.js**: Asegúrate de tener Node.js instalado (versión 16 o superior).
2.  **Cuenta de CloudAMQP**: Necesitarás una cuenta gratuita en [CloudAMQP](https://www.cloudamqp.com/).

## Configuración

### 1. Configurar CloudAMQP

1.  **Crea una Instancia**: Después de registrarte en CloudAMQP, crea una nueva instancia. El plan gratuito "Little Lemur" es suficiente.
2.  **Crea una Cola**: Ve a la sección "RabbitMQ Manager" de tu instancia. En la pestaña "Queues", crea una nueva cola llamada `bookstore`.
3.  **Obtén la URL de Conexión**: En la página de detalles de tu instancia, copia la **URL de AMQP**. La necesitarás para configurar el backend.

### 2. Configurar el Backend

1.  **Navega al directorio del backend**:
    ```bash
    cd backend
    ```

2.  **Instala las dependencias**:
    ```bash
    npm install
    ```

3.  **Crea el archivo de entorno**:
    Copia el archivo `.env.example` a un nuevo archivo llamado `.env`.
    ```bash
    cp .env.example .env
    ```

4.  **Configura las variables de entorno**:
    Abre el archivo `.env` y pega tu URL de CloudAMQP:
    ```env
    CLOUDAMQP_URL=amqp://tu-usuario:tu-password@tu-servidor.cloudamqp.com/tu-vhost
    PORT=3000
    QUEUE_NAME=bookstore
    ```

### 3. Configurar el Frontend

El frontend no requiere un paso de construcción. Simplemente necesitas que un servidor web sirva los archivos estáticos. Para el desarrollo local, puedes usar una extensión como "Live Server" en VS Code.

Si vas a desplegar el backend en un servicio como Netlify, recuerda actualizar la URL de la API en `frontend/config.js`:

```javascript
// frontend/config.js
const API_CONFIG = {
    // Cambia esta URL por la de tu backend desplegado
    baseURL: 'https://tu-backend.netlify.app/api'
};
```

## Cómo Ejecutar la Aplicación Localmente

Necesitarás tener **tres terminales** abiertas simultáneamente.

1.  **Terminal 1: Iniciar el Servidor API**
    ```bash
    # Dentro del directorio /backend
    npm start
    ```
    Esto iniciará el servidor Express en `http://localhost:3000`.

2.  **Terminal 2: Iniciar el Worker**
    ```bash
    # Dentro del directorio /backend
    npm run worker
    ```
    Este script se conectará a CloudAMQP y comenzará a escuchar mensajes en la cola `bookstore` para procesarlos.

3.  **Terminal 3: Servir el Frontend**
    La forma más sencilla es usar una extensión como **Live Server** en Visual Studio Code. Haz clic derecho en el archivo `frontend/index.html` y selecciona "Open with Live Server".

    Si no usas VS Code, puedes usar cualquier servidor estático. Por ejemplo, con Node.js:
    ```bash
    # Instala serve globalmente (solo una vez)
    npm install -g serve

    # Navega al directorio del frontend y sírvelo
    cd frontend
    serve .
    ```
    Luego, abre tu navegador en la dirección que te indique (normalmente `http://localhost:3000` o similar).

## Despliegue

### Backend en Netlify

1.  **Prepara tu proyecto**: Netlify puede desplegar funciones serverless desde un repositorio de Git. Asegúrate de que tu backend esté en un repositorio (por ejemplo, en GitHub).
2.  **Configura Netlify**: Conecta tu repositorio a Netlify. Configura el "Build command" a `npm install` y el "Publish directory" a una carpeta vacía si no tienes un sitio estático junto al backend.
3.  **Crea una Función Serverless**: Adapta `server.js` para que funcione como una función de Netlify. Esto generalmente implica exportar un `handler` en lugar de iniciar un servidor con `app.listen()`.
4.  **Variables de Entorno**: Agrega tu `CLOUDAMQP_URL` en la configuración de "Environment variables" de tu sitio en Netlify.
5.  **Worker**: El worker no puede ejecutarse directamente en Netlify. Deberás ejecutarlo en un servicio que soporte procesos de larga duración (como Heroku, Render o un VPS).

### Frontend en Vercel / GitHub Pages

1.  **Conecta tu repositorio**: Tanto Vercel como GitHub Pages se integran fácilmente con repositorios de Git.
2.  **Configura el proyecto**: Indica que es un proyecto de "Static HTML" o "No framework".
3.  **Despliega**: El servicio construirá y desplegará tu sitio estático.
4.  **Actualiza la URL de la API**: No olvides configurar la URL de tu backend desplegado en `frontend/config.js` y volver a desplegar el frontend.

## Empaquetado del Código

Para entregar el código, crea un archivo ZIP que contenga las carpetas `backend` y `frontend`, junto con este `README.md`. **No incluyas la carpeta `node_modules`**.

```bash
# Desde el directorio raíz (bookstore-app)
zip -r bookstore-app.zip backend frontend README.md ARQUITECTURA.md
```
'''
