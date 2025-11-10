# Arquitectura del Proyecto Bookstore

## Descripción General
Aplicación de librería con gestión diferida de autores y editoriales mediante colas de mensajes CloudAMQP.

## Componentes

### Backend (Node.js + Express)
- **Tecnologías**: Express, amqplib, cors
- **Funcionalidades**:
  - API REST para autores y editoriales
  - Publicación de mensajes en cola CloudAMQP
  - Worker para consumir mensajes y procesar operaciones
  - Almacenamiento en memoria (puede extenderse a base de datos)

### Frontend (HTML + JavaScript + CSS)
- **Tecnologías**: Vanilla JavaScript, Fetch API
- **Funcionalidades**:
  - Interfaz para gestionar autores (CRUD)
  - Interfaz para gestionar editoriales (CRUD)
  - Botón de actualización de datos
  - Visualización de estado de operaciones

## Flujo de Datos

1. Usuario realiza operación en frontend (agregar/modificar/eliminar)
2. Frontend envía petición HTTP al backend
3. Backend publica mensaje en cola CloudAMQP
4. Worker consume mensaje de la cola
5. Worker procesa operación y actualiza datos
6. Usuario presiona botón de actualización para ver cambios

## Estructura de Mensajes

### Mensaje de Autor
```json
{
  "type": "author",
  "operation": "create|update|delete",
  "data": {
    "id": "uuid",
    "name": "string",
    "country": "string",
    "birthYear": "number"
  }
}
```

### Mensaje de Editorial
```json
{
  "type": "publisher",
  "operation": "create|update|delete",
  "data": {
    "id": "uuid",
    "name": "string",
    "country": "string",
    "foundedYear": "number"
  }
}
```

## Despliegue

- **Backend**: Netlify Functions o servidor Node.js
- **Frontend**: GitHub Pages, Vercel o Netlify
- **Cola**: CloudAMQP (cuenta gratuita)
