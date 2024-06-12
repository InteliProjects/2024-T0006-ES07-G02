import axios, { AxiosInstance, AxiosRequestConfig, isAxiosError } from 'axios';
import AppError from '../../app/AppError/AppError';

export default abstract class APIConnection {
    private axios: AxiosInstance;
    private logSendRequest: boolean;

    constructor(baseUrl: string, logSendRequest: boolean = true) {
        this.axios = axios.create({
            baseURL: baseUrl,
        });

        this.logSendRequest = logSendRequest;
    }

    protected async request<R = any>(config: AxiosRequestConfig): Promise<R> {
        try {
            const response = await this.axios.request<R>(config);

            if (this.logSendRequest) {
                console.log(
                    `Request External API [${config.method}] - ${this.axios.getUri()}${config.url} with status ${
                        response.status
                    }`,
                );
            }

            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                console.log(
                    `Request External API [${config.method}] - ${this.axios.getUri()}${config.url} ERROR with status ${
                        error.response?.status
                    }`,

                    error.response?.data,
                );
            }
            throw AppError.createByError(error, false);
        }
    }
}
