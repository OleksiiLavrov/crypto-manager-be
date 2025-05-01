import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { ConfigEnum } from '../constants';

@Injectable()
export class FilesService {
  private readonly client: S3Client;
  private readonly bucketName = this.configService.get<string>(
    ConfigEnum.AWS_S3_BUCKET_NAME,
  );
  private readonly region = this.configService.get<string>(
    ConfigEnum.AWS_REGION,
  );

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>(
          ConfigEnum.AWS_ACCESS_KEY_ID,
        ),
        secretAccessKey: this.configService.get<string>(
          ConfigEnum.AWS_SECRET_ACCESS_KEY,
        ),
      },
      endpoint: `https://s3.${this.region}.amazonaws.com`,
      forcePathStyle: true,
    });
  }

  async uploadCreatedFile(file: Express.Multer.File) {
    try {
      const key = `${file.originalname}-${uuid()}`;
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          Metadata: {
            originalName: file.originalname,
          },
        }),
      );
      return {
        key,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async delete(key: string) {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
      return { message: `File ${key} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
