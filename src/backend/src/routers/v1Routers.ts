import { Router } from 'express';

import routineRouter from './routines/RoutineRouter';
import videoWebhooksRouter from './webhooks/VideoWebhookRouter';
import videoRouter from './VideoRouter';
import testRouter from './TestRouter';
import analyticsRouter from './AnalyticsRouter';

const v1Router = Router();

v1Router.use('/test', testRouter);
v1Router.use('/analytics', analyticsRouter);
v1Router.use('/routines', routineRouter);
v1Router.use('/webhooks', videoWebhooksRouter);
v1Router.use('/videos', videoRouter);

export default v1Router;
