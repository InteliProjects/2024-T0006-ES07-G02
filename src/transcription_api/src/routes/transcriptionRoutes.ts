import { Router } from 'express';
import { upload } from '../app';
import { handleTranscription } from '../service/transcriptionService';

const router = Router();

// router.post('/transcribe', upload.single('audio'), handleTranscription);

export default router;
