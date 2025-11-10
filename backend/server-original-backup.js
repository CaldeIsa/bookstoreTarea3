const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const config = require('./config');
const queue = require('./queue');
const storage = require('./storage');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bookstore API funcionando',
    endpoints: {
      authors: '/api/authors',
      publishers: '/api/publishers'
    }
  });
});

// ============= RUTAS DE AUTORES =============

// Obtener todos los autores
app.get('/api/authors', (req, res) => {
  try {
    const authors = storage.getAllAuthors();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un autor por ID
app.get('/api/authors/:id', (req, res) => {
  try {
    const author = storage.getAuthorById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear autor (envía a cola)
app.post('/api/authors', async (req, res) => {
  try {
    const { name, country, birthYear } = req.body;
    
    if (!name || !country || !birthYear) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const message = {
      type: 'author',
      operation: 'create',
      data: {
        id: uuidv4(),
        name,
        country,
        birthYear: parseInt(birthYear)
      }
    };

    await queue.publishMessage(message);
    
    res.status(202).json({ 
      message: 'Solicitud de creación enviada a la cola',
      data: message.data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar autor (envía a cola)
app.put('/api/authors/:id', async (req, res) => {
  try {
    const { name, country, birthYear } = req.body;
    const { id } = req.params;

    const author = storage.getAuthorById(id);
    if (!author) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    const message = {
      type: 'author',
      operation: 'update',
      data: {
        id,
        name,
        country,
        birthYear: birthYear ? parseInt(birthYear) : undefined
      }
    };

    await queue.publishMessage(message);
    
    res.status(202).json({ 
      message: 'Solicitud de actualización enviada a la cola',
      data: message.data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar autor (envía a cola)
app.delete('/api/authors/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const author = storage.getAuthorById(id);
    if (!author) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    const message = {
      type: 'author',
      operation: 'delete',
      data: { id }
    };

    await queue.publishMessage(message);
    
    res.status(202).json({ 
      message: 'Solicitud de eliminación enviada a la cola',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= RUTAS DE EDITORIALES =============

// Obtener todas las editoriales
app.get('/api/publishers', (req, res) => {
  try {
    const publishers = storage.getAllPublishers();
    res.json(publishers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una editorial por ID
app.get('/api/publishers/:id', (req, res) => {
  try {
    const publisher = storage.getPublisherById(req.params.id);
    if (!publisher) {
      return res.status(404).json({ error: 'Editorial no encontrada' });
    }
    res.json(publisher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear editorial (envía a cola)
app.post('/api/publishers', async (req, res) => {
  try {
    const { name, country, foundedYear } = req.body;
    
    if (!name || !country || !foundedYear) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const message = {
      type: 'publisher',
      operation: 'create',
      data: {
        id: uuidv4(),
        name,
        country,
        foundedYear: parseInt(foundedYear)
      }
    };

    await queue.publishMessage(message);
    
    res.status(202).json({ 
      message: 'Solicitud de creación enviada a la cola',
      data: message.data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar editorial (envía a cola)
app.put('/api/publishers/:id', async (req, res) => {
  try {
    const { name, country, foundedYear } = req.body;
    const { id } = req.params;

    const publisher = storage.getPublisherById(id);
    if (!publisher) {
      return res.status(404).json({ error: 'Editorial no encontrada' });
    }

    const message = {
      type: 'publisher',
      operation: 'update',
      data: {
        id,
        name,
        country,
        foundedYear: foundedYear ? parseInt(foundedYear) : undefined
      }
    };

    await queue.publishMessage(message);
    
    res.status(202).json({ 
      message: 'Solicitud de actualización enviada a la cola',
      data: message.data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar editorial (envía a cola)
app.delete('/api/publishers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const publisher = storage.getPublisherById(id);
    if (!publisher) {
      return res.status(404).json({ error: 'Editorial no encontrada' });
    }

    const message = {
      type: 'publisher',
      operation: 'delete',
      data: { id }
    };

    await queue.publishMessage(message);
    
    res.status(202).json({ 
      message: 'Solicitud de eliminación enviada a la cola',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`Servidor corriendo en puerto ${config.port}`);
  console.log(`API disponible en http://localhost:${config.port}`);
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\nCerrando servidor...');
  await queue.close();
  process.exit(0);
});
