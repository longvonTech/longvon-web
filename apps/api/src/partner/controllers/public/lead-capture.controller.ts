import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LeadService } from '../../services/lead.service';
import { CreateLeadDto } from '../../dto/create-lead.dto';
import { RateLimit, RateLimitGuard } from '../../guards/rate-limit.guard';

@Controller('partner-leads')
@UseGuards(RateLimitGuard)
export class LeadCaptureController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @RateLimit({ windowSeconds: 3600, maxRequests: 5 })
  submit(@Body() dto: CreateLeadDto) {
    return this.leadService.createFromPublicForm(dto);
  }

  @Post('osa-assessment')
  @RateLimit({ windowSeconds: 3600, maxRequests: 10 })
  submitOsa(@Body() body: { contactName: string; phone: string; score: number; riskLevel: string }) {
    return this.leadService.createFromOsaAssessment(body);
  }
}
