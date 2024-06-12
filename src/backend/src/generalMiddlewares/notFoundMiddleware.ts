import AppError from '../app/AppError/AppError';

export default function notFoundMiddleware() {
    throw AppError.notFound('Page not Found', true);
}
