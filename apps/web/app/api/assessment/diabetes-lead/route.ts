import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactName, phone, score, riskLevel } = body;

    const riskLabel =
      riskLevel === 'very_high' ? '🔴 高风险'
      : riskLevel === 'high' ? '🟠 较高风险'
      : riskLevel === 'moderate' ? '🟡 中风险'
      : '🟢 低风险';

    const res = await fetch('http://localhost:4000/partner-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactName,
        phone,
        remark: `[糖尿病自评] ${riskLabel}（${score}/20分）`,
        cooperationType: 'enterprise',
        sourcePage: '/assessment/diabetes',
      }),
    });
    if (!res.ok) throw new Error('leads API failed');

    const webhook = process.env.WECOM_WEBHOOK_URL;
    if (webhook) {
      const msg = [
        '## 🩸 糖尿病风险自评 — 新用户留资',
        '',
        `**联系人：** ${contactName}`,
        `**电话：** ${phone}`,
        `**评估结果：** ${riskLabel}（${score}/20分）`,
        '',
        '> 来自 www.longvon.com/assessment/diabetes',
      ].join('\n');
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msgtype: 'markdown', markdown: { content: msg } }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
