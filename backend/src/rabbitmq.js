const amqp = require('amqplib');
require('dotenv').config();

let channel = null;
let connection = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('Conectado ao RabbitMQ!');

        process.on('beforeExit', () => {
            console.log('Fechando conexão com RabbitMQ...');
            if (connection) {
                connection.close();
            }
        });

        return { connection, channel };
    } catch (error) {
        console.error('Erro ao conectar ao RabbitMQ:', error.message);
        throw error;
    }
}

function getChannel() {
    if (!channel) {
        throw new Error('Canal RabbitMQ não estabelecido. Chame connectRabbitMQ primeiro.');
    }
    return channel;
}

module.exports = { connectRabbitMQ, getChannel };