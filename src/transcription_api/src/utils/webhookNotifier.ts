import axios from 'axios';

async function enviarNotificacaoWebhook(url: string, mensagem: object) {
    try {
        await axios.post(url, mensagem);
        console.log(`[${new Date()}] Webhook enviado.`);
    } catch (error) {
        console.error(`[${new Date()}] Erro ao enviar notificação de webhook:`, error);
    }
}

export default enviarNotificacaoWebhook;
