import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface LeadListFilter {
  status?: string;
  cooperationType?: string;
  assignedTo?: string;
  page: number;
  pageSize: number;
}

export interface CreateLeadData {
  companyName?: string;
  contactName: string;
  phone: string;
  email?: string;
  position?: string;
  cooperationType: string;
  remark?: string;
  sourcePage?: string;
  sourceKeyword?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

@Injectable()
export class LeadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyForAdmin(filter: LeadListFilter) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (filter.status) where.status = filter.status;
    if (filter.cooperationType) where.cooperationType = filter.cooperationType;
    if (filter.assignedTo) where.assignedTo = filter.assignedTo;

    const [items, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
        include: { assignedUser: { select: { id: true, username: true } } },
      }),
      this.prisma.lead.count({ where }),
    ]);
    return { items, total };
  }

  findByIdForAdmin(id: string) {
    return this.prisma.lead.findFirst({
      where: { id, deletedAt: null },
      include: {
        assignedUser: { select: { id: true, username: true } },
        notes: { orderBy: { createdAt: 'desc' }, include: { author: { select: { id: true, username: true } } } },
        partner: true,
      },
    });
  }

  create(data: CreateLeadData) {
    return this.prisma.lead.create({ data });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.lead.update({ where: { id }, data: { status } });
  }

  assign(id: string, userId: string) {
    return this.prisma.lead.update({ where: { id }, data: { assignedTo: userId } });
  }

  addNote(leadId: string, authorId: string, content: string) {
    return this.prisma.leadNote.create({ data: { leadId, authorId, content } });
  }

  /**
   * 来源分类统计的数据来源——只取分类所需的最小字段集，不是把整张Leads表
   * 全字段拉到应用层（即使本Sprint数据量很小，这个克制也是面向未来量级的正确写法）。
   * 具体如何把这些原始字段归类为SEO/Direct/Referral/Campaign等类别，
   * 是业务判断逻辑，放在LeadAnalyticsService里，不在Repository层做。
   */
  findSourceFields() {
    return this.prisma.lead.findMany({
      where: { deletedAt: null },
      select: {
        utmSource: true,
        utmMedium: true,
        sourcePage: true,
        conversationId: true,
        assessmentResultId: true,
      },
    });
  }

  countByStatus() {
    return this.prisma.lead.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { _all: true },
    });
  }
}
