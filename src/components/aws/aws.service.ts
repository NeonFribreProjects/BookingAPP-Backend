import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { appConfig } from "../../config/application.config";

export class AWSService {
  client: S3Client;
  constructor() {
    this.client = new S3Client({
      credentials: {
        accessKeyId: appConfig.aws.accessKey,
        secretAccessKey: appConfig.aws.secretKey,
      },
      region: appConfig.aws.region,
    });
  }

  async getPreSignedURL(key: string) {
    const command = new PutObjectCommand({
      Bucket: appConfig.aws.bucketName,
      Key: key,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });
    return { url };
  }
}
