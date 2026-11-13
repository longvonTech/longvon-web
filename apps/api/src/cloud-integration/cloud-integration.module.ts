import { Module } from '@nestjs/common';
import { CloudIntegrationController } from './cloud-integration.controller';
import { CloudIntegrationService } from './cloud-integration.service';

@Module({
  controllers: [CloudIntegrationController],
  providers: [CloudIntegrationService],
  exports: [CloudIntegrationService],
})
export class CloudIntegrationModule {}
