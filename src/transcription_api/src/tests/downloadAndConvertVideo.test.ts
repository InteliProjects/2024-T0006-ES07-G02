import { convertVideoToAudio } from '../utils/download_video'
import { downloadVideo } from '../utils/download_video';
const fs = require('fs');
import path = require('path');

import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });

describe('Função de videoDownloader', () => {
  it('Função de download do video através de uma URL', async () => {
    const videoUrl = process.env.VIDEO_URL || 'url_do_seu_video';
    const outputFilePath = path.join(__dirname, 'video_test.mp4');

    await downloadVideo(videoUrl, outputFilePath);

    expect(fs.existsSync(outputFilePath)).toBe(true);

    const stats = fs.statSync(outputFilePath);
    expect(stats.size).toBeGreaterThan(0);
  });
});

describe('Função para converter video em audio', () => {
  it('Converter MP4 para audio flac', async () => {
    const videoFilePath = 'src/tests/video_test.mp4';
    const outputAudioFilePath = 'src/tests/teste.flac';

    await convertVideoToAudio(videoFilePath, outputAudioFilePath);

    const fs = require('fs');
    expect(fs.existsSync(outputAudioFilePath)).toBe(true);

    const stats = fs.statSync(outputAudioFilePath);
    expect(stats.size).toBeGreaterThan(0);

    fs.unlinkSync(outputAudioFilePath);
    fs.unlinkSync(videoFilePath)
  });
});
