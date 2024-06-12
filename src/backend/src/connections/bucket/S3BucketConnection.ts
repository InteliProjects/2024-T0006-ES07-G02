import aws from 'aws-sdk';
import fs from 'fs';

export default class S3BucketConnection {
    private s3: aws.S3;
    private bucketName: string;

    constructor(bucketName: string, accesKeyId: string, accessKey: string, sessionToken: string) {
        aws.config.credentials = new aws.Credentials({
            accessKeyId: accesKeyId,
            secretAccessKey: accessKey,
            sessionToken: sessionToken,
        });

        this.s3 = new aws.S3();
        this.bucketName = bucketName;
    }

    async upload(key: string, file: fs.ReadStream | Buffer) {
        return new Promise((resolve, reject) => {
            this.s3.upload(
                {
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file,
                },
                (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                },
            );
        });
    }

    async uploadByFilePath(key: string, filePath: string) {
        return this.upload(key, fs.createReadStream(filePath));
    }

    async uploadByInfo(key: string, info: any) {
        let saveInfo = info;

        if (typeof info == 'object' && !(info instanceof Buffer)) {
            saveInfo = JSON.stringify(info);
        }

        return this.upload(key, Buffer.from(saveInfo, 'utf-8'));
    }

    async getByKey(key: string): Promise<aws.S3.GetObjectOutput> {
        return new Promise((resolve, reject) => {
            this.s3.getObject({ Bucket: this.bucketName, Key: key }, (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    async list(prefix: string): Promise<aws.S3.ListObjectsV2Output> {
        return await this.s3
            .listObjectsV2({
                Bucket: this.bucketName,
                Prefix: prefix,
            })
            .promise();
    }
}
