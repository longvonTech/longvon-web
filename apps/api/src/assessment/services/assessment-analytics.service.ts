import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * 呼应TASK-105M"Assessment Analytics"——记录Assessment Started/Completed/
 * Abandoned/Risk Distribution，写入Events表供后续Customer360/AI Analytics使用。
 *
 * Events表不受RLS保护（呼应physical-database-freeze-v1.md的既定设计：
 * DataAnalyst角色通过去标识化视图访问，不直接授予原表权限），
 * 因此本Service直接用PrismaService写入，不走withRlsContext。
 *
 * 埋点失败不应该影响评估流程本身——埋点是辅助性的统计记录，
 * 不是评估功能的必要组成部分，因此调用方式是"触发后不等待"，
 * 写入失败只记录日志，不向上抛出异常中断主流程。
 */
@Injectable()
export class AssessmentAnalyticsService {
  private readonly logger = new Logger(AssessmentAnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  recordStarted(customerId: string, assessmentType: string): void {
    this.emit(customerId, 'assessment_started', { assessmentType });
  }

  recordCompleted(customerId: string, assessmentType: string, riskLevel: string): void {
    // riskLevel同时写入properties，供"Risk Distribution"统计直接从Events表
    // group by properties里的riskLevel字段得出分布，不需要额外回查AssessmentResults表
    this.emit(customerId, 'assessment_completed', { assessmentType, riskLevel });
  }

  recordAbandoned(customerId: string, assessmentType: string): void {
    this.emit(customerId, 'assessment_abandoned', { assessmentType });
  }

  private emit(customerId: string, eventType: string, properties: Record<string, unknown>): void {
    this.prisma.event
      .create({
        data: {
          customerId,
          eventType,
          eventCategory: 'assessment',
          channel: 'web',
          properties,
          occurredAt: new Date(),
        },
      })
      .catch((err: Error) => {
        this.logger.warn(`埋点写入失败(${eventType})，不影响评估主流程: ${err.message}`);
      });
  }
}
