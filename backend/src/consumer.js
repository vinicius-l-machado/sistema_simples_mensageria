const { getChannel } = require('./rabbitmq');
const { messageStatusMap } = require('./app');

async function startConsumer() {
    const channel = getChannel();
    const inputQueueName = `fila.notificacao.entrada.VINICIUS`;
    const outputQueueName = `fila.notificacao.status.VINICIUS`;

    try {
        await channel.assertQueue(inputQueueName, { durable: true });
        await channel.assertQueue(outputQueueName, { durable: true });

        console.log(`[Consumer] Aguardando mensagens na fila: ${inputQueueName}`);

        channel.consume(inputQueueName, async (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                const { mensagemId, conteudoMensagem } = content;

                console.log(`[Consumer] Recebida mensagem para ID: ${mensagemId} - Conteúdo: "${conteudoMensagem}"`);

                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

                const randomNumber = Math.floor(Math.random() * 10) + 1;
                const status = randomNumber <= 2 ? 'FALHA_PROCESSAMENTO' : 'PROCESSADO_SUCESSO';

                console.log(`[Consumer] Mensagem ${mensagemId} processada com status: ${status}`);

                channel.sendToQueue(outputQueueName, Buffer.from(JSON.stringify({ mensagemId, status })), { persistent: true });

                messageStatusMap.set(mensagemId, status);
                console.log(`[Consumer] Status do ID ${mensagemId} atualizado para ${status} no mapa.`);

                channel.ack(msg);
            }
        }, {
            noAck: false
        });

    } catch (error) {
        console.error('[Consumer] Erro ao iniciar consumidor:', error.message);
    }
}

module.exports = startConsumer;