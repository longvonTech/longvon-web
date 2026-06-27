import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImageAdminController } from './image-admin.controller';
import { MediaAdminController } from './media-admin.controller';

@Module({
  imports: [MulterModule.register()],
  controllers: [ImageAdminController, MediaAdminController],
})
export class ImageAdminModule {}
