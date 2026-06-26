import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface CrawledArticle {
  title: string;
  url: string;
  summary?: string;
  content?: string;
  publishedAt?: Date;
  source: string;
}

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);
  private readonly headers = {
    'User-Agent': 'MATEYOU-Bot/1.0 (health research; contact@longvon.com)',
  };

  async fetchPage(url: string): Promise<string> {
    try {
      const res = await axios.get(url, {
        headers: this.headers,
        timeout: 15000,
        responseType: 'text',
      });
      return res.data;
    } catch (err: any) {
      this.logger.warn(`Fetch failed: ${url} - ${err.message}`);
      return '';
    }
  }

  // ── PubMed E-utilities API（最可靠）─────────────────────
  async crawlPubMed(keyword: string): Promise<CrawledArticle[]> {
    try {
      // Step1: 搜索获取ID列表
      const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(keyword)}&retmax=6&sort=date&retmode=json`;
      const searchRes = await axios.get(searchUrl, { headers: this.headers, timeout: 10000 });
      const ids: string[] = searchRes.data?.esearchresult?.idlist ?? [];
      if (ids.length === 0) return [];

      await this.sleep(500);

      // Step2: 获取摘要
      const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&rettype=abstract&retmode=text`;
      const fetchRes = await axios.get(fetchUrl, { headers: this.headers, timeout: 15000 });
      const text: string = fetchRes.data ?? '';

      // 解析多篇文章
      const articles: CrawledArticle[] = [];
      const blocks = text.split(/\n\d+\. /).filter((b) => b.trim().length > 50);

      for (let i = 0; i < Math.min(blocks.length, ids.length); i++) {
        const block = blocks[i];
        const lines = block.split('\n').filter((l) => l.trim());
        const title = lines[0]?.trim();
        if (!title || title.length < 10) continue;

        const abstractMatch = block.match(/Abstract\n([\s\S]{50,1000}?)(?:\n\n|\nAuthor|$)/);
        const summary = abstractMatch
          ? abstractMatch[1].replace(/\n/g, ' ').trim()
          : lines.slice(1, 4).join(' ');

        articles.push({
          title: title.slice(0, 300),
          url: `https://pubmed.ncbi.nlm.nih.gov/${ids[i]}/`,
          summary: summary.slice(0, 800),
          source: 'PubMed',
        });
      }
      return articles;
    } catch (err: any) {
      this.logger.warn(`PubMed crawl failed: ${err.message}`);
      return [];
    }
  }

  // ── 健康科技RSS订阅 ─────────────────────────────────────
  async crawlHealthRss(feedUrl: string, sourceName: string): Promise<CrawledArticle[]> {
    const xml = await this.fetchPage(feedUrl);
    if (!xml) return [];

    const articles: CrawledArticle[] = [];
    const itemRegex = /<item>([\s\S]+?)<\/item>/g;
    let m;

    while ((m = itemRegex.exec(xml)) !== null) {
      const item = m[1];
      const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]{10,200}?)(?:\]\]>)?<\/title>/);
      const linkMatch = item.match(/<link>([^<]+)<\/link>/);
      const descMatch = item.match(
        /<description>(?:<!\[CDATA\[)?([\s\S]{0,500}?)(?:\]\]>)?<\/description>/,
      );
      const dateMatch = item.match(/<pubDate>([^<]+)<\/pubDate>/);

      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      const url = linkMatch ? linkMatch[1].trim() : '';
      const summary = descMatch
        ? descMatch[1]
            .replace(/<[^>]+>/g, '')
            .trim()
            .slice(0, 400)
        : '';
      const publishedAt = dateMatch ? new Date(dateMatch[1]) : undefined;

      if (title && title.length > 10) {
        articles.push({ title, url, summary, publishedAt, source: sourceName });
      }
    }
    return articles.slice(0, 10);
  }

  // ── 行业新闻：多源RSS ────────────────────────────────────
  async crawlIndustryNews(keywords: string[]): Promise<CrawledArticle[]> {
    const rssFeeds = [
      { url: 'https://www.digitalhealth.net/feed/', name: 'Digital Health News' },
      { url: 'https://www.healthcareitnews.com/news/rss', name: 'Healthcare IT News' },
      { url: 'https://hitconsultant.net/feed/', name: 'HIT Consultant' },
    ];

    const all: CrawledArticle[] = [];
    for (const feed of rssFeeds) {
      const articles = await this.crawlHealthRss(feed.url, feed.name);
      // 关键词过滤
      const filtered = articles.filter((a) => {
        const text = (a.title + ' ' + (a.summary ?? '')).toLowerCase();
        return keywords.some((kw) => text.includes(kw.toLowerCase().split(' ')[0]));
      });
      all.push(...(filtered.length > 0 ? filtered : articles.slice(0, 3)));
      await this.sleep(1000);
    }

    const seen = new Set<string>();
    return all
      .filter((a) => {
        if (seen.has(a.title)) return false;
        seen.add(a.title);
        return true;
      })
      .slice(0, 15);
  }

  // ── 竞品官网监控 ────────────────────────────────────────
  async crawlCompetitorSite(competitor: string): Promise<CrawledArticle[]> {
    const feeds: Record<string, { url: string; name: string; isRss: boolean }> = {
      oura: { url: 'https://ouraring.com/blog/feed/', name: 'Oura Blog', isRss: true },
      ringconn: {
        url: 'https://www.ringconn.com/blogs/news.atom',
        name: 'RingConn News',
        isRss: true,
      },
      ultrahuman: { url: 'https://www.ultrahuman.com/blog', name: 'Ultrahuman Blog', isRss: false },
      samsung_galaxy_ring: {
        url: 'https://news.samsung.com/global/tag/galaxy-ring',
        name: 'Samsung News',
        isRss: false,
      },
    };

    const feed = feeds[competitor];
    if (!feed) return [];

    if (feed.isRss) {
      return this.crawlHealthRss(feed.url, feed.name);
    }

    // HTML爬取
    const html = await this.fetchPage(feed.url);
    if (!html) return [];

    const articles: CrawledArticle[] = [];
    const linkRegex =
      /<a[^>]+href="(https?:\/\/[^"]+(?:blog|news|article)[^"]*)"[^>]*>([^<]{20,200})<\/a>/gi;
    let m;
    while ((m = linkRegex.exec(html)) !== null) {
      articles.push({ title: m[2].trim(), url: m[1], source: feed.name });
    }

    const seen = new Set<string>();
    return articles
      .filter((a) => {
        if (seen.has(a.title)) return false;
        seen.add(a.title);
        return true;
      })
      .slice(0, 8);
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
