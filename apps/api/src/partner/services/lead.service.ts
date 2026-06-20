import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeadRepository, LeadListFilter, CreateLeadData } from '../repositories/lead.repository';
import { isValidTransition, LeadStatus } from '../utils/lead-status.util';

@Injectable()
export class LeadService {
  constructor(private readonly repo: LeadRepository) {}

  findManyForAdmin(filter: LeadListFilter) {
    return this.repo.findManyForAdmin(filter);
  }

  async findByIdForAdmin(id: string) {
    const lead = await this.repo.findByIdForAdmin(id);
    if (!lead) throw new NotFoundException('线索不存在');
    return lead;
  }

  /**
   * 公开提交入口——呼应TASK-104B"写入Leads表、记录来源"。
   * Honeypot字段非空直接拒绝（不写入数据库，也不返回任何"被识别为机器人"的明确提示，
   * 统一返回成功响应——这是防刷的标准做法：让机器人脚本无法通过响应差异分辨出
   * 自己是否被识别，否则脚本会针对性调整绕过检测）。
   */
  async createFromPublicForm(data: CreateLeadData & { website?: string }): Promise<{ submitted: boolean }> {
    const { website: honeypot, ...leadData } = data;
    if (honeypot) {
      return { submitted: true }; // 静默丢弃，不写库，不暴露判定逻辑
    }
    await this.repo.create(leadData);
    return { submitted: true };
  }

  /**
   * 状态变更——状态机校验是本方法存在的核心理由，呼应TASK-104D
   * "严格状态机，禁止跳转非法状态"。校验逻辑统一调用lead-status.util.ts，
   * 不在这里重新实现一套if/else。
   */
  async updateStatus(id: string, newStatus: LeadStatus) {
    const lead = await this.findByIdForAdmin(id);
    const currentStatus = lead.status as LeadStatus;

    if (!isValidTransition(currentStatus, newStatus)) {
      throw new BadRequestException(
        `不允许从状态 "${currentStatus}" 直接跳转到 "${newStatus}"`,
      );
    }

    return this.repo.updateStatus(id, newStatus);
  }

  async assign(id: string, userId: string) {
    await this.findByIdForAdmin(id);
    return this.repo.assign(id, userId);
  }

  /**
   * 添加跟进备注——呼应TASK-104E Lead Notes。
   * 备注本身不受状态机约束（即使Lead已是converted/lost终态，CRM Operator仍可能
   * 需要补充一条说明，比如"客户后续又联系询问续约"，因此不在这里限制只有
   * 特定状态才能加备注）。
   */
  async addNote(leadId: string, authorId: string, content: string) {
    await this.findByIdForAdmin(leadId);
    return this.repo.addNote(leadId, authorId, content);
  }

  /**
   * Lead → Partner转化的前置校验：只有qualified状态的Lead才允许发起转化，
   * 转化本身（创建Partner+将Lead.status改为converted）由PartnerService完成，
   * 这里只负责"能不能转化"的判断，不直接操作Partner表（避免Lead/Partner
   * 两个聚合根的写入逻辑混在同一个Service里，职责不清）。
   */
  async assertConvertible(leadId: string) {
    const lead = await this.findByIdForAdmin(leadId);
    if (lead.status !== 'qualified') {
      throw new ForbiddenException(
        `只有qualified状态的线索才能转化为合作伙伴，当前状态：${lead.status}`,
      );
    }
    return lead;
  }
}
