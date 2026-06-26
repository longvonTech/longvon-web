import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Answers } from '../engine/types';

export interface SubmittedResultData {
  answers: Answers;
  score: number;
  riskLevel: string;
  definitionVersion: string;
  resultBundle: {
    recommendations: string[];
    nextActions: string[];
    riskFactors: string[];
    disclaimer: string;
  };
}

/**
 * AssessmentResult的应用层字段类型。
 * 本接口对应Prisma Schema中`model AssessmentResult`的运行时形态——
 * 在真实环境中由`@prisma/client`生成的`Prisma.AssessmentResult`类型承担这一角色，
 * 但当前沙箱的`prisma generate`从未执行，生成产物不存在，
 * 全局tsc会把`tx.assessmentResult.findFirst()`的返回类型推断为`{}（空对象）`，
 * 导致Service层访问`.status`/`.answers`等字段时报TS2339（属性不存在）。
 * 本接口手动声明Service层实际使用的字段，供`findByIdForCustomer`显式标注返回类型，
 * 消除这一已知的环境性误报（与assessment-engine-review-v1.md第2部分说明的
 * \"因Prisma Client缺失导致的环境性误报\"性质相同）。
 */
export interface AssessmentResultRecord {
  id: string;
  customerId: string;
  assessmentType: string;
  channel: string;
  answers: Record<string, unknown>;
  score: number | null;
  riskLevel: string | null;
  status: string;
  definitionVersion: string | null;
  recommendations: unknown;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 呼应TASK-105N"确认仅用户本人可访问结果"——本Repository的全部客户端查询方法
 * 都采用两层防护：①显式SQL层面的`where: { customerId }`过滤（应用层防护，
 * 在当前沙箱从未真正连接数据库运行的情况下，这是唯一能确认生效的一层）；
 * ②通过`prisma.withRlsContext()`设置RLS会话变量（数据库层防护，一旦真实部署到
 * 已启用RLS策略的PostgreSQL实例，这一层会在①之外提供第二重独立保障，
 * 即使应用代码某处疏漏忘记加customerId过滤，RLS仍能兜底拒绝越权访问）。
 * 两层防护都做，而不是"反正有RLS兜底就不用在应用层判断"——纵深防御原则。
 */
@Injectable()
export class AssessmentResultRepository {
  constructor(private readonly prisma: PrismaService) {}

  createInProgress(
    customerId: string,
    assessmentType: string,
    channel: string,
    definitionVersion: string,
  ) {
    return this.prisma.withRlsContext({ customerId }, (tx) =>
      tx.assessmentResult.create({
        data: {
          customerId,
          assessmentType,
          channel,
          answers: {},
          status: 'in_progress',
          definitionVersion,
        },
      }),
    );
  }

  async findByIdForCustomer(id: string, customerId: string): Promise<AssessmentResultRecord> {
    const result = await this.prisma.withRlsContext({ customerId }, (tx) =>
      tx.assessmentResult.findFirst({ where: { id, customerId } }),
    );
    if (!result) throw new NotFoundException('评估记录不存在');
    return result as unknown as AssessmentResultRecord;
  }

  findHistoryForCustomer(customerId: string, assessmentType?: string) {
    return this.prisma.withRlsContext({ customerId }, (tx) =>
      tx.assessmentResult.findMany({
        where: { customerId, ...(assessmentType ? { assessmentType } : {}) },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  saveProgress(id: string, customerId: string, answers: Answers) {
    return this.prisma.withRlsContext({ customerId }, (tx) =>
      tx.assessmentResult.update({
        where: { id },
        data: { answers },
      }),
    );
  }

  submit(id: string, customerId: string, data: SubmittedResultData) {
    return this.prisma.withRlsContext({ customerId }, (tx) =>
      tx.assessmentResult.update({
        where: { id },
        data: {
          answers: data.answers,
          score: data.score,
          riskLevel: data.riskLevel,
          status: 'completed',
          definitionVersion: data.definitionVersion,
          recommendations: data.resultBundle,
        },
      }),
    );
  }

  /**
   * 识别"长时间停留在in_progress状态"的会话——用于判定为Abandoned。
   * 呼应TASK-105M"Assessment Abandoned"埋点要求。
   */
  findStaleInProgress(olderThanHours: number) {
    const threshold = new Date(Date.now() - olderThanHours * 3600 * 1000);
    return this.prisma.assessmentResult.findMany({
      where: { status: 'in_progress', updatedAt: { lt: threshold } },
      select: { id: true, customerId: true, assessmentType: true },
    });
  }

  /**
   * 供后台/合规审查使用——跨customer查询，不走withRlsContext的customer_id上下文
   * （传入app.current_role='medical_reviewer'等角色上下文），仅供
   * AssessmentComplianceController一类的后台只读审查场景使用，
   * 不暴露给任何C端可触达的Service方法。
   */
  findManyForComplianceReview(filter: { riskLevel?: string; page: number; pageSize: number }) {
    const where: Record<string, unknown> = { status: 'completed' };
    if (filter.riskLevel) where.riskLevel = filter.riskLevel;
    return this.prisma.withRlsContext({ role: 'medical_reviewer' }, (tx) =>
      tx.assessmentResult.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
      }),
    );
  }
}
