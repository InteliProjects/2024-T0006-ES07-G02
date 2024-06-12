import { Router } from 'express';
import routineController from '../../controllers/RoutineController';

const routineRouter = Router();

routineRouter.post('/videos/process-new', routineController.proccessNewVideos);
routineRouter.post('/videos/compile', routineController.compileResults);

export default routineRouter;
