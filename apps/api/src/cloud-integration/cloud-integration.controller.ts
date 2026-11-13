import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';
import { CurrentUser } from '../identity/decorators/current-user.decorator';
import { AppJwtPayload } from '../identity/jwt-payload.types';
import { CloudIntegrationService } from './cloud-integration.service';
import { PrepareCloudUploadDto } from './dto/prepare-cloud-upload.dto';

@Controller('cloud-integration')
@UseGuards(JwtAuthGuard)
export class CloudIntegrationController {
  constructor(private readonly cloudIntegration: CloudIntegrationService) {}

  @Get('catalog')
  getCatalog(@CurrentUser() user: AppJwtPayload) {
    this.assertCustomerOrAdmin(user);
    return this.cloudIntegration.getCatalog();
  }

  /**
   * Dry-run only. This endpoint accepts metadata, not health values or raw PPG.
   * It never calls api.longvon.com and never persists the request.
   */
  @Post('uploads/prepare')
  prepareUpload(
    @CurrentUser() user: AppJwtPayload,
    @Body() dto: PrepareCloudUploadDto,
  ) {
    this.assertCustomerOrAdmin(user);
    return this.cloudIntegration.prepareUpload(dto);
  }

  private assertCustomerOrAdmin(user: AppJwtPayload): void {
    if (user.kind !== 'customer' && user.kind !== 'admin') {
      throw new ForbiddenException('当前身份无权访问云端集成接口');
    }
  }
}
