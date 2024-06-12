import { handleTranscription } from "../service/transcriptionService";
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });

describe('Teste função de transcrição', () => {
    it('Função de transcrição de audio (.flac)', async () => {
        const transcricao = await handleTranscription('src/tests/Gravando.flac', 1);
        expect(transcricao).toContain('original do teste e documentação \ntestando a documentação ');
    },70000);
});