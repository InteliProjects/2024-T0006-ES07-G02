import { Request, Response } from 'express';
import Controller from './Controller';
import testService from '../services/TestService';
import fs from 'fs';
import AppError from '../app/AppError/AppError';

export class TestController extends Controller {
    constructor() {
        super();
    }

    list = async (req: Request, res: Response) => {
        return res.json(await testService.listAll());
    };

    find = async (req: Request<{ id: number }>, res: Response) => {
        return res.json(await testService.findById(req.params.id));
    };

    create = async (req: Request<any, any, { name: string }>, res: Response) => {
        const { name } = req.body;

        return res.json(await testService.create(name));
    };

    update = async (req: Request<{ id: number }, any, { name: string }>, res: Response) => {
        const { name } = req.body;

        return res.json(await testService.updateById(req.params.id, name));
    };

    delete = async (req: Request<{ id: number }>, res: Response) => {
        return res.json(await testService.deleteById(req.params.id));
    };

    audio = async (req: Request<{}>, res: Response) => {
        const file = req.file as Express.Multer.File;

        try {
            const transcription = (await testService.getTranscription(file.path)) as any;

            if (!transcription) {
                throw AppError.badRequest("Can't transcript audio");
            }

            const intent = await testService.getIntent(transcription);

            const data = await testService.getDataByIntent(intent);

            console.log(data);

            fs.unlinkSync(file.path);
            return res.json({ transcription, intent, data });
        } catch (error) {
            fs.unlinkSync(file.path);
            throw error;
        }
    };
}

const testController = new TestController();
export default testController;
