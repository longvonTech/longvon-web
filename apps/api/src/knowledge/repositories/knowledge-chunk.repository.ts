import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * KnowledgeChunks本Sprint仅作为Article发布流程的副产物存在，
 * 不开放独立的Admin/Public Controller——本Sprint的"使用者"只有
 * ArticleService内部（发布时写入分片），没有任何前端页面或外部API
 * 需要单独查询/管理这些分片（它们是为未来RAG检索准备的中间数据，
 * 检索/管理界面属于AI Assistant Sprint的范围）。
 */
@Injectable()
export class KnowledgeChunkRepository {
  constructor(private readonly prisma: PrismaService) {}

  replaceForArticle(articleId: string, chunks: string[]) {
    return this.prisma.$transaction([
      this.prisma.knowledgeChunk.deleteMany({ where: { sourceArticleId: articleId } }),
      this.prisma.knowledgeChunk.createMany({
        data: chunks.map((contentChunk) => ({
          sourceArticleId: articleId,
          sourceType: 'article',
          contentChunk,
          // embedding字段不在此处出现：Prisma生成的Client对Unsupported类型字段
          // 不提供任何读写入口，这里物理上不可能给embedding赋值，见content-chunking.util.ts顶部说明
        })),
      }),
    ]);
  }

  countForArticle(articleId: string) {
    return this.prisma.knowledgeChunk.count({ where: { sourceArticleId: articleId } });
  }
}
