import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import multer from 'multer';

@Injectable()
export class FilesService {
  private readonly S3_REGION: string;
  private readonly S3_ENDPOINT: string;
  private readonly S3_ACCESS_KEY_ID: string;
  private readonly S3_SECRET_ACCESS_KEY: string;
  private readonly S3_BUCKET_NAME: string;

  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.S3_REGION = configService.getOrThrow<string>('S3_REGION');
    this.S3_ENDPOINT = configService.getOrThrow<string>('S3_ENDPOINT');
    this.S3_ACCESS_KEY_ID =
      configService.getOrThrow<string>('S3_ACCESS_KEY_ID');
    this.S3_SECRET_ACCESS_KEY = configService.getOrThrow<string>(
      'S3_SECRET_ACCESS_KEY',
    );
    this.S3_BUCKET_NAME = configService.getOrThrow<string>('S3_BUCKET_NAME');
    this.s3 = new S3Client({
      endpoint: this.S3_ENDPOINT,
      credentials: {
        accessKeyId: this.S3_ACCESS_KEY_ID,
        secretAccessKey: this.S3_SECRET_ACCESS_KEY,
      },
      region: this.S3_REGION,
    });
    this.bucket = this.S3_BUCKET_NAME;
  }

  extractKey(url: string): string {
    const cleanUrl = url.split('?')[0];
    const pathname = new URL(cleanUrl).pathname;
    return pathname.startsWith('/') ? pathname.slice(1) : pathname;
  }

  async uploadMany(
    files?: Express.Multer.File[],
    folder = 'uploads',
  ): Promise<string[]> {
    if (!files?.length) return [];

    return Promise.all(files.map((file) => this.upload(file, folder)));
  }

  async upload(
    file: Express.Multer.File,
    folder = 'uploads',
    maxSizeMB: number = 10,
    maxWidth: number = 1200,
  ): Promise<string> {
    const filename = `${randomUUID()}-${file.originalname}`;
    const key = `${folder}/${filename}`;

    try {
      let buffer = file.buffer;

      if (file.size > maxSizeMB * 1024 * 1024) {
        let quality = 90;
        let width = maxWidth;
        let resized = buffer;

        while (resized.length > maxSizeMB * 1024 * 1024 && quality > 10) {
          resized = await sharp(buffer)
            .resize({ width, withoutEnlargement: true })
            .jpeg({ quality })
            .toBuffer();

          width = Math.floor(width * 0.9);
          quality = quality - 10;
        }

        buffer = resized;
      }

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );

      const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });

      const url = await getSignedUrl(this.s3, command);

      return url;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw error;
    }
  }

  async delete(key: string) {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
        }),
      );
      return { message: 'Файл успешно удалён' };
    } catch (error) {
      console.error('S3 delete error:', error);
      throw error;
    }
  }
}
