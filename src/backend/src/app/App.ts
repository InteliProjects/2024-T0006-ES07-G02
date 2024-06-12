import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import AppError from './AppError/AppError';
import errorHandlerMiddleware from '../generalMiddlewares/errorHandlerMiddleware';
import notFoundMiddleware from '../generalMiddlewares/notFoundMiddleware';
import loggerMiddleware from '../generalMiddlewares/loggerMiddleware';
import v1Router from '../routers/v1Routers';
import mysqlDatabaseProvider from '../connections/database/MysqlDatabaseProvider';
import rabbitMqProvider from '../connections/rabbitMQ/RabbitMqProvider';
import s3BucketProvider from '../connections/bucket/S3BucketProvider';
import sambaVideosApiProvider from '../connections/api/sambaVideos/SambaVideosApiProvider';
import iaApiProvider from '../connections/api/ia/IaApiProvider';
import speechToTextIbmApiProvider from '../connections/api/ibm/stt/SpeechToTextIbmApiProvider';

export default class App {
    express: express.Application;
    private port: number;
    private environmentVars: Record<string, any>;
    private environmentVarsPath: string;

    constructor(environmentVarsPath: string) {
        this.express = express();
        this.setEnvironmentVars(environmentVarsPath);

        this.port = this.environmentVars.PORT;
    }

    public start() {
        this.express.listen(this.port, () => {
            console.log(`API started and listen ${this.port} port`);
        });
    }

    private applySwagger() {
        const swaggerDocument = fs.readFileSync(`${__dirname}/../../swagger.json`);
        this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    public async config() {
        await this.startConnections();
        this.setBeforeMiddlewares();
        this.setRouters();
        this.setAfterMiddlewares();
    }

    private async startConnections() {
        await mysqlDatabaseProvider.setConnection(this.environmentVars);
        await rabbitMqProvider.keepTryingConnect(this.environmentVars);
        s3BucketProvider.setConnection(this.environmentVars);
        sambaVideosApiProvider.setConnection(this.environmentVars);
        iaApiProvider.setConnection(this.environmentVars);
        speechToTextIbmApiProvider.setConnection(this.environmentVars);
    }

    private setBeforeMiddlewares() {
        this.express.use(express.json());
        this.express.use(cors());
        this.express.use(loggerMiddleware);
        this.applySwagger();
    }

    private setRouters() {
        this.express.use('/v1/', v1Router);
    }

    private setAfterMiddlewares() {
        this.express.use(notFoundMiddleware);
        this.express.use(errorHandlerMiddleware);
    }

    private setEnvironmentVars(environmentVarsPath: string) {
        if (!environmentVarsPath) {
            throw AppError.internalServerError('Invalid environmentVars Path');
        }

        this.environmentVarsPath = environmentVarsPath;
        dotenv.config({ path: environmentVarsPath });
        this.verifyEnvironmentVars(process.env);
        this.environmentVars = process.env;
    }

    private verifyEnvironmentVars(environmentVars: Record<string, any>) {
        if (!environmentVars.PORT) {
            throw AppError.internalServerError(
                `Invalid PORT at environmentVars // type ${typeof this.environmentVars.PORT}`,
            );
        }
    }
}
