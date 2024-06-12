import { AxiosRequestConfig } from 'axios';
import APIConnection from '../../ApiConnection';

export default class SpeechToTextIbmAPIConnection extends APIConnection {
    apiKey: string;
    constructor(baseUrl: string, apiKey: string) {
        super(baseUrl);
        this.apiKey = apiKey;
    }
    protected request<R = any>(config: AxiosRequestConfig<any>): Promise<R> {
        const headers = config.headers || {};

        const authText = `Basic ${Buffer.from(`apiKey:${this.apiKey}`).toString('base64')}`;
        headers.Authorization = authText;

        config.headers = headers;

        return super.request(config);
    }

    public async recognize(audioFile: Buffer) {
        return this.request({
            method: 'POST',
            url: '/v1/models/pt-BR_Multimedia/recognize',
            data: audioFile,
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        });
    }
}
