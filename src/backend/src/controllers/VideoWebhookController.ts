import { Request, Response } from 'express';
import Controller from './Controller';
import videoService from '../services/VideoService';
import rabbitMqProvider from '../connections/rabbitMQ/RabbitMqProvider';
import s3BucketProvider from '../connections/bucket/S3BucketProvider';
import queueProcessService from '../services/QueueProcessService';
import AppError from '../app/AppError/AppError';

export class VideoWebhookController extends Controller {
    constructor() {
        super();
    }

    async transcriptionWebhook(req: Request, res: Response) {
        if (!req.body.status) {
            throw AppError.badRequest('Invalid body', false);
        }

        res.json({ message: 'ok' });
        queueProcessService.updateLastByQueueNRelation(req.body.id, 'transcription', req.body.status);

        if (req.body.status == 'FINISHED') {
            const videoInfo = await videoService.findByIdWithMetadata(req.body.id);

            videoInfo.metadata.transcription = req.body.transcription;
            await s3BucketProvider.getConnection().uploadByInfo(videoInfo.metadata_file_path, videoInfo.metadata);
            await videoService.updateById(req.body.id, {
                hasSpeak: !!String(req.body.transcription).length,
                status: 'TRANSCRIPTED',
            });

            if (req.body.transcription) {
                const videoInfoWithTranscription = await videoService.findByIdWithMetadata(req.body.id);
                await rabbitMqProvider.getConnection().publish('get_metrics', videoInfoWithTranscription);
                queueProcessService.create('get_metrics', req.body.id, 'CREATED');
            }
        } else if (req.body.status == 'ERROR') {
            await videoService.updateById(req.body.id, {
                status: 'TRANSCRIPT_ERROR',
            });
        }
    }

    async metricsWebhook(req: Request, res: Response) {
        if (!req.body.status) {
            throw AppError.badRequest('Invalid body', false);
        }
        res.json({ message: 'ok' });

        console.log('webhook metrica', req.body);
        queueProcessService.updateLastByQueueNRelation(req.body.id, 'get_metrics', req.body.status);

        if (req.body.status == 'FINISHED') {
            const videoInfo = await videoService.findByIdWithMetadata(req.body.id);

            const { metaphor, formality, topics, interation } = req.body;

            videoInfo.metadata.metrics = {
                metaphor,
                formality,
                topics: topics || [],
                interation,
            };

            await s3BucketProvider.getConnection().uploadByInfo(videoInfo.metadata_file_path, videoInfo.metadata);
            await videoService.updateById(req.body.id, {
                status: 'METRIFIED',
            });

            const videoInfoWithTranscription = await videoService.findByIdWithMetadata(req.body.id);
            res.json(videoInfoWithTranscription);
        } else if (req.body.status == 'ERROR') {
            await videoService.updateById(req.body.id, {
                status: 'METRIFY_ERROR',
            });
        }
    }
}

const videoWebhookController = new VideoWebhookController();
export default videoWebhookController;
