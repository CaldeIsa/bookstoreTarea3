# Instrucciones Paso a Paso - Bookstore App

Este documento te guiará a través de todos los pasos necesarios para configurar, ejecutar y desplegar la aplicación Bookstore desde cero.

## Paso 1: Crear Cuenta en CloudAMQP

CloudAMQP es un servicio de RabbitMQ en la nube que permite gestionar colas de mensajes sin necesidad de instalar y configurar un servidor propio.

### Acciones:

1. Visita [https://www.cloudamqp.com/](https://www.cloudamqp.com/)
2. Haz clic en **"Sign Up"** (Registrarse)
3. Completa el formulario de registro con tu email y contraseña
4. Verifica tu email si es necesario
5. Inicia sesión en tu cuenta

## Paso 2: Crear una Instancia de CloudAMQP

Una instancia es un servidor de RabbitMQ dedicado donde se almacenarán tus colas de mensajes.

### Acciones:

1. En el panel de CloudAMQP, haz clic en **"Create New Instance"**
2. Completa los siguientes campos:
   - **Name**: `bookstore` (o el nombre que prefieras)
   - **Plan**: Selecciona **"Little Lemur (Free)"** - es gratuito y suficiente para este proyecto
   - **Region**: Selecciona la región más cercana a ti
   - **Tags**: (opcional) puedes dejarlo vacío
3. Haz clic en **"Select Region"** y luego en **"Review"**
4. Revisa la información y haz clic en **"Create Instance"**
5. Espera unos segundos mientras se crea tu instancia

## Paso 3: Crear la Cola "bookstore"

Ahora crearás la cola específica donde se almacenarán los mensajes de tu aplicación.

### Acciones:

1. En el panel de CloudAMQP, haz clic en tu instancia recién creada
2. Haz clic en el botón **"RabbitMQ Manager"** (se abrirá en una nueva pestaña)
3. En el menú superior, haz clic en la pestaña **"Queues"**
4. En la sección **"Add a new queue"**, completa:
   - **Name**: `bookstore`
   - **Type**: Deja **"Classic"** seleccionado
   - **Durability**: Selecciona **"Durable"** (para que la cola persista)
   - **Auto delete**: Deja **"No"**
5. Haz clic en **"Add queue"**
6. Verás tu cola `bookstore` en la lista

## Paso 4: Obtener la URL de Conexión

Esta URL es la que usará tu aplicación para conectarse a CloudAMQP.

### Acciones:

1. Regresa a la pestaña del panel de CloudAMQP (no el RabbitMQ Manager)
2. En la página de detalles de tu instancia, busca la sección **"AMQP Details"**
3. Copia la **URL** completa que aparece (comienza con `amqp://` o `amqps://`)
4. Guárdala en un lugar seguro, la necesitarás en el siguiente paso

**Ejemplo de URL:**
```
amqp://usuario:contraseña@servidor.cloudamqp.com/vhost
```

## Paso 5: Configurar el Backend

Ahora configurarás el código del backend con tu URL de CloudAMQP.

### Acciones:

1. Descomprime el archivo `bookstore-app.zip` que recibiste
2. Abre una terminal o línea de comandos
3. Navega al directorio del backend:
   ```bash
   cd bookstore-app/backend
   ```
4. Instala las dependencias de Node.js:
   ```bash
   npm install
   ```
   (Este proceso puede tardar 1-2 minutos)
5. Crea el archivo de configuración `.env`:
   - En Windows: `copy .env.example .env`
   - En Mac/Linux: `cp .env.example .env`
6. Abre el archivo `.env` con un editor de texto
7. Pega tu URL de CloudAMQP en la línea `CLOUDAMQP_URL`:
   ```env
   CLOUDAMQP_URL=amqp://tu-usuario:tu-password@tu-servidor.cloudamqp.com/tu-vhost
   PORT=3000
   QUEUE_NAME=bookstore
   ```
8. Guarda el archivo `.env`

## Paso 6: Ejecutar la Aplicación Localmente

Necesitarás tener **tres terminales** abiertas simultáneamente para ejecutar todos los componentes.

### Terminal 1 - Servidor API:

1. Navega al directorio del backend:
   ```bash
   cd bookstore-app/backend
   ```
2. Inicia el servidor:
   ```bash
   npm start
   ```
3. Deberías ver el mensaje: `Servidor corriendo en puerto 3000`
4. **Deja esta terminal abierta**

### Terminal 2 - Worker:

1. Abre una **nueva terminal**
2. Navega al directorio del backend:
   ```bash
   cd bookstore-app/backend
   ```
3. Inicia el worker:
   ```bash
   npm run worker
   ```
4. Deberías ver el mensaje: `Worker de Bookstore iniciado`
5. **Deja esta terminal abierta**

### Terminal 3 - Frontend:

Tienes varias opciones para servir el frontend:

**Opción A - Usando Live Server (VS Code):**
1. Abre el proyecto en Visual Studio Code
2. Instala la extensión "Live Server" si no la tienes
3. Haz clic derecho en `frontend/index.html`
4. Selecciona "Open with Live Server"
5. Se abrirá automáticamente en tu navegador

**Opción B - Usando serve (Node.js):**
1. Instala serve globalmente (solo una vez):
   ```bash
   npm install -g serve
   ```
2. Navega al directorio del frontend:
   ```bash
   cd bookstore-app/frontend
   ```
3. Inicia el servidor:
   ```bash
   serve .
   ```
4. Abre tu navegador en la dirección que te indique (ej: `http://localhost:3000`)

**Opción C - Abriendo el archivo directamente:**
1. Navega a `bookstore-app/frontend/`
2. Abre `index.html` directamente en tu navegador
3. (Nota: Puede que tengas problemas de CORS con este método)

## Paso 7: Probar la Aplicación

Una vez que tengas todo ejecutándose:

1. Abre la aplicación en tu navegador
2. Deberías ver la interfaz de Bookstore con autores y editoriales de ejemplo
3. **Prueba agregar un autor:**
   - Haz clic en "+ Agregar Autor"
   - Completa el formulario
   - Haz clic en "Guardar"
   - Verás un mensaje: "Solicitud de creación enviada..."
4. **Actualiza los datos:**
   - Haz clic en el botón "🔄 Actualizar Datos" en la parte superior
   - Deberías ver el nuevo autor en la lista
5. **Observa las terminales:**
   - En la Terminal 2 (worker), verás mensajes indicando que se procesó el mensaje
   - Esto demuestra que la cola está funcionando correctamente

## Paso 8: Desplegar la Aplicación (Opcional)

### Desplegar el Frontend en Vercel:

1. Crea una cuenta en [https://vercel.com/](https://vercel.com/)
2. Instala Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Navega al directorio del frontend:
   ```bash
   cd bookstore-app/frontend
   ```
4. Ejecuta el comando de despliegue:
   ```bash
   vercel
   ```
5. Sigue las instrucciones en pantalla
6. Vercel te dará una URL pública para tu frontend

### Desplegar el Backend:

El backend requiere un servicio que soporte procesos de larga duración. Algunas opciones:

- **Render**: [https://render.com/](https://render.com/) (tiene plan gratuito)
- **Railway**: [https://railway.app/](https://railway.app/)
- **Heroku**: [https://www.heroku.com/](https://www.heroku.com/)

**Pasos generales:**
1. Crea una cuenta en el servicio elegido
2. Conecta tu repositorio de Git (debes subir el código a GitHub primero)
3. Configura las variables de entorno (`CLOUDAMQP_URL`, etc.)
4. Despliega el backend
5. Obtén la URL del backend desplegado
6. Actualiza `frontend/config.js` con la nueva URL:
   ```javascript
   const API_CONFIG = {
       baseURL: 'https://tu-backend.render.com/api'
   };
   ```
7. Vuelve a desplegar el frontend

## Paso 9: Empaquetar el Código para Entrega

Si necesitas entregar el código en un archivo ZIP (sin `node_modules`):

### En Windows:
1. Selecciona las carpetas `backend` y `frontend`, y los archivos `README.md` y `ARQUITECTURA.md`
2. Haz clic derecho y selecciona "Enviar a" > "Carpeta comprimida (en ZIP)"
3. Renombra el archivo a `bookstore-app.zip`

### En Mac/Linux:
```bash
cd bookstore-app
zip -r bookstore-app.zip backend frontend README.md ARQUITECTURA.md INSTRUCCIONES.md -x "*/node_modules/*"
```

## Solución de Problemas

### Error: "Cannot connect to CloudAMQP"
- Verifica que la URL en `.env` sea correcta
- Asegúrate de que tu instancia de CloudAMQP esté activa
- Revisa que no haya espacios extra en la URL

### Error: "Port 3000 already in use"
- Cambia el puerto en `.env` a otro número (ej: 3001)
- O cierra el proceso que está usando el puerto 3000

### El frontend no muestra datos
- Verifica que el servidor API esté corriendo (Terminal 1)
- Abre la consola del navegador (F12) para ver errores
- Verifica que la URL en `config.js` sea correcta

### Los cambios no se reflejan
- Asegúrate de que el worker esté corriendo (Terminal 2)
- Haz clic en "🔄 Actualizar Datos" después de cada operación
- Revisa los logs del worker para ver si hay errores

## Recursos Adicionales

- **Documentación de CloudAMQP**: [https://www.cloudamqp.com/docs/index.html](https://www.cloudamqp.com/docs/index.html)
- **Documentación de RabbitMQ**: [https://www.rabbitmq.com/documentation.html](https://www.rabbitmq.com/documentation.html)
- **Documentación de Express**: [https://expressjs.com/](https://expressjs.com/)

¡Buena suerte con tu proyecto!
