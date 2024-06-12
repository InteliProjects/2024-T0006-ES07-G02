import amqp from 'amqplib';
import { downloadAndConvertVideo, handleTranscription } from '../service/transcriptionService';
import fs from 'fs';

const queueCallback = async (mensagem: amqp.ConsumeMessage | null, canal: amqp.Channel) => {
    try {
        if (mensagem !== null) {
            const dadosMensagem = JSON.parse(mensagem.content.toString());
            const videoUrl = dadosMensagem.fileUrl;

            if (videoUrl) {
                const audioPath = await downloadAndConvertVideo(videoUrl, dadosMensagem.id);
                try {
                    await handleTranscription(audioPath, dadosMensagem.id);

                    fs.rmSync(audioPath);

                    canal.ack(mensagem);
                } catch (handleTranscriptionError) {
                    fs.rmSync(audioPath);
                    throw handleTranscriptionError;
                }
            } else {
                console.error(`[${new Date()}] URL do vídeo não encontrada na mensagem.`);
                canal.nack(mensagem, false, true);
            }
        } else {
            throw new Error('Null Message');
        }
    } catch (err) {
        if (mensagem) {
            canal.nack(mensagem, false, false);
        }
    }
};

async function conectarRabbitMQ() {
    const rabbitMQURL = process.env.RABBITMQ_URL;
    if (!rabbitMQURL) {
        throw new Error('A variável de ambiente RABBITMQ_URL não está definida.');
    }

    try {
        const conexao = await amqp.connect(rabbitMQURL);
        const canal = await conexao.createChannel();
        const fila = 'transcription';

        await canal.assertQueue(fila, { durable: true });
        console.log(`[${new Date()}] Aguardando por mensagens em ${fila}.`);

        canal.prefetch(2);
        canal.consume(fila, (message) => queueCallback(message, canal), { noAck: false });
    } catch (connectionError) {
        console.error(`[${new Date()}] Erro ao conectar com RabbitMQ:`, connectionError);
        setTimeout(() => {
            conectarRabbitMQ();
        }, 5000);
    }
}

export default conectarRabbitMQ;
