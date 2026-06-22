import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactName, phone, score, riskLevel } = body;

    const riskLabel = riskLevel === 'high' ? '🔴 高风险' : riskLevel === 'moderate' ? '🟡 中风险' : '🟢 低风险';

    // 1. 存入leads数据库
    const res = await fetch('http://localhost:4000/partner-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactName,
        phone,
        remark: `[OSA自评] ${riskLabel}（${score}/8分）`,
        cooperationType: 'enterprise',
        sourcePage: '/assessment/osa',
      }),
    });
    if (!res.ok) throw new Error('leads API failed');

    // 2. 企业微信通知
    const webhook = process.env.WECOM_WEBHOOK_URL;
    if (webhook) {
      const msg = [
        '## 🫁 OSA风险自评 — 新用户留资',
        '',
        `**联系人：** ${contactName}`,
        `**电话：** ${phone}`,
        `**评估结果：** ${riskLabel}（${score}/8分）`,
        '',
        '> 来自 www.longvon.com/assessment/osa',
      ].join('\n');
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msgtype: 'markdown', markdown: { content: msg } }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
