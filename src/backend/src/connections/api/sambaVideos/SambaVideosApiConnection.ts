import { AxiosRequestConfig } from 'axios';
import APIConnection from '../ApiConnection';

export default class SambaVideosApiConnection extends APIConnection {
    private accessToken: string;
    private pid: number;

    constructor(baseUrl: string, accessToken: string, pid: number) {
        super(baseUrl);
        this.accessToken = accessToken;
        this.pid = Number(pid);
    }

    protected async request<R = any>(config: AxiosRequestConfig<any>): Promise<R> {
        if (!config.params) {
            config.params = {
                access_token: this.accessToken,
                pid: this.pid,
            };
        } else {
            config.params.access_token = `${this.accessToken}`;
            config.params.pid = this.pid;
        }

        config.params;

        return super.request(config);
    }

    public async getProjects() {
        return this.request({
            url: '/projects',
            method: 'GET',
        });
    }

    public async listVideos(start: number = 0, limit: number = 100) {
        return this.request({
            url: '/medias',
            method: 'GET',
            params: {
                start,
                limit,
            },
        });
    }

    public async findVideoById(id: string) {
        return this.request({
            url: `/medias/${id}`,
            method: 'GET',
        });
    }
}
