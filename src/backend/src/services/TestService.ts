import { IIntent } from '../connections/api/ia/IaApiConnection';
import iaApiProvider from '../connections/api/ia/IaApiProvider';
import spreechToTextIbmApiProvider from '../connections/api/ibm/stt/SpeechToTextIbmApiProvider';
import s3BucketProvider from '../connections/bucket/S3BucketProvider';
import testRepository from '../repositories/TestRepository';
import fs from 'fs';

export class TestService {
    public async listAll() {
        return testRepository.listAll();
    }

    public async findById(id: number) {
        return testRepository.findById(id);
    }

    public async create(name: string) {
        return s3BucketProvider.s3BucketConnection?.getByKey('art001a.wav');
    }

    public async updateById(id: number, name: string) {
        return testRepository.updateById(id, name);
    }

    public async deleteById(id: number) {
        return testRepository.deleteById(id);
    }

    public async getTranscription(audioFilePath: string) {
        const readBuffer = fs.readFileSync(audioFilePath);
        const transcription = await spreechToTextIbmApiProvider.ibmSttConnection?.recognize(readBuffer);
        console.log('Transcription', transcription);
        return transcription?.results[0]?.alternatives[0]?.transcript || '';
    }

    public async getIntent(text: string): Promise<any> {
        return ((await iaApiProvider.iaConnection?.getIntent(text)) as any).intent;
    }

    public async getDataByIntent(intent: any): Promise<any> {
        switch (intent) {
            case 'graph_views_minutes':
                return [
                    { minutes: 5, views: 1000 },
                    { minutes: 6, views: 2000 },
                    { minutes: 7, views: 2500 },
                    { minutes: 8, views: 2000 },
                    { minutes: 9, views: 1800 },
                    { minutes: 10, views: 900 },
                ];
                break;
            case 'popular_videos':
                return [
                    { title: 'UX para iniciantes', views: 700 },
                    { title: 'Matemática financeira', views: 400 },
                    { title: 'Calculo II #1', views: 350 },
                ];
                break;
            case 'show_trending_topics':
                return [
                    { topic: 'UX', views: 7000 },
                    { topic: 'IA', views: 6800 },
                    { topic: 'GPT', views: 6000 },
                ];
                break;
            default:
                return { message: 'Intent dont supported' };
        }
    }
}

const testService = new TestService();
export default testService;
