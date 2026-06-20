import { Injectable, NotFoundException } from '@nestjs/common';
import { PartnerRepository } from '../repositories/partner.repository';
import { LeadService } from './lead.service';
import { ConvertLeadToPartnerDto } from '../dto/partner-management.dto';

@Injectable()
export class PartnerService {
  constructor(
    private readonly repo: PartnerRepository,
    private readonly leadService: LeadService,
  ) {}

  findAll(filter?: { type?: string; contractStatus?: string }) {
    return this.repo.findAll(filter);
  }

  async findById(id: string) {
    const partner = await this.repo.findById(id);
    if (!partner) throw new NotFoundException('合作伙伴不存在');
    return partner;
  }

  /**
   * Sprint目标"商业合作转化"在代码里的落地点。
   * 先经LeadService确认该Lead处于qualified状态（状态机+业务前置条件的校验
   * 职责留在LeadService，本方法只负责拿到"已确认可转化"的Lead后执行转化动作），
   * 再调用Repository的事务方法同时创建Partner与更新Lead状态。
   */
  async convertFromLead(leadId: string, dto: ConvertLeadToPartnerDto) {
    await this.leadService.assertConvertible(leadId);
    return this.repo.convertFromLead(leadId, dto);
  }

  async updateContractStatus(id: string, contractStatus: string) {
    await this.findById(id);
    return this.repo.updateContractStatus(id, contractStatus);
  }
}
