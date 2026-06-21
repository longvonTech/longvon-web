import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImageAdminController } from './image-admin.controller';

@Module({
  imports: [MulterModule.register()],
  controllers: [ImageAdminController],
})
export class ImageAdminModule {}
