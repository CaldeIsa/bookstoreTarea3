// Estado de la aplicación
let currentEditingAuthor = null;
let currentEditingPublisher = null;

// ============= UTILIDADES =============

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// ============= AUTORES =============

async function loadAuthors() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/authors`);
        
        if (!response.ok) {
            throw new Error('Error al cargar autores');
        }
        
        const authors = await response.json();
        displayAuthors(authors);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('authorsList').innerHTML = 
            '<p class="empty-state">Error al cargar autores. Verifica la conexión con el servidor.</p>';
    }
}

function displayAuthors(authors) {
    const container = document.getElementById('authorsList');
    
    if (authors.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No hay autores registrados</p></div>';
        return;
    }
    
    container.innerHTML = authors.map(author => `
        <div class="item-card">
            <h3>${author.name}</h3>
            <p><strong>País:</strong> ${author.country}</p>
            <p><strong>Año de Nacimiento:</strong> ${author.birthYear}</p>
            <div class="actions">
                <button class="btn btn-warning" onclick="editAuthor('${author.id}')">Editar</button>
                <button class="btn btn-danger" onclick="deleteAuthor('${author.id}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function showAuthorForm() {
    currentEditingAuthor = null;
    document.getElementById('authorFormTitle').textContent = 'Nuevo Autor';
    document.getElementById('authorForm').reset();
    document.getElementById('authorId').value = '';
    document.getElementById('authorFormContainer').style.display = 'block';
}

function hideAuthorForm() {
    document.getElementById('authorFormContainer').style.display = 'none';
    document.getElementById('authorForm').reset();
    currentEditingAuthor = null;
}

async function editAuthor(id) {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/authors/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar autor');
        }
        
        const author = await response.json();
        currentEditingAuthor = author;
        
        document.getElementById('authorFormTitle').textContent = 'Editar Autor';
        document.getElementById('authorId').value = author.id;
        document.getElementById('authorName').value = author.name;
        document.getElementById('authorCountry').value = author.country;
        document.getElementById('authorBirthYear').value = author.birthYear;
        document.getElementById('authorFormContainer').style.display = 'block';
        
        // Scroll al formulario
        document.getElementById('authorFormContainer').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar los datos del autor', 'error');
    }
}

async function deleteAuthor(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este autor?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/authors/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar autor');
        }
        
        showNotification('Solicitud de eliminación enviada. Presiona "Actualizar Datos" para ver los cambios.', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar autor', 'error');
    }
}

// ============= EDITORIALES =============

async function loadPublishers() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/publishers`);
        
        if (!response.ok) {
            throw new Error('Error al cargar editoriales');
        }
        
        const publishers = await response.json();
        displayPublishers(publishers);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('publishersList').innerHTML = 
            '<p class="empty-state">Error al cargar editoriales. Verifica la conexión con el servidor.</p>';
    }
}

function displayPublishers(publishers) {
    const container = document.getElementById('publishersList');
    
    if (publishers.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No hay editoriales registradas</p></div>';
        return;
    }
    
    container.innerHTML = publishers.map(publisher => `
        <div class="item-card">
            <h3>${publisher.name}</h3>
            <p><strong>País:</strong> ${publisher.country}</p>
            <p><strong>Año de Fundación:</strong> ${publisher.foundedYear}</p>
            <div class="actions">
                <button class="btn btn-warning" onclick="editPublisher('${publisher.id}')">Editar</button>
                <button class="btn btn-danger" onclick="deletePublisher('${publisher.id}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function showPublisherForm() {
    currentEditingPublisher = null;
    document.getElementById('publisherFormTitle').textContent = 'Nueva Editorial';
    document.getElementById('publisherForm').reset();
    document.getElementById('publisherId').value = '';
    document.getElementById('publisherFormContainer').style.display = 'block';
}

function hidePublisherForm() {
    document.getElementById('publisherFormContainer').style.display = 'none';
    document.getElementById('publisherForm').reset();
    currentEditingPublisher = null;
}

async function editPublisher(id) {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/publishers/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar editorial');
        }
        
        const publisher = await response.json();
        currentEditingPublisher = publisher;
        
        document.getElementById('publisherFormTitle').textContent = 'Editar Editorial';
        document.getElementById('publisherId').value = publisher.id;
        document.getElementById('publisherName').value = publisher.name;
        document.getElementById('publisherCountry').value = publisher.country;
        document.getElementById('publisherFoundedYear').value = publisher.foundedYear;
        document.getElementById('publisherFormContainer').style.display = 'block';
        
        // Scroll al formulario
        document.getElementById('publisherFormContainer').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar los datos de la editorial', 'error');
    }
}

async function deletePublisher(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta editorial?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/publishers/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar editorial');
        }
        
        showNotification('Solicitud de eliminación enviada. Presiona "Actualizar Datos" para ver los cambios.', 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar editorial', 'error');
    }
}

// ============= EVENTOS DE FORMULARIOS =============

document.getElementById('authorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('authorId').value;
    const data = {
        name: document.getElementById('authorName').value,
        country: document.getElementById('authorCountry').value,
        birthYear: parseInt(document.getElementById('authorBirthYear').value)
    };
    
    try {
        let response;
        
        if (id) {
            // Actualizar
            response = await fetch(`${API_CONFIG.baseURL}/authors/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } else {
            // Crear
            response = await fetch(`${API_CONFIG.baseURL}/authors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }
        
        if (!response.ok) {
            throw new Error('Error al guardar autor');
        }
        
        showNotification(
            `Solicitud de ${id ? 'actualización' : 'creación'} enviada. Presiona "Actualizar Datos" para ver los cambios.`,
            'success'
        );
        hideAuthorForm();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al guardar autor', 'error');
    }
});

document.getElementById('publisherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('publisherId').value;
    const data = {
        name: document.getElementById('publisherName').value,
        country: document.getElementById('publisherCountry').value,
        foundedYear: parseInt(document.getElementById('publisherFoundedYear').value)
    };
    
    try {
        let response;
        
        if (id) {
            // Actualizar
            response = await fetch(`${API_CONFIG.baseURL}/publishers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } else {
            // Crear
            response = await fetch(`${API_CONFIG.baseURL}/publishers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }
        
        if (!response.ok) {
            throw new Error('Error al guardar editorial');
        }
        
        showNotification(
            `Solicitud de ${id ? 'actualización' : 'creación'} enviada. Presiona "Actualizar Datos" para ver los cambios.`,
            'success'
        );
        hidePublisherForm();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al guardar editorial', 'error');
    }
});

// ============= BOTÓN DE ACTUALIZACIÓN =============

document.getElementById('refreshBtn').addEventListener('click', () => {
    showNotification('Actualizando datos...', 'info');
    loadAuthors();
    loadPublishers();
});

// ============= INICIALIZACIÓN =============

document.addEventListener('DOMContentLoaded', () => {
    loadAuthors();
    loadPublishers();
});
