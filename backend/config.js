require('dotenv').config();

module.exports = {
  cloudamqpUrl: process.env.CLOUDAMQP_URL || 'amqp://localhost',
  port: process.env.PORT || 3000,
  queueName: process.env.QUEUE_NAME || 'bookstore'
};
