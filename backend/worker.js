const queue = require('./queue');
const storage = require('./storage');

/**
 * Procesa los mensajes recibidos de la cola
 */
function processMessage(message) {
  const { type, operation, data } = message;

  try {
    if (type === 'author') {
      processAuthorMessage(operation, data);
    } else if (type === 'publisher') {
      processPublisherMessage(operation, data);
    } else {
      console.error('Tipo de mensaje desconocido:', type);
    }
  } catch (error) {
    console.error('Error al procesar mensaje:', error.message);
  }
}

/**
 * Procesa mensajes relacionados con autores
 */
function processAuthorMessage(operation, data) {
  switch (operation) {
    case 'create':
      const newAuthor = storage.createAuthor(data);
      console.log('✓ Autor creado:', newAuthor);
      break;
      
    case 'update':
      const updatedAuthor = storage.updateAuthor(data.id, data);
      if (updatedAuthor) {
        console.log('✓ Autor actualizado:', updatedAuthor);
      } else {
        console.error('✗ Autor no encontrado para actualizar:', data.id);
      }
      break;
      
    case 'delete':
      const deleted = storage.deleteAuthor(data.id);
      if (deleted) {
        console.log('✓ Autor eliminado:', data.id);
      } else {
        console.error('✗ Autor no encontrado para eliminar:', data.id);
      }
      break;
      
    default:
      console.error('Operación desconocida para autor:', operation);
  }
}

/**
 * Procesa mensajes relacionados con editoriales
 */
function processPublisherMessage(operation, data) {
  switch (operation) {
    case 'create':
      const newPublisher = storage.createPublisher(data);
      console.log('✓ Editorial creada:', newPublisher);
      break;
      
    case 'update':
      const updatedPublisher = storage.updatePublisher(data.id, data);
      if (updatedPublisher) {
        console.log('✓ Editorial actualizada:', updatedPublisher);
      } else {
        console.error('✗ Editorial no encontrada para actualizar:', data.id);
      }
      break;
      
    case 'delete':
      const deleted = storage.deletePublisher(data.id);
      if (deleted) {
        console.log('✓ Editorial eliminada:', data.id);
      } else {
        console.error('✗ Editorial no encontrada para eliminar:', data.id);
      }
      break;
      
    default:
      console.error('Operación desconocida para editorial:', operation);
  }
}

/**
 * Inicia el worker
 */
async function startWorker() {
  console.log('=================================');
  console.log('  Worker de Bookstore iniciado');
  console.log('=================================');
  
  try {
    await queue.consumeMessages(processMessage);
  } catch (error) {
    console.error('Error al iniciar worker:', error.message);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\nCerrando worker...');
  await queue.close();
  process.exit(0);
});

// Iniciar el worker
startWorker();
