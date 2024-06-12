import { Request, Response } from 'express';
import Controller from './Controller';
import sambaVideosApiProvider from '../connections/api/sambaVideos/SambaVideosApiProvider';
import videoService from '../services/VideoService';
import rabbitMqProvider from '../connections/rabbitMQ/RabbitMqProvider';
import s3BucketProvider from '../connections/bucket/S3BucketProvider';
import queueProcessService from '../services/QueueProcessService';

export class RoutineController extends Controller {
    constructor() {
        super();
    }

    async proccessNewVideos(req: Request, res: Response) {
        const mysqlVideos = await videoService.listAll();

        let hasUnprocessed = true;
        let page = 0;

        const nonProcessedVideosSambaVideos: any[] = [];

        while (hasUnprocessed) {
            const chunkVideosSambaVideos = (await sambaVideosApiProvider.s3BucketConnection?.listVideos(page)) as any[];

            const nonProcessedValidVideos = chunkVideosSambaVideos.filter((video: any) => {
                return !mysqlVideos?.some((mysqlVideo) => mysqlVideo.external_id == video.id) && video.files.length;
            });

            hasUnprocessed = !!nonProcessedValidVideos.length;

            nonProcessedVideosSambaVideos.push(...nonProcessedValidVideos);

            page++;
        }

        const sortedVideos = nonProcessedVideosSambaVideos.sort(
            (a, b) => a.files[0].fileInfo.duration - b.files[0].fileInfo.duration,
        );

        const createdIds = await Promise.all(
            sortedVideos.map(async (videoInfo: any) => {
                const id = await videoService.createAndSaveMetadataBySambaVideoInfo(videoInfo);

                const smallerVideo = (videoInfo.files as any[]).sort(
                    (a, b) => Number(a.fileSize) - Number(b.fileSize),
                )[0];

                rabbitMqProvider.getConnection().publish('transcription', { fileUrl: smallerVideo.url, id });
                queueProcessService.create('transcription', id as number, 'CREATED');

                return id;
            }),
        );

        res.json({ message: `Processed ${createdIds.length} videos`, ids: createdIds });
    }

    compileResults = async (req: Request, res: Response) => {
        const videos = await videoService.listAllWithMetadata();

        const metaphorMetrics = [];
        const formalityMetrics = [];
        const timeMetrics = [];

        for (let i = 1; i <= 10; i++) {
            metaphorMetrics.push(
                this._compileCommunicationMetricsHelper(
                    videos.filter((video) => video.metadata.metrics.metaphor == i),
                    i,
                ),
            );
            formalityMetrics.push(
                this._compileCommunicationMetricsHelper(
                    videos.filter((video) => video.metadata.metrics.formality == i),
                    i,
                ),
            );
        }

        const biggerTime = videos.sort((a, b) => b.metadata.time - a.metadata.time)[0].metadata.time;

        for (let i = 0; i <= biggerTime; i = i + 30) {
            const timeVideos = videos.filter((video: any) => video.metadata.time >= i && video.metadata.time < i + 30);
            timeMetrics.push(this._compileCommunicationMetricsHelper(timeVideos, i));
        }

        const topicMetrics = this._compileTopicsMetricsHelper(videos);

        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const actualDate = `${year}-${month}-${day}`;

        const compiledInfo = {
            time: timeMetrics,
            communication_metrics: {
                metaphor: metaphorMetrics,
                formality: formalityMetrics,
            },
            topics_metrics: topicMetrics,
        };

        await s3BucketProvider.getConnection().uploadByInfo(`videos/compiled/${actualDate}.json`, compiledInfo);

        res.json({
            time: actualDate,
            compiledInfo,
        });
    };

    private _compileCommunicationMetricsHelper(videos: any[], i: number) {
        const sumOfViews = videos.reduce((total, element) => {
            return total + element.metadata.views;
        }, 0);
        const sumOfComments = videos.reduce((total, element) => {
            return total + element.metadata.comments;
        }, 0);
        const sumOfRatings = videos.reduce((total, element) => {
            return total + element.metadata.ratings;
        }, 0);

        return {
            value: i,
            video_count: videos.length,
            avg_views: videos.length ? sumOfViews / videos.length : 0,
            sum_views: sumOfViews,
            avg_comments: videos.length ? sumOfComments / videos.length : 0,
            sum_comments: sumOfComments,
            avg_ratings: videos.length ? sumOfRatings / videos.length : 0,
            sum_ratings: sumOfRatings,
        };
    }

    private _compileTopicsMetricsHelper(videos: any[]) {
        const topicsSet = new Set();

        videos.forEach((video) => {
            (video.metadata?.metrics?.topics || []).forEach((topic: string) => topicsSet.add(topic));
        });

        return [...topicsSet].map((topic) => {
            return videos
                .filter((video) => (video.metadata?.metrics?.topics || []).includes(topic))
                .reduce(
                    (reduced, video) => {
                        reduced.video_count += 1;

                        reduced.sum_views += video.metadata.views;
                        reduced.avg_views = reduced.sum_views / reduced.video_count;

                        reduced.sum_comments += video.metadata.comments;
                        reduced.avg_comments = reduced.sum_comments / reduced.video_count;

                        reduced.sum_ratings += video.metadata.ratings;
                        reduced.avg_ratings = reduced.sum_ratings / reduced.video_count;

                        return reduced;
                    },
                    {
                        value: topic,
                        video_count: 0,
                        avg_views: 0,
                        sum_views: 0,
                        avg_comments: 0,
                        sum_comments: 0,
                        avg_ratings: 0,
                        sum_ratings: 0,
                    },
                );
        });
    }
}

const routineController = new RoutineController();
export default routineController;
