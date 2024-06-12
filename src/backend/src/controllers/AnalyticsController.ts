import { Request, Response } from 'express';
import Controller from './Controller';
import s3BucketProvider from '../connections/bucket/S3BucketProvider';
import AppError from '../app/AppError/AppError';

export class AnalyticsController extends Controller {
    constructor() {
        super();
    }

    async getLast(req: Request, res: Response) {
        const list = await s3BucketProvider.getConnection().list('videos/compiled/');

        if (!list.Contents?.length) {
            throw AppError.notFound('Last Compiled Metrics not Found');
        }

        const sortedList =
            list.Contents?.sort((a, b) => {
                const dateA = new Date(a.Key?.split('.')[0] as string);
                const dateB = new Date(b.Key?.split('.')[0] as string);

                return dateB.getTime() - dateA.getTime();
            }) || [];

        const obj = await s3BucketProvider.getConnection().getByKey(sortedList[0].Key as string);

        return res.json({
            date: sortedList[0].Key?.split('.')[0].split('/').pop(),
            ...JSON.parse(obj.Body?.toString() as string),
        });
    }
}

const analyticsController = new AnalyticsController();
export default analyticsController;
