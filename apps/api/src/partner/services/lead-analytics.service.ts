import { Injectable } from '@nestjs/common';
import { LeadRepository } from '../repositories/lead.repository';
import { classifyLeadSource, LeadSourceCategory } from '../utils/lead-source-classifier.util';

export interface LeadSourceDashboard {
  totalLeads: number;
  bySource: Record<LeadSourceCategory, number>;
  byStatus: Record<string, number>;
}

@Injectable()
export class LeadAnalyticsService {
  constructor(private readonly repo: LeadRepository) {}

  async getSourceDashboard(): Promise<LeadSourceDashboard> {
    const [sourceFields, statusGroups] = await Promise.all([
      this.repo.findSourceFields(),
      this.repo.countByStatus(),
    ]);

    const bySource: Record<LeadSourceCategory, number> = {
      seo: 0,
      direct: 0,
      referral: 0,
      campaign: 0,
      ai_assistant: 0,
      assessment: 0,
    };
    for (const lead of sourceFields) {
      bySource[classifyLeadSource(lead)] += 1;
    }

    const byStatus: Record<string, number> = {};
    for (const group of statusGroups) {
      byStatus[group.status] = group._count._all;
    }

    return { totalLeads: sourceFields.length, bySource, byStatus };
  }
}
