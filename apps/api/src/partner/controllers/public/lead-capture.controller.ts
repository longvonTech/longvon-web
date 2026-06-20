import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LeadService } from '../../services/lead.service';
import { CreateLeadDto } from '../../dto/create-lead.dto';
import { RateLimit, RateLimitGuard } from '../../guards/rate-limit.guard';

/**
 * 公开端点——Partner Landing Pages的表单提交目标，不需要登录即可调用，
 * 呼应TASK-104B/104C。这是本Sprint唯一一个对外开放的写入端点（其余写操作
 * 全部在Admin Controller下且需登录），因此TASK-104G的安全审查重点
 * 集中在这一个端点上：限流(RateLimitGuard) + Honeypot(LeadService内部判定) +
 * DTO输入校验(class-validator) 三重防护，详见partner-domain-review-v1.md。
 */
@Controller('partner-leads')
@UseGuards(RateLimitGuard)
export class LeadCaptureController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @RateLimit({ windowSeconds: 3600, maxRequests: 5 }) // 单IP每小时最多5次提交
  submit(@Body() dto: CreateLeadDto) {
    return this.leadService.createFromPublicForm(dto);
  }
}
