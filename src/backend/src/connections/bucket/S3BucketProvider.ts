import S3BucketConnection from './S3BucketConnection';

export class S3BucketProvider {
    s3BucketConnection: S3BucketConnection;

    public setConnection(environmentVars: any) {
        this.s3BucketConnection = new S3BucketConnection(
            environmentVars.S3_BUCKET_NAME,
            environmentVars.AWS_ACCESS_KEY_ID,
            environmentVars.AWS_SECRET_ACCESS_KEY,
            environmentVars.AWS_SESSION_TOKEN,
        );

        return this.s3BucketConnection;
    }

    public getConnection(): S3BucketConnection {
        return this.s3BucketConnection as S3BucketConnection;
    }
}

const s3BucketProvider = new S3BucketProvider();
export default s3BucketProvider;
