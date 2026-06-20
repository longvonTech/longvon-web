import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CategoryRepository,
  TagRepository,
  AuthorRepository,
  MedicalReviewerRepository,
} from '../repositories/reference-data.repository';
import { slugify } from '../utils/slug.util';
import {
  CreateAuthorDto,
  CreateCategoryDto,
  CreateMedicalReviewerDto,
  CreateTagDto,
  UpdateAuthorDto,
  UpdateCategoryDto,
  UpdateMedicalReviewerDto,
} from '../dto/reference-data.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly repo: CategoryRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    if (!slug) {
      throw new ConflictException('无法从名称派生有效的slug，请手动指定slug');
    }
    const existing = await this.repo.findBySlug(slug);
    if (existing) {
      throw new ConflictException(`slug "${slug}" 已被使用`);
    }
    return this.repo.create({ ...dto, slug });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('分类不存在');
    return this.repo.update(id, dto);
  }

  async delete(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('分类不存在');
    try {
      return await this.repo.delete(id);
    } catch {
      // Prisma在违反FK RESTRICT约束时会抛出P2003，这里统一转换为更友好的业务错误，
      // 不把数据库底层错误码直接暴露给前端
      throw new ConflictException('该分类下仍有文章引用，无法删除，请先迁移或删除相关文章');
    }
  }
}

@Injectable()
export class TagService {
  constructor(private readonly repo: TagRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  async create(dto: CreateTagDto) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    if (!slug) throw new ConflictException('无法从名称派生有效的slug，请手动指定slug');
    const existing = await this.repo.findBySlug(slug);
    if (existing) throw new ConflictException(`slug "${slug}" 已被使用`);
    return this.repo.create({ ...dto, slug });
  }

  async delete(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('标签不存在');
    try {
      return await this.repo.delete(id);
    } catch {
      throw new ConflictException('该标签下仍有文章引用，无法删除');
    }
  }
}

@Injectable()
export class AuthorService {
  constructor(private readonly repo: AuthorRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  async findById(id: string) {
    const author = await this.repo.findById(id);
    if (!author) throw new NotFoundException('作者不存在');
    return author;
  }

  create(dto: CreateAuthorDto) {
    return this.repo.create(dto);
  }

  async update(id: string, dto: UpdateAuthorDto) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }
}

@Injectable()
export class MedicalReviewerService {
  constructor(private readonly repo: MedicalReviewerRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  async findById(id: string) {
    const reviewer = await this.repo.findById(id);
    if (!reviewer) throw new NotFoundException('医学审核专家不存在');
    return reviewer;
  }

  create(dto: CreateMedicalReviewerDto) {
    return this.repo.create(dto);
  }

  async update(id: string, dto: UpdateMedicalReviewerDto) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }
}
