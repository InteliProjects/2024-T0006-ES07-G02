import AppError from '../app/AppError/AppError';
import { NextFunction, Request, Response } from 'express';

export default function errorHandlerMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    console.log(error);
    const appError = AppError.createByError(error);

    if (appError.showError) {
        console.log(`ERROR [${appError.date.toISOString()}] ${appError.code} -`, appError.message, error.stack);
    }

    res.status(appError.code).json({
        code: appError.code,
        message: appError.message,
    });
}
