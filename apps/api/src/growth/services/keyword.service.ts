import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GrowthRepository } from '../repositories/growth.repository';
import { QwenService } from './qwen.service';

// 预定义关键词宇宙种子
const KEYWORD_SEEDS = [
  // 核心产品词
  {
    cluster: '智能戒指',
    topic: 'smart_ring',
    keywords: [
      '智能戒指',
      '健康戒指',
      'smart ring',
      '智能可穿戴戒指',
      '睡眠监测戒指',
      'Ring1C',
      'Oura Ring',
      'Galaxy Ring',
    ],
  },
  // 睡眠主题
  {
    cluster: '睡眠健康',
    topic: 'sleep',
    keywords: [
      '睡眠监测',
      '睡眠质量',
      '深度睡眠',
      'REM睡眠',
      '睡眠障碍',
      '改善睡眠',
      '睡眠分析',
      '失眠原因',
    ],
  },
  // OSA主题
  {
    cluster: 'OSA睡眠呼吸暂停',
    topic: 'osa',
    keywords: [
      '睡眠呼吸暂停',
      'OSA筛查',
      '打鼾原因',
      'STOP-BANG量表',
      '睡眠呼吸暂停症状',
      'OSA风险',
      '呼吸暂停低通气',
    ],
  },
  // HRV主题
  {
    cluster: 'HRV心率变异性',
    topic: 'hrv',
    keywords: ['心率变异性', 'HRV监测', 'HRV正常值', '心率变异性意义', 'HRV与压力', '自主神经功能'],
  },
  // 血氧主题
  {
    cluster: '血氧健康',
    topic: 'spo2',
    keywords: ['血氧饱和度', 'SpO2正常值', '血氧低的危害', '夜间血氧监测', '血氧仪', '低氧血症'],
  },
  // 心脏健康
  {
    cluster: '心脏健康',
    topic: 'heart_health',
    keywords: ['心脏健康监测', '静息心率', '心率异常', '心脏病预防', '心率过快', '心率过慢'],
  },
  // 压力管理
  {
    cluster: '压力管理',
    topic: 'stress',
    keywords: ['压力监测', '压力指数', '慢性压力危害', '压力与睡眠', 'HRV压力', '减压方法'],
  },
  // 慢病管理
  {
    cluster: '慢病数字健康',
    topic: 'chronic_disease',
    keywords: ['糖尿病监测', '高血压管理', '慢病数字化', '可穿戴设备慢病', 'GLP-1减重'],
  },
  // 企业健康
  {
    cluster: '企业健康管理',
    topic: 'enterprise',
    keywords: ['员工健康管理', '企业健康福利', '职场健康', '企业体检', '健康管理平台'],
  },
];

@Injectable()
export class KeywordService {
  private readonly logger = new Logger(KeywordService.name);

  constructor(
    private readonly repo: GrowthRepository,
    private readonly qwen: QwenService,
  ) {}

  // ── F5: 每周一早上10点运行关键词发现 ────────────────────
  @Cron('0 10 * * 1')
  async runKeywordDiscovery() {
    this.logger.log('🔍 F5 关键词发现引擎启动');
    await this.discoverKeywords();
    await this.analyzeContentGaps();
    this.logger.log('✅ F5 关键词发现完成');
  }

  async discoverKeywords() {
    for (const seed of KEYWORD_SEEDS) {
      // 存入基础关键词
      for (const keyword of seed.keywords) {
        try {
          await this.repo.createKeywordOpportunity({
            keyword,
            cluster: seed.cluster,
            topic: seed.topic,
            intent: this.inferIntent(keyword),
            priority: this.inferPriority(keyword),
            contentGap: true,
          });
        } catch {
          // 重复关键词忽略
        }
      }

      // 用Qwen扩展关键词
      const expandPrompt = `你是中文SEO专家。基于以下种子关键词，生成20个相关的中文长尾关键词，这些词应该是用户在搜索健康信息时会使用的真实搜索词。
种子词：${seed.keywords.join('、')}
主题：${seed.cluster}

要求：
1. 以问题形式（如"xx是什么"、"xx怎么治"）
2. 症状描述词（如"xx的症状"）
3. 比较词（如"xx和xx的区别"）
4. 方法词（如"如何改善xx"）

只返回JSON数组，格式：["关键词1","关键词2",...]`;

      try {
        const result = await this.qwen.complete(expandPrompt);
        const match = result.match(/\[[\s\S]*\]/);
        if (match) {
          const expanded: string[] = JSON.parse(match[0]);
          for (const kw of expanded.slice(0, 20)) {
            if (kw && kw.length > 2 && kw.length < 50) {
              await this.repo
                .createKeywordOpportunity({
                  keyword: kw,
                  cluster: seed.cluster,
                  topic: seed.topic,
                  intent: this.inferIntent(kw),
                  priority: 'medium',
                  contentGap: true,
                })
                .catch(() => {});
            }
          }
        }
        await this.sleep(2000);
      } catch (err: any) {
        this.logger.warn(`关键词扩展失败: ${err.message}`);
      }
    }
  }

  async analyzeContentGaps() {
    // 获取所有关键词机会
    const opportunities = await this.repo.listKeywordOpportunities({
      status: 'discovered',
      limit: 200,
    });
    this.logger.log(`分析 ${opportunities.length} 个关键词的内容缺口`);

    // 标记高优先级内容缺口
    const highPriorityTopics = ['osa', 'hrv', 'spo2', 'sleep'];
    for (const opp of opportunities) {
      if (highPriorityTopics.includes(opp.topic ?? '') && opp.contentGap) {
        await this.repo.updateKeywordOpportunityStatus(opp.id, 'analyzed').catch(() => {});
      }
    }
  }

  async generateKeywordReport() {
    const total = await this.repo.countKeywordOpportunities();
    const opportunities = await this.repo.listKeywordOpportunities({ priority: 'high', limit: 20 });

    const reportPrompt = `基于以下关键词机会数据，生成SEO关键词分析报告：
总关键词数：${total}
高优先级关键词：${opportunities.map((o) => o.keyword).join('、')}

请分析：1.重点布局方向 2.内容缺口 3.本周建议优先创作的关键词及原因`;

    const content = await this.qwen.complete(reportPrompt, 'SEO专家', 2000);
    const now = new Date();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    await this.repo.createKeywordReport({
      reportType: 'weekly',
      periodStart: weekAgo,
      periodEnd: now,
      title: `关键词机会周报 ${now.toLocaleDateString('zh-CN')}`,
      content,
      newKeywords: total,
      opportunities: opportunities
        .slice(0, 10)
        .map((o) => ({ keyword: o.keyword, cluster: o.cluster, priority: o.priority })),
    });
  }

  private inferIntent(keyword: string): string {
    if (keyword.includes('什么') || keyword.includes('是什么') || keyword.includes('定义'))
      return 'informational';
    if (keyword.includes('怎么') || keyword.includes('如何') || keyword.includes('方法'))
      return 'informational';
    if (keyword.includes('价格') || keyword.includes('多少钱') || keyword.includes('购买'))
      return 'commercial';
    if (keyword.includes('推荐') || keyword.includes('哪个好') || keyword.includes('比较'))
      return 'commercial';
    return 'informational';
  }

  private inferPriority(keyword: string): string {
    const highPriority = ['智能戒指', 'Ring1C', 'OSA', 'HRV', '睡眠呼吸暂停', '血氧'];
    if (highPriority.some((h) => keyword.includes(h))) return 'high';
    if (keyword.length > 8) return 'medium';
    return 'low';
  }

  async triggerManual() {
    return this.runKeywordDiscovery();
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
