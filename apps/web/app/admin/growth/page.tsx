'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GrowthDashboard() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [briefs, setBriefs] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [pubStats, setPubStats] = useState<any>(null);
  const [execBriefs, setExecBriefs] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [toast, setToast] = useState('');
  const [running, setRunning] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem('admin_token') ?? '';
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);
  }, []);



  useEffect(() => {
    if (!token) return;
    const h = { 'x-admin-token': token };
    fetch('/api/growth/dashboard/stats', { headers: h }).then(r => r.json()).then(setStats).catch(() => {});
    fetch('/api/growth/keywords/opportunities?limit=10&priority=high', { headers: h }).then(r => r.json()).then(setKeywords).catch(() => {});
    fetch('/api/growth/publishing/stats', { headers: h }).then(r => r.json()).then(setPubStats).catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!token || tab === 'overview') return;
    const h = { 'x-admin-token': token };
    if (tab === 'intelligence') {
      fetch('/api/growth/industry/events?limit=10', { headers: h }).then(r => r.json()).then(setEvents).catch(() => {});
      fetch('/api/growth/competitor/events?limit=10', { headers: h }).then(r => r.json()).then(setCompetitors).catch(() => {});
      fetch('/api/growth/research/papers?limit=8', { headers: h }).then(r => r.json()).then(setPapers).catch(() => {});
    }
    if (tab === 'content') {
      fetch('/api/growth/content/briefs?limit=10', { headers: h }).then(r => r.json()).then(setBriefs).catch(() => {});
      fetch('/api/growth/content/drafts?limit=10', { headers: h }).then(r => r.json()).then(setDrafts).catch(() => {});
    }
    if (tab === 'reports') {
      fetch('/api/growth/executive/briefs/recent?limit=5', { headers: h }).then(r => r.json()).then(setExecBriefs).catch(() => {});
    }
  }, [token, tab]);

  async function run(label: string, path: string) {
    setRunning(label);
    try {
      await fetch(`/api/growth${path}`, { method: 'POST', headers: { 'x-admin-token': token } });
      setToast(`✅ ${label} 已触发`);
      setTimeout(() => setToast(''), 3000);
    } catch { setToast('❌ 失败'); }
    setRunning('');
  }

  async function publish(id: string, title: string) {
    await fetch(`/api/growth/publishing/publish/${id}`, { method: 'POST', headers: { 'x-admin-token': token } });
    setDrafts(d => d.filter(a => a.id !== id));
    setPubStats((s: any) => s ? { ...s, draft: s.draft - 1, published: s.published + 1 } : s);
    setToast(`✅ "${title.slice(0,20)}" 已发布`);
    setTimeout(() => setToast(''), 3000);
  }

  const S = {
    card: { background: '#fff', borderRadius: 16, border: '1px solid #E5E5EA', padding: '20px 24px' } as React.CSSProperties,
    section: { background: '#fff', borderRadius: 16, border: '1px solid #E5E5EA', marginBottom: 20, overflow: 'hidden' } as React.CSSProperties,
    sh: { padding: '14px 20px', borderBottom: '1px solid #F0F0F0', fontWeight: 700, fontSize: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as React.CSSProperties,
    sb: { padding: '0 20px' } as React.CSSProperties,
    row: { padding: '10px 0', borderBottom: '1px solid #F5F5F7' } as React.CSSProperties,
  };

  const Btn = ({ label, path }: { label: string; path: string }) => (
    <button onClick={() => run(label, path)} disabled={running === label} style={{ padding: '6px 14px', background: running === label ? '#E5E5EA' : '#0066CC', color: running === label ? '#6E6E73' : '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
      {running === label ? '运行中...' : label}
    </button>
  );

  const Tag = ({ t, c }: { t: string; c?: string }) => {
    const bg: any = { high: '#FFF3E0', medium: '#E8F5E9', published: '#E8F5E9', pending: '#FFF3E0', draft: '#EFF4FF' };
    const fg: any = { high: '#E65100', medium: '#2E7D32', published: '#2E7D32', pending: '#E65100', draft: '#0066CC' };
    return <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: bg[c||t]||'#F5F5F7', color: fg[c||t]||'#6E6E73' }}>{t}</span>;
  };

  const TABS = ['overview','intelligence','content','publishing','reports'];
  const LABELS: any = { overview:'📊 总览', intelligence:'🔍 情报', content:'✍️ 内容', publishing:'🚀 发布', reports:'📋 日报' };

  if (!mounted) return <div style={{minHeight:'100vh',background:'#F5F5F7',display:'flex',alignItems:'center',justifyContent:'center'}}><p style={{color:'#6E6E73'}}>加载中...</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F7' }}>
      {toast && <div style={{ position: 'fixed', top: 60, right: 24, background: '#1D1D1F', color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: 14, zIndex: 999 }}>{toast}</div>}

      <header style={{ background: '#fff', borderBottom: '1px solid #E5E5EA', height: 52, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 20, position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontWeight: 800, fontSize: 15 }}>MATEYOU 增长驾驶舱</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '5px 14px', borderRadius: 8, border: 'none', background: tab === t ? '#0066CC' : 'transparent', color: tab === t ? '#fff' : '#6E6E73', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{LABELS[t]}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
          <a href="/" target="_blank" style={{ fontSize: 13, color: '#6E6E73' }}>官网</a>
          <a href="/admin/images" style={{ fontSize: 13, color: '#6E6E73' }}>图片</a>
          <button onClick={() => { localStorage.removeItem('admin_token'); router.push('/admin/login'); }} style={{ fontSize: 13, color: '#6E6E73', background: 'none', border: 'none', cursor: 'pointer' }}>退出</button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>

        {tab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { l:'行业事件', v: stats?.industryEventsToday, s:'今日', c:'#0066CC' },
                { l:'竞品动态', v: stats?.competitorEventsToday, s:'今日', c:'#FF9500' },
                { l:'医学论文', v: stats?.researchPapersWeek, s:'本周', c:'#34C759' },
                { l:'关键词库', v: stats?.keywordTotal, s:'总计', c:'#AF52DE' },
                { l:'内容简报', v: stats?.contentPending, s:'待处理', c:'#FF3B30' },
                { l:'草稿待发', v: pubStats?.draft, s:`已发布${pubStats?.published??0}篇`, c:'#1D1D1F' },
              ].map(({ l,v,s,c }) => (
                <div key={l} style={S.card}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: c }}>{v ?? '—'}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{l}</div>
                  <div style={{ fontSize: 12, color: '#6E6E73', marginTop: 2 }}>{s}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={S.section}>
                <div style={S.sh}>⚡ 引擎控制台</div>
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { l:'采集行业情报', p:'/intelligence/trigger/industry' },
                    { l:'采集竞品动态', p:'/intelligence/trigger/competitor' },
                    { l:'采集医学研究', p:'/intelligence/trigger/research' },
                    { l:'发现关键词', p:'/keywords/discover' },
                    { l:'生成内容简报', p:'/content/strategy/run' },
                    { l:'AI写文章', p:'/content/factory/run' },
                    { l:'生成CEO日报', p:'/executive/brief/run' },
                    { l:'SEO内链优化', p:'/seo/optimizer/run?type=links' },
                    { l:'SEO评分优化', p:'/seo/optimizer/run?type=seo' },
                  ].map(e => (
                    <div key={e.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F5F5F7', borderRadius: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{e.l}</span>
                      <Btn label={e.l} path={e.p} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={S.section}>
                <div style={S.sh}>🔑 高优先级关键词</div>
                <div style={S.sb}>
                  {keywords?.length > 0 ? keywords.map((k: any) => (
                    <div key={k.id} style={S.row}>
                      <div style={{ fontSize: 14 }}>{k.keyword}</div>
                      <div style={{ fontSize: 11, color: '#6E6E73', marginTop: 2 }}>{k.cluster}</div>
                    </div>
                  )) : <div style={{ padding: '20px 0', color: '#6E6E73' }}>加载中...</div>}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'intelligence' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={S.section}>
              <div style={S.sh}><span>📰 行业事件 ({events.length})</span><Btn label="采集行业情报" path="/intelligence/trigger/industry" /></div>
              <div style={S.sb}>
                {events.length > 0 ? events.map((e: any) => (
                  <div key={e.id} style={S.row}>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>{e.title}</div>
                    <div style={{ display: 'flex', gap: 6 }}><Tag t={e.topic} /><Tag t={e.relevance} c={e.relevance} /></div>
                    {e.aiSummary && <div style={{ fontSize: 11, color: '#6E6E73', marginTop: 4 }}>{e.aiSummary.slice(0,80)}</div>}
                  </div>
                )) : <div style={{ padding: '20px 0', color: '#6E6E73' }}>暂无数据，点击采集</div>}
              </div>
            </div>

            <div>
              <div style={{ ...S.section, marginBottom: 12 }}>
                <div style={S.sh}><span>🔍 竞品动态 ({competitors.length})</span><Btn label="采集竞品动态" path="/intelligence/trigger/competitor" /></div>
                <div style={S.sb}>
                  {competitors.length > 0 ? competitors.map((e: any) => (
                    <div key={e.id} style={S.row}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}><Tag t={e.competitor} /><Tag t={e.eventType} /></div>
                      <div style={{ fontSize: 13 }}>{e.title}</div>
                    </div>
                  )) : <div style={{ padding: '20px 0', color: '#6E6E73' }}>暂无数据</div>}
                </div>
              </div>

              <div style={S.section}>
                <div style={S.sh}><span>🔬 医学研究 ({papers.length})</span><Btn label="采集医学研究" path="/intelligence/trigger/research" /></div>
                <div style={S.sb}>
                  {papers.length > 0 ? papers.map((p: any) => (
                    <div key={p.id} style={S.row}>
                      <div style={{ fontSize: 13, marginBottom: 4 }}>{p.title.slice(0,80)}</div>
                      <Tag t={p.topic} />
                    </div>
                  )) : <div style={{ padding: '20px 0', color: '#6E6E73' }}>暂无数据</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'content' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={S.section}>
              <div style={S.sh}>
                <span>📋 内容简报 ({briefs.length})</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn label="生成内容简报" path="/content/strategy/run" />
                  <Btn label="AI写文章" path="/content/factory/run" />
                </div>
              </div>
              <div style={S.sb}>
                {briefs.length > 0 ? briefs.map((b: any) => (
                  <div key={b.id} style={S.row}>
                    <div style={{ fontSize: 14, marginBottom: 6 }}>{b.title}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Tag t={b.priority} c={b.priority} />
                      <Tag t={b.status} c={b.status} />
                      <Tag t={b.contentType} />
                    </div>
                  </div>
                )) : <div style={{ padding: '20px 0', color: '#6E6E73' }}>暂无简报</div>}
              </div>
            </div>

            <div style={S.section}>
              <div style={S.sh}><span>✍️ 文章草稿 ({drafts.length})</span></div>
              <div style={S.sb}>
                {drafts.length > 0 ? drafts.map((a: any) => (
                  <div key={a.id} style={{ ...S.row, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: '#6E6E73', marginTop: 2 }}>{a.createdAt ? new Date(a.createdAt).toLocaleDateString('zh-CN') : ''}</div>
                    </div>
                    <button onClick={() => publish(a.id, a.title)} style={{ padding: '5px 12px', background: '#34C759', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>发布</button>
                  </div>
                )) : <div style={{ padding: '20px 0', color: '#6E6E73' }}>暂无草稿</div>}
              </div>
            </div>
          </div>
        )}

        {tab === 'publishing' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { l:'草稿', v: pubStats?.draft, c:'#FF9500' },
                { l:'已发布', v: pubStats?.published, c:'#34C759' },
                { l:'已归档', v: pubStats?.archived, c:'#6E6E73' },
                { l:'总计', v: pubStats?.total, c:'#1D1D1F' },
              ].map(({ l,v,c }) => (
                <div key={l} style={S.card}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: c }}>{v ?? '—'}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={S.section}>
              <div style={S.sh}>🚀 已发布文章</div>
              <div style={S.sb}>
                <div style={{ padding: '20px 0', color: '#6E6E73', fontSize: 14 }}>切换到内容Tab可管理草稿并发布文章</div>
              </div>
            </div>
          </>
        )}

        {tab === 'reports' && (
          <div style={S.section}>
            <div style={S.sh}>
              <span>📋 CEO日报历史</span>
              <Btn label="生成CEO日报" path="/executive/brief/run" />
            </div>
            <div style={S.sb}>
              {execBriefs.length > 0 ? execBriefs.map((r: any) => (
                <div key={r.id} style={{ ...S.row, padding: '16px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{r.title}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Tag t={r.wecomPushed ? '已推送' : '未推送'} c={r.wecomPushed ? 'published' : 'medium'} />
                    </div>
                  </div>
                  {r.industrySection && <div style={{ fontSize: 13, color: '#6E6E73', lineHeight: 1.6 }}>{r.industrySection.slice(0,150)}...</div>}
                </div>
              )) : <div style={{ padding: '20px 0', color: '#6E6E73' }}>暂无日报，点击立即生成</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
