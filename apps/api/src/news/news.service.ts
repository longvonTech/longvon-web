import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@mateyou/database';
import { PrismaService } from '../database/prisma.service';
import { slugify } from '../knowledge/utils/slug.util';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';

export type NewsMediaItem = {
  type: 'image' | 'video';
  url: string;
  caption?: string;
};

function buildSlug(title: string, custom?: string): string {
  const base = custom ? slugify(custom) : slugify(title);
  if (base) return base;
  return `news-${Date.now().toString(36)}`;
}

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllForAdmin() {
    return this.prisma.news.findMany({
      orderBy: [{ updatedAt: 'desc' }],
    });
  }

  async findByIdForAdmin(id: string) {
    const item = await this.prisma.news.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('内容不存在');
    return item;
  }

  findPublishedList(page = 1, pageSize = 20) {
    const take = Math.min(pageSize, 50);
    const skip = (Math.max(page, 1) - 1) * take;
    return this.prisma.news.findMany({
      where: { status: 'published' },
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
      skip,
      take,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        coverImage: true,
        videoUrl: true,
        publishedAt: true,
      },
    });
  }

  async findPublishedBySlug(slug: string) {
    const item = await this.prisma.news.findFirst({
      where: { slug, status: 'published' },
    });
    if (!item) throw new NotFoundException('内容不存在或未发布');
    return item;
  }

  async create(dto: CreateNewsDto) {
    const slug = buildSlug(dto.title, dto.slug);
    const existing = await this.prisma.news.findUnique({ where: { slug } });
    if (existing) throw new ConflictException(`slug "${slug}" 已被使用`);

    return this.prisma.news.create({
      data: {
        title: dto.title,
        slug,
        summary: dto.summary,
        content: dto.content,
        coverImage: dto.coverImage,
        videoUrl: dto.videoUrl,
        media: JSON.parse(JSON.stringify(dto.media ?? [])) as Prisma.InputJsonValue,
        status: 'draft',
      },
    });
  }

  async update(id: string, dto: UpdateNewsDto) {
    await this.findByIdForAdmin(id);

    let slug: string | undefined;
    if (dto.slug !== undefined) {
      slug = buildSlug(dto.title ?? '', dto.slug);
      const existing = await this.prisma.news.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) throw new ConflictException(`slug "${slug}" 已被使用`);
    }

    return this.prisma.news.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(slug !== undefined && { slug }),
        ...(dto.summary !== undefined && { summary: dto.summary }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.coverImage !== undefined && { coverImage: dto.coverImage }),
        ...(dto.videoUrl !== undefined && { videoUrl: dto.videoUrl }),
        ...(dto.media !== undefined && {
          media: JSON.parse(JSON.stringify(dto.media)) as Prisma.InputJsonValue,
        }),
      },
    });
  }

  async publish(id: string) {
    const item = await this.findByIdForAdmin(id);
    if (!item.title?.trim() || !item.content?.trim()) {
      throw new BadRequestException('标题与正文不能为空');
    }
    return this.prisma.news.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: item.publishedAt ?? new Date(),
      },
    });
  }

  async unpublish(id: string) {
    await this.findByIdForAdmin(id);
    return this.prisma.news.update({
      where: { id },
      data: { status: 'draft' },
    });
  }

  async delete(id: string) {
    await this.findByIdForAdmin(id);
    await this.prisma.news.delete({ where: { id } });
    return { success: true };
  }
}
