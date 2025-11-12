// backend/index.js
require('dotenv').config();
require('./server'); // levanta la API (escucha en process.env.PORT)
require('./worker'); // se conecta a RabbitMQ y consume la cola
