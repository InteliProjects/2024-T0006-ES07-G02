import { Request } from 'express';
import { matchedData, validationResult } from 'express-validator';
import AppError from '../app/AppError/AppError';

export default abstract class Controller {
    protected matchData(req: Request) {
        const result = matchedData(req);
        return result;
    }

    protected validateResult(req: Request) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            throw AppError.badRequest(result.array(), false);
        }
    }
}
