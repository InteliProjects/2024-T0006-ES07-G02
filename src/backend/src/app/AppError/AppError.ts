import { AxiosError, isAxiosError } from 'axios';

export default class AppError extends Error {
    code: number;
    showError: boolean;
    date: Date;

    constructor(message: any, code = 500, showError: boolean = true, date?: Date) {
        super(message);
        this.code = code;
        this.showError = showError;
        this.date = date || new Date();
    }

    static createByError(error: any, showError?: boolean): AppError {
        if (error instanceof AppError) {
            return error;
        } else if (isAxiosError(error)) {
            return this.createByAxiosError(error, showError);
        } else if (this.isMysqlError(error)) {
            return this.createByMysqlError(error, showError);
        } else if (error instanceof Error) {
            return this.createByNodeError(error, showError);
        } else {
            return this.createByUnknownError(error, showError);
        }
    }

    static createByUnknownError(error: any, showError: boolean = false): AppError {
        let message = error.message || 'Unknown Error';
        let code = error.code || error.status || 500;

        return new AppError(message, code, showError);
    }

    static createByMysqlError(error: any, showError: boolean = false): AppError {
        let message = error.message;
        if (String(message).includes('ER_DUP_ENTRY')) {
            message = 'Some of the information has already exists on database';
        }

        return new AppError(message, 500, showError);
    }

    static isMysqlError(error: any): boolean {
        return !!(error.sql || error.fieldCount || error.sqlMessage || error.sqlState || error.sqlStateMarker);
    }

    static createByAxiosError(error: AxiosError, showError: boolean = false): AppError {
        return new AppError(error.message, error.status, showError);
    }

    static createByNodeError(error: Error, showError: boolean = false): AppError {
        return new AppError(error.message, 500, showError);
    }

    static badRequest(message: any = 'Bad Request', showError: boolean = false): AppError {
        return new AppError(message, 400, showError);
    }

    static notFound(message: any = 'Not Found', showError: boolean = false): AppError {
        return new AppError(message, 404, showError);
    }

    static internalServerError(message: any = 'Internal Server Error'): AppError {
        return new AppError(message, 500, true);
    }
}
