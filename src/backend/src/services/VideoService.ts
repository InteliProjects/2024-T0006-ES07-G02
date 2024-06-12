import s3BucketProvider from '../connections/bucket/S3BucketProvider';
import videoRepository, { VideoStatus, VideoUpdateInfo } from '../repositories/VideoRepository';

export class VideoService {
    public async listAll() {
        return videoRepository.listAll();
    }

    public async listAllWithMetadata() {
        const videosInfo = await this.listAll();

        const s3Conn = s3BucketProvider.getConnection();

        return await Promise.all(
            videosInfo.map(async (video: any) => {
                const s3Return = await s3Conn.getByKey(video.metadata_file_path);
                video.metadata = JSON.parse(s3Return.Body?.toString() as string);
                return video;
            }),
        );
    }

    public async findById(id: number) {
        return videoRepository.findById(id);
    }

    public async findByIdWithMetadata(id: number) {
        const videoInfo = await this.findById(id);

        const s3File = await s3BucketProvider.getConnection().getByKey(videoInfo.metadata_file_path);

        const content = JSON.parse(s3File?.Body?.toString() as string);

        videoInfo.metadata = content;

        return videoInfo;
    }

    public async create(metadataFilePath: string, title: string, externalId: string, status: VideoStatus = 'MAPPED') {
        return videoRepository.create(metadataFilePath, title, externalId, status);
    }

    public async saveMetadataInfoBySambaVideoInfo(info: any) {
        const s3Connection = s3BucketProvider.getConnection();

        const key = `videos/metadata/${info.id}.json`;
        await s3Connection.uploadByInfo(key, {
            id: info.id,
            title: info.title,
            description: info.description,
            shortDescription: info.shortDescription,
            categoryId: info.categoryId,
            postDate: new Date(info.postDate),
            views: info.numberOfViews,
            comments: info.numberOfComments,
            ratings: info.numberOfRatings,
            inputedTags: info.tags,
            fileUrls: info.files.map((file: any) => {
                return file.url;
            }),
            time: info.files[0]?.fileInfo?.duration / 1000,
            metrics: {},
        });

        return key;
    }

    public async createAndSaveMetadataBySambaVideoInfo(info: any) {
        const filePath = await this.saveMetadataInfoBySambaVideoInfo(info);
        return await this.create(filePath, info.title, info.id);
    }

    public async updateById(id: number, info: VideoUpdateInfo) {
        return videoRepository.updateById(id, info);
    }

    public async deleteById(id: number) {
        return videoRepository.deleteById(id);
    }
}

const videoService = new VideoService();
export default videoService;
