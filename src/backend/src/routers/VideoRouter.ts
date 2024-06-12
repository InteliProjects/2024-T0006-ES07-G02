import { Router } from 'express';
import videoController from '../controllers/VideoController';

const videoRouter = Router();

videoRouter.get('/', videoController.list);
videoRouter.get('/:id', videoController.find);

export default videoRouter;
