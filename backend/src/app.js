const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { connectRabbitMQ, getChannel } = require('./rabbitmq');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const messageStatusMap = new Map();

module.exports.messageStatusMap = messageStatusMap;

app.post('/api/notificar', async (req, res) => {
    const { conteudoMensagem } = req.body;
    const mensagemId = uuidv4();

    if (!conteudoMensagem || conteudoMensagem.trim() === '') {
        return res.status(400).json({ error: 'conteudoMensagem não pode ser vazio.' });
    }

    const queueName = `fila.notificacao.entrada.VINICIUS`;

    try {
        const channel = getChannel();
        await channel.assertQueue(queueName, { durable: true });
        
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify({ mensagemId, conteudoMensagem })), { persistent: true });

        console.log(`[App] Mensagem ${mensagemId} publicada na fila ${queueName}`);

        messageStatusMap.set(mensagemId, 'AGUARDANDO PROCESSAMENTO (Backend)');

        res.status(202).json({
            message: 'Requisição recebida e será processada assincronamente.',
            mensagemId: mensagemId,
            statusInicial: messageStatusMap.get(mensagemId)
        });

    } catch (error) {
        console.error('[App] Erro ao processar notificação:', error.message);
        res.status(500).json({ error: 'Erro interno ao processar notificação.' });
    }
});

app.get('/api/notificacao/status/:mensagemId', (req, res) => {
    const { mensagemId } = req.params;
    const status = messageStatusMap.get(mensagemId);

    if (status) {
        res.json({ mensagemId, status });
    } else {
        res.status(404).json({ error: 'Mensagem não encontrada ou status ainda não disponível.' });
    }
});

async function startServer() {
    try {
        await connectRabbitMQ();
        const startConsumer = require('./consumer');
        await startConsumer();

        app.listen(PORT, () => {
            console.log(`Servidor backend rodando na porta ${PORT}`);
            console.log(`Aguardando requisições em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Falha ao iniciar o servidor:', error.message);
        process.exit(1);
    }
}

startServer();