import { Request, Response } from 'express';
import Controller from './Controller';
import videoService from '../services/VideoService';

export class VideoController extends Controller {
    constructor() {
        super();
    }

    list = async (req: Request, res: Response) => {
        return res.json(await videoService.listAllWithMetadata());
    };

    find = async (req: Request<{ id: number }>, res: Response) => {
        return res.json(await videoService.findByIdWithMetadata(req.params.id));
    };
}

const videoController = new VideoController();
export default videoController;
