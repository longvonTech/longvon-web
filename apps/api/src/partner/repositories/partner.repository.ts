import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PartnerRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filter?: { type?: string; contractStatus?: string }) {
    return this.prisma.partner.findMany({
      where: {
        type: filter?.type,
        contractStatus: filter?.contractStatus,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.partner.findUnique({
      where: { id },
      include: { convertedFromLead: true },
    });
  }

  /**
   * Lead → Partner转化，呼应Sprint目标"商业合作转化"环节。
   * 用事务保证"创建Partner"与"将Lead标记为converted"同时成功或同时失败，
   * 不允许出现"Partner已创建但Lead状态还停留在qualified"这种数据不一致的中间态。
   */
  convertFromLead(
    leadId: string,
    data: { companyName: string; type: string; contactInfo: Record<string, unknown>; region?: string },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const partner = await tx.partner.create({
        data: { ...data, convertedFromLeadId: leadId },
      });
      await tx.lead.update({ where: { id: leadId }, data: { status: 'converted' } });
      return partner;
    });
  }

  updateContractStatus(id: string, contractStatus: string) {
    return this.prisma.partner.update({ where: { id }, data: { contractStatus } });
  }
}
