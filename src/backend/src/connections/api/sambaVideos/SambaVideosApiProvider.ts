import SambaVideosApiConnection from './SambaVideosApiConnection';

export class SambaVideosApiProvider {
    s3BucketConnection: SambaVideosApiConnection;

    public setConnection(environmentVars: any) {
        this.s3BucketConnection = new SambaVideosApiConnection(
            environmentVars.SAMBA_VIDEOS_BASE_URL,
            environmentVars.SAMBA_VIDEOS_ACCESS_TOKEN,
            environmentVars.SAMBA_VIDEOS_PID,
        );

        return this.s3BucketConnection;
    }

    public getConnection() {
        return this.s3BucketConnection;
    }
}

const sambaVideosApiProvider = new SambaVideosApiProvider();
export default sambaVideosApiProvider;
