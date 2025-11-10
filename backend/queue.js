const amqp = require('amqplib');
const config = require('./config');

let connection = null;
let channel = null;

/**
 * Conecta a CloudAMQP y crea el canal
 */
async function connect() {
  try {
    if (connection && channel) {
      return { connection, channel };
    }

    console.log('Conectando a CloudAMQP...');
    connection = await amqp.connect(config.cloudamqpUrl);
    channel = await connection.createChannel();
    
    // Asegurar que la cola existe
    await channel.assertQueue(config.queueName, {
      durable: true
    });

    console.log('Conectado a CloudAMQP exitosamente');
    
    return { connection, channel };
  } catch (error) {
    console.error('Error al conectar a CloudAMQP:', error.message);
    throw error;
  }
}

/**
 * Publica un mensaje en la cola
 */
async function publishMessage(message) {
  try {
    const { channel } = await connect();
    
    const messageBuffer = Buffer.from(JSON.stringify(message));
    
    channel.sendToQueue(config.queueName, messageBuffer, {
      persistent: true
    });
    
    console.log('Mensaje publicado:', message);
    return true;
  } catch (error) {
    console.error('Error al publicar mensaje:', error.message);
    throw error;
  }
}

/**
 * Consume mensajes de la cola
 */
async function consumeMessages(callback) {
  try {
    const { channel } = await connect();
    
    console.log(`Esperando mensajes en la cola: ${config.queueName}`);
    
    channel.consume(config.queueName, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log('Mensaje recibido:', content);
        
        callback(content);
        
        // Confirmar que el mensaje fue procesado
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error al consumir mensajes:', error.message);
    throw error;
  }
}

/**
 * Cierra la conexión
 */
async function close() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('Conexión a CloudAMQP cerrada');
  } catch (error) {
    console.error('Error al cerrar conexión:', error.message);
  }
}

module.exports = {
  connect,
  publishMessage,
  consumeMessages,
  close
};
