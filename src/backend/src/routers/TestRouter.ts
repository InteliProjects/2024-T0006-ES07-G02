import { Router } from 'express';
import testController from '../controllers/TestController';
import multer from 'multer';
import os from 'os';

const testRouter = Router();

testRouter.get('/', testController.list);
testRouter.get('/:id', testController.find);
testRouter.post('/', testController.create);
testRouter.put('/:id', testController.update);
testRouter.delete('/:id', testController.delete);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, os.tmpdir());
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const uploadConfig = multer({ storage: storage });
testRouter.post('/audio', uploadConfig.single('file'), testController.audio);

export default testRouter;
