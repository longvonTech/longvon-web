import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../identity/guards/jwt-auth.guard';
import { CurrentUser } from '../../../identity/decorators/current-user.decorator';
import { AppJwtPayload } from '../../../identity/jwt-payload.types';
import { AssessmentSessionService } from '../../services/assessment-session.service';
import { Answers } from '../../engine/types';
import {
  AssessmentHistoryQueryDto,
  SaveProgressDto,
  StartAssessmentDto,
  SubmitAssessmentDto,
} from '../../dto/assessment-session.dto';

/**
 * C端评估会话端点——呼应TASK-105N"仅用户本人可访问结果"。
 * 只挂JwtAuthGuard，不挂RolesGuard/@Roles（这条端点服务的是C端Customer身份，
 * 不是后台Role体系），改用本Controller内的assertCustomer()显式校验kind==='customer'，
 * 与customer.controller.ts(Sprint 1)的既有模式保持一致。
 */
@Controller('assessments')
@UseGuards(JwtAuthGuard)
export class AssessmentController {
  constructor(private readonly sessionService: AssessmentSessionService) {}

  @Post('start')
  start(@CurrentUser() user: AppJwtPayload, @Body() dto: StartAssessmentDto) {
    const customerId = this.assertCustomer(user);
    return this.sessionService.start(customerId, dto.assessmentType, dto.channel ?? 'web');
  }

  @Get('history')
  getHistory(@CurrentUser() user: AppJwtPayload, @Query() query: AssessmentHistoryQueryDto) {
    const customerId = this.assertCustomer(user);
    return this.sessionService.getHistory(customerId, query.assessmentType);
  }

  @Get(':id')
  getOne(@CurrentUser() user: AppJwtPayload, @Param('id') id: string) {
    const customerId = this.assertCustomer(user);
    return this.sessionService.getById(id, customerId);
  }

  @Get(':id/resume')
  resume(@CurrentUser() user: AppJwtPayload, @Param('id') id: string) {
    const customerId = this.assertCustomer(user);
    return this.sessionService.resume(id, customerId);
  }

  @Patch(':id/save-progress')
  saveProgress(
    @CurrentUser() user: AppJwtPayload,
    @Param('id') id: string,
    @Body() dto: SaveProgressDto,
  ) {
    const customerId = this.assertCustomer(user);
    return this.sessionService.saveProgress(id, customerId, dto.answers as unknown as Answers);
  }

  @Post(':id/submit')
  submit(@CurrentUser() user: AppJwtPayload, @Param('id') id: string, @Body() dto: SubmitAssessmentDto) {
    const customerId = this.assertCustomer(user);
    return this.sessionService.submit(id, customerId, dto.answers as unknown as Answers);
  }

  private assertCustomer(user: AppJwtPayload): string {
    if (user.kind !== 'customer') {
      throw new ForbiddenException('该接口仅供C端用户访问');
    }
    return user.sub;
  }
}
