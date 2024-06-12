import { Router } from 'express';
import videoWebhookController from '../../controllers/VideoWebhookController';

const videoWebhooksRouter = Router();

videoWebhooksRouter.post('/videos/transcription', videoWebhookController.transcriptionWebhook);
videoWebhooksRouter.post('/videos/metrics', videoWebhookController.metricsWebhook);

export default videoWebhooksRouter;
