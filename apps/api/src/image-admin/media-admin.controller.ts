import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { verifyAdminToken } from '../common/admin-auth.util';

const IMAGES_BASE_DIR = process.env.IMAGES_BASE_DIR ?? '/var/www/mateyou';
const MEDIA_DIR = 'media/enterprise';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/webm'];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

function extForMime(mime: string): string {
  if (mime === 'image/jpeg') return '.jpg';
  if (mime === 'image/png') return '.png';
  if (mime === 'image/webp') return '.webp';
  if (mime === 'video/mp4') return '.mp4';
  if (mime === 'video/webm') return '.webm';
  return '';
}

@Controller('admin/media')
export class MediaAdminController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = path.join(IMAGES_BASE_DIR, MEDIA_DIR);
          fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const ext = extForMime(file.mimetype) || path.extname(file.originalname) || '';
          const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
          cb(null, name);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException('只支持 JPG/PNG/WebP 图片或 MP4/WebM 视频'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  upload(
    @Headers('x-admin-token') token: string,
    @UploadedFile() file: any,
  ) {
    verifyAdminToken(token);
    if (!file) throw new BadRequestException('请选择文件');

    const isVideo = VIDEO_TYPES.includes(file.mimetype);
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      fs.unlinkSync(file.path);
      throw new BadRequestException(
        isVideo ? '视频最大 100MB' : '图片最大 10MB',
      );
    }

    const url = `/${MEDIA_DIR}/${file.filename}`;
    return {
      success: true,
      url,
      type: isVideo ? 'video' : 'image',
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    };
  }
}
