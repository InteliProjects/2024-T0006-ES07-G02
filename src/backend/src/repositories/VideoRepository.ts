import Repository from './Repository';

export type VideoStatus = 'MAPPED' | 'TRANSCRIPTED' | 'TRANSCRIPT_ERROR' | 'METRIFIED' | 'METRIFY_ERROR';

export type VideoUpdateInfo = {
    metadataFilePath?: string;
    title?: string;
    externalId?: string;
    status?: VideoStatus;
    hasSpeak?: boolean;
};

export class VideoRepository extends Repository {
    public async listAll() {
        return this.doSelect(
            `SELECT * 
            FROM video`,
        );
    }

    public async findById(id: number) {
        return this.doSelectOne(
            `SELECT * 
            FROM video 
            WHERE 
                video.id = ?`,
            [id],
        );
    }

    public async create(metadataFilePath: string, title: string, externalId: string, status: VideoStatus = 'MAPPED') {
        return this.doCreate(
            `INSERT INTO video 
                (metadata_file_path, title, external_id, status) 
            VALUES 
                (?, ?, ?, ?)`,
            [metadataFilePath, title, externalId, status],
        );
    }

    public async updateById(id: number, updateInfo: VideoUpdateInfo) {
        if (!Object.keys(updateInfo)) {
            return false;
        }

        const updateObj: Record<string, any> = {};

        if (updateInfo.externalId) {
            updateObj.external_id = updateInfo.externalId;
        }

        if (updateInfo.metadataFilePath) {
            updateObj.metadata_file_path = updateInfo.metadataFilePath;
        }

        if (updateInfo.title) {
            updateObj.title = updateInfo.title;
        }

        if (updateInfo.status) {
            updateObj.status = updateInfo.status;
        }

        if (typeof updateInfo.hasSpeak != 'undefined') {
            updateObj.has_speak = Number(updateInfo.hasSpeak);
        }

        const values = Object.values(updateObj);
        values.push(id);

        return this.doUpdate(
            `UPDATE video 
                SET ${Object.keys(updateObj)
                    .map((value: string) => {
                        return `${value} = ?`;
                    })
                    .join(', ')}
            WHERE video.id = ?`,
            values,
        );
    }

    public async deleteById(id: number) {
        return this.doDelete(
            `DELETE FROM video
            WHERE 
                video.id = ?`,
            [id],
        );
    }
}

const videoRepository = new VideoRepository();
export default videoRepository;
