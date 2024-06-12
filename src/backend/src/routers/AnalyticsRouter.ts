import { Router } from 'express';
import analyticsController from '../controllers/AnalyticsController';

const analyticsRouter = Router();

analyticsRouter.get('/last', analyticsController.getLast);

export default analyticsRouter;
