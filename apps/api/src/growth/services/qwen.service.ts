import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class QwenService {
  private readonly logger = new Logger(QwenService.name);
  private readonly apiKey = process.env.DASHSCOPE_API_KEY ?? '';
  private readonly baseUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

  async complete(prompt: string, systemPrompt?: string, maxTokens = 2000): Promise<string> {
    try {
      const messages: any[] = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      messages.push({ role: 'user', content: prompt });

      const res = await axios.post(this.baseUrl, {
        model: 'qwen-turbo',
        input: { messages },
        parameters: { max_tokens: maxTokens, temperature: 0.7 },
      }, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      return res.data?.output?.text ?? res.data?.output?.choices?.[0]?.message?.content ?? '';
    } catch (err: any) {
      this.logger.error(`Qwen API error: ${err.message}`);
      return '';
    }
  }

  async summarizeArticle(title: string, content: string, topic: string): Promise<string> {
    const prompt = `请对以下${topic}相关文章进行中文摘要，提取核心观点，100字以内：\n\n标题：${title}\n\n内容：${content.slice(0, 2000)}`;
    return this.complete(prompt, '你是一个专业的健康科技行业分析师，擅长提炼行业洞察。');
  }

  async assessRelevance(title: string, summary: string, keywords: string[]): Promise<'high'|'medium'|'low'> {
    const prompt = `判断以下文章与关键词"${keywords.join('、')}"的相关性，只回复：high、medium 或 low\n\n标题：${title}\n摘要：${summary}`;
    const result = await this.complete(prompt);
    const r = result.trim().toLowerCase();
    if (r.includes('high')) return 'high';
    if (r.includes('low')) return 'low';
    return 'medium';
  }

  async generateReport(type: string, events: any[], period: string): Promise<{title:string;content:string;highlights:string[]}> {
    const eventList = events.slice(0, 20).map((e, i) => `${i+1}. ${e.title}${e.aiSummary ? '：' + e.aiSummary : ''}`).join('\n');
    const prompt = `基于以下${period}内收集到的${type}动态，生成一份专业的行业情报报告（Markdown格式，包含：执行摘要、重要事件分析、趋势洞察、对MATEYOU Ring1C的影响与建议）：\n\n${eventList}`;
    const content = await this.complete(prompt, '你是MATEYOU AI数字健康平台的战略分析师，专注于智能穿戴设备和数字健康领域。', 3000);

    const titlePrompt = `为以下报告生成一个简洁的中文标题（20字以内）：\n${content.slice(0, 200)}`;
    const title = await this.complete(titlePrompt) || `${type}情报报告 ${period}`;

    const highlightsPrompt = `从以下报告中提取3-5个最重要的洞察，每条30字以内，JSON数组格式返回：\n${content.slice(0, 1000)}`;
    let highlights: string[] = [];
    try {
      const h = await this.complete(highlightsPrompt);
      const match = h.match(/\[.*\]/s);
      if (match) highlights = JSON.parse(match[0]);
    } catch {}

    return { title: title.trim(), content, highlights };
  }
}
