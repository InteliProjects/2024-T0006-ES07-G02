import fs from 'fs';
import speechToText from '../utils/conecction_ibm';
import enviarNotificacaoWebhook from '../utils/webhookNotifier';
import dotenv from 'dotenv';
import path from 'path';
import os from 'os';
import { randomBytes } from 'crypto';
import { convertVideoToAudio, downloadVideo } from '../utils/download_video';

dotenv.config({ path: `${__dirname}/../../.env` });

const webhookUrl = `${process.env.BACKEND_BASE_URL}webhooks/videos/transcription`;

function generateTempPath(extension: string) {
    return path.join(os.tmpdir(), `tempFile-${randomBytes(16).toString('hex')}${extension}`);
}

export const downloadAndConvertVideo = async (videoUrl: string, id: number) => {
    enviarNotificacaoWebhook(webhookUrl, {
        status: 'PROCESSING',
        id,
    });

    const videoPath = generateTempPath('.mp4');
    try {
        await downloadVideo(videoUrl, videoPath);
        console.log(`[${new Date()}] Vídeo baixado com sucesso e salvo em: ${videoPath}`);

        const audioPath = generateTempPath('.flac');

        await convertVideoToAudio(videoPath, audioPath);

        fs.rmSync(videoPath);

        return audioPath;
    } catch (convertError) {
        enviarNotificacaoWebhook(webhookUrl, {
            status: 'ERROR',
            id,
        });

        fs.rmSync(videoPath);
        throw convertError;
    }
};

export const handleTranscription = async (filePath: string, id: number) => {
    try {
        const params = {
            audio: fs.createReadStream(filePath),
            contentType: 'audio/flac',
            model: 'pt-BR_BroadbandModel',
        };

        const { result } = await speechToText.recognize(params);
        const transcriptionText = result.results?.map((r) => r.alternatives[0].transcript).join('\n');

        enviarNotificacaoWebhook(webhookUrl, {
            status: 'FINISHED',
            mensagem: 'Transcrição concluída',
            id,
            transcription: transcriptionText,
        });

        console.log({ transcribedText: transcriptionText });
        return transcriptionText;
    } catch (error) {
        console.error(`[${new Date()}] Erro na transcrição:`, error);

        enviarNotificacaoWebhook(webhookUrl, {
            status: 'ERROR',
            id,
        });

        throw error;
    }
};
