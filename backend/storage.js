/**
 * Almacenamiento en memoria para autores y editoriales
 * En producción, esto debería ser una base de datos
 */

const authors = new Map();
const publishers = new Map();

// Datos de ejemplo iniciales
const sampleAuthors = [
  { id: '1', name: 'Gabriel García Márquez', country: 'Colombia', birthYear: 1927 },
  { id: '2', name: 'Isabel Allende', country: 'Chile', birthYear: 1942 },
  { id: '3', name: 'Jorge Luis Borges', country: 'Argentina', birthYear: 1899 }
];

const samplePublishers = [
  { id: '1', name: 'Editorial Sudamericana', country: 'Argentina', foundedYear: 1939 },
  { id: '2', name: 'Planeta', country: 'España', foundedYear: 1949 },
  { id: '3', name: 'Alfaguara', country: 'España', foundedYear: 1964 }
];

// Inicializar con datos de ejemplo
sampleAuthors.forEach(author => authors.set(author.id, author));
samplePublishers.forEach(publisher => publishers.set(publisher.id, publisher));

// Funciones para Autores
function getAllAuthors() {
  return Array.from(authors.values());
}

function getAuthorById(id) {
  return authors.get(id);
}

function createAuthor(author) {
  authors.set(author.id, author);
  return author;
}

function updateAuthor(id, authorData) {
  if (!authors.has(id)) {
    return null;
  }
  const updatedAuthor = { ...authors.get(id), ...authorData, id };
  authors.set(id, updatedAuthor);
  return updatedAuthor;
}

function deleteAuthor(id) {
  return authors.delete(id);
}

// Funciones para Editoriales
function getAllPublishers() {
  return Array.from(publishers.values());
}

function getPublisherById(id) {
  return publishers.get(id);
}

function createPublisher(publisher) {
  publishers.set(publisher.id, publisher);
  return publisher;
}

function updatePublisher(id, publisherData) {
  if (!publishers.has(id)) {
    return null;
  }
  const updatedPublisher = { ...publishers.get(id), ...publisherData, id };
  publishers.set(id, updatedPublisher);
  return updatedPublisher;
}

function deletePublisher(id) {
  return publishers.delete(id);
}

module.exports = {
  // Autores
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  
  // Editoriales
  getAllPublishers,
  getPublisherById,
  createPublisher,
  updatePublisher,
  deletePublisher
};
