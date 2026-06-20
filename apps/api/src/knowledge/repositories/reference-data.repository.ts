import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * 四个结构相似的引用型实体（分类/标签/作者/医学审核专家）的Repository。
 * 它们都没有复杂的状态机或跨实体业务规则，因此放在同一文件中，
 * 但仍各自是独立的@Injectable，不合并成一个万能Repository类
 * （合并会让"分类的查询逻辑"和"医学审核专家的查询逻辑"耦合在一起，不利于独立演进）。
 */

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { children: true },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.category.findUnique({ where: { slug } });
  }

  findById(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  create(data: { name: string; slug: string; parentId?: string; description?: string; sortOrder?: number }) {
    return this.prisma.category.create({ data });
  }

  update(id: string, data: Partial<{ name: string; description: string; sortOrder: number; parentId: string | null }>) {
    return this.prisma.category.update({ where: { id }, data });
  }

  delete(id: string) {
    // 无deleted_at字段（呼应physical-database-freeze-v1.md，参考数据表未纳入软删除范围），
    // 直接物理删除；若该分类下仍有文章引用，FK的ON DELETE RESTRICT会在数据库层拒绝，
    // 由调用方（Service）捕获后转换为更友好的错误提示
    return this.prisma.category.delete({ where: { id } });
  }
}

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  findBySlug(slug: string) {
    return this.prisma.tag.findUnique({ where: { slug } });
  }

  findById(id: string) {
    return this.prisma.tag.findUnique({ where: { id } });
  }

  create(data: { name: string; slug: string }) {
    return this.prisma.tag.create({ data });
  }

  delete(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }
}

@Injectable()
export class AuthorRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.author.findMany({ orderBy: { name: 'asc' } });
  }

  findById(id: string) {
    return this.prisma.author.findUnique({ where: { id } });
  }

  create(data: { name: string; bio?: string; avatar?: string; title?: string; userId?: string }) {
    return this.prisma.author.create({ data });
  }

  update(id: string, data: Partial<{ name: string; bio: string; avatar: string; title: string }>) {
    return this.prisma.author.update({ where: { id }, data });
  }
}

@Injectable()
export class MedicalReviewerRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.medicalReviewer.findMany({ orderBy: { name: 'asc' } });
  }

  findById(id: string) {
    return this.prisma.medicalReviewer.findUnique({ where: { id } });
  }

  create(data: { name: string; credentials: string; licenseNo?: string; bio?: string; avatar?: string }) {
    return this.prisma.medicalReviewer.create({ data });
  }

  update(id: string, data: Partial<{ name: string; credentials: string; licenseNo: string; bio: string; avatar: string }>) {
    return this.prisma.medicalReviewer.update({ where: { id }, data });
  }
}
