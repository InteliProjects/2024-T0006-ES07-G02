import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import axios from 'axios';
import ffmpegPath from 'ffmpeg-static';

if (ffmpegPath === null) {
    throw new Error('Não foi possível encontrar o caminho para o FFmpeg');
}

ffmpeg.setFfmpegPath(ffmpegPath);

export const downloadVideo = async (url: string, outputPath: string) => {
    const writer = fs.createWriteStream(outputPath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

export const convertVideoToAudio = (videoPath: string, audioPath: string) => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .output(audioPath)
            .on('end', () => {
                console.log(`[${new Date()}] Áudio convertido e salvo em: ${audioPath}`);
                resolve(audioPath);
            })
            .on('error', (err) => {
                console.error(`[${new Date()}] Erro ao converter vídeo para áudio:`, err);
                reject(err);
            })
            .run();
    });
};
