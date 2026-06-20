import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer || customer.deletedAt) {
      throw new NotFoundException('客户不存在');
    }

    // Sprint 1不返回membership/health相关聚合字段——
    // 这些数据归属Membership Domain/Health Domain，Customer模块只暴露
    // User Domain自身字段，呼应database-domain-model-v1.md第4部分"谁拥有谁消费"原则，
    // 即使技术上能在这里一次性JOIN查出来，也不在Customer Service里越界聚合。
    // （注：Customer模型本身不含密码等敏感字段，密码仅存在于后台User模型，
    // 此处无需做字段脱敏处理）
    return customer;
  }

  async updateProfile(customerId: string, dto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer || customer.deletedAt) {
      throw new NotFoundException('客户不存在');
    }

    return this.prisma.customer.update({
      where: { id: customerId },
      data: dto,
    });
  }
}
