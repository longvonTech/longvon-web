import { Injectable, Logger } from '@nestjs/common';
import { QwenService } from './qwen.service';
import { PrismaService } from '../../database/prisma.service';

export interface ImagePromptResult {
  articleId: string;
  articleTitle: string;
  prompts: {
    type: 'cover' | 'banner' | 'infographic' | 'feature';
    label: string;
    prompt_en: string;
    prompt_zh: string;
    ratio: string;
    style: string;
  }[];
}

@Injectable()
export class ImagePromptService {
  private readonly logger = new Logger(ImagePromptService.name);

  constructor(
    private readonly qwen: QwenService,
    private readonly prisma: PrismaService,
  ) {}

  async generatePromptsForArticle(articleId: string): Promise<ImagePromptResult | null> {
    try {
      const article = await this.prisma.article.findUnique({
        where: { id: articleId },
        select: { title: true, summary: true, content: true },
      });
      if (!article) return null;

      const prompt = `你是一位专业的AI图片提示词工程师。请为以下健康科普文章生成4种配图的提示词：

文章标题：${article.title}
文章摘要：${article.summary || ''}

请生成JSON格式的图片提示词列表，包含4种图片：
1. cover - 封面图（1200×630px）
2. banner - 横幅图（1920×480px）  
3. infographic - 信息图（800×1200px）
4. feature - 特色配图（800×600px）

每个提示词要求：
- prompt_en: 英文提示词（Midjourney/Stable Diffusion格式，详细描述画面内容、风格、光线）
- prompt_zh: 中文描述（说明图片内容）
- style: 风格（medical_illustration/data_visualization/lifestyle_photo/product_photo之一）

返回格式：
{
  "prompts": [
    {"type":"cover","label":"封面图","prompt_en":"...","prompt_zh":"...","ratio":"16:9","style":"medical_illustration"},
    {"type":"banner","label":"横幅图","prompt_en":"...","prompt_zh":"...","ratio":"4:1","style":"lifestyle_photo"},
    {"type":"infographic","label":"信息图","prompt_en":"...","prompt_zh":"...","ratio":"2:3","style":"data_visualization"},
    {"type":"feature","label":"特色图","prompt_en":"...","prompt_zh":"...","ratio":"4:3","style":"medical_illustration"}
  ]
}

只返回JSON。`;

      const result = await this.qwen.complete(prompt, '专业医疗健康内容视觉设计师', 2000);
      const match = result.match(/\{[\s\S]*\}/);
      if (!match) return null;

      const data = JSON.parse(match[0]);
      return {
        articleId,
        articleTitle: article.title,
        prompts: data.prompts || [],
      };
    } catch (err: any) {
      this.logger.error(`图片Prompt生成失败: ${err.message}`);
      return null;
    }
  }

  async generatePromptsForDrafts(limit = 5) {
    this.logger.log('🎨 F8 图片Prompt工厂启动');
    const drafts = await this.prisma.article.findMany({
      where: { status: 'draft' },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, title: true },
    });

    const results: ImagePromptResult[] = [];
    for (const draft of drafts) {
      const result = await this.generatePromptsForArticle(draft.id);
      if (result) results.push(result);
      await this.sleep(2000);
    }

    this.logger.log(`✅ F8 生成了 ${results.length} 篇文章的图片Prompt`);
    return results;
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
