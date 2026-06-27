'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '../../../components/admin/AdminShell';

type NewsMediaItem = { type: 'image' | 'video'; url: string; caption?: string };

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  coverImage: string | null;
  videoUrl: string | null;
  media: NewsMediaItem[];
  status: string;
  publishedAt: string | null;
  updatedAt: string;
};

const emptyForm = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  coverImage: '',
  videoUrl: '',
  media: [] as NewsMediaItem[],
};

export default function AdminNewsPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<'cover' | 'video' | 'gallery'>('cover');

  const headers = { 'Content-Type': 'application/json', 'x-admin-token': token };

  async function loadList(t: string) {
    const res = await fetch('/api/admin/news', { headers: { 'x-admin-token': t } });
    if (res.status === 401) { router.push('/admin/login'); return; }
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);
    loadList(t);
  }, [router]);

  function showToast(ok: boolean, msg: string) {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 4000);
  }

  function startCreate() {
    setEditingId('new');
    setForm(emptyForm);
  }

  function startEdit(item: NewsItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      summary: item.summary ?? '',
      content: item.content,
      coverImage: item.coverImage ?? '',
      videoUrl: item.videoUrl ?? '',
      media: Array.isArray(item.media) ? item.media : [],
    });
  }

  async function save() {
    if (!form.title.trim() || !form.content.trim()) {
      showToast(false, '请填写标题和正文');
      return;
    }
    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      summary: form.summary || undefined,
      content: form.content,
      coverImage: form.coverImage || undefined,
      videoUrl: form.videoUrl || undefined,
      media: form.media,
    };
    const isNew = editingId === 'new';
    const res = await fetch(
      isNew ? '/api/admin/news' : `/api/admin/news/${editingId}`,
      { method: isNew ? 'POST' : 'PATCH', headers, body: JSON.stringify(payload) },
    );
    const json = await res.json();
    if (!res.ok) { showToast(false, json.message ?? '保存失败'); return; }
    showToast(true, isNew ? '已创建草稿' : '已保存');
    setEditingId(null);
    await loadList(token);
  }

  async function publish(id: string) {
    const res = await fetch(`/api/admin/news/${id}/publish`, { method: 'POST', headers });
    if (!res.ok) { showToast(false, '发布失败'); return; }
    showToast(true, '已发布');
    await loadList(token);
  }

  async function unpublish(id: string) {
    const res = await fetch(`/api/admin/news/${id}/unpublish`, { method: 'POST', headers });
    if (!res.ok) { showToast(false, '操作失败'); return; }
    showToast(true, '已撤回为草稿');
    await loadList(token);
  }

  async function remove(id: string) {
    if (!confirm('确定删除这条内容？')) return;
    const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE', headers: { 'x-admin-token': token } });
    if (!res.ok) { showToast(false, '删除失败'); return; }
    showToast(true, '已删除');
    if (editingId === id) setEditingId(null);
    await loadList(token);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(uploadTarget.current);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) { showToast(false, json.message ?? '上传失败'); return; }
      const target = uploadTarget.current;
      if (target === 'cover') setForm(f => ({ ...f, coverImage: json.url }));
      else if (target === 'video') setForm(f => ({ ...f, videoUrl: json.url }));
      else setForm(f => ({ ...f, media: [...f.media, { type: json.type, url: json.url }] }));
      showToast(true, '上传成功');
    } catch {
      showToast(false, '网络错误');
    } finally {
      setUploading(null);
    }
  }

  function triggerUpload(target: 'cover' | 'video' | 'gallery') {
    uploadTarget.current = target;
    fileRef.current?.click();
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6E6E73' }}>加载中...</p>
      </div>
    );
  }

  return (
    <AdminShell title="企业动态" subtitle="发布企业新闻、公告与资讯，支持文字、图片与视频">
      {toast && (
        <div style={{
          padding: '14px 20px', borderRadius: 12, marginBottom: 24,
          background: toast.ok ? '#F0FFF4' : '#FFF2F2',
          border: `1px solid ${toast.ok ? '#86EFAC' : '#FCA5A5'}`,
          color: toast.ok ? '#166534' : '#991B1B', fontSize: 14,
        }}>
          {toast.ok ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      <div style={{ background: '#EFF4FF', borderRadius: 12, padding: '16px 20px', marginBottom: 24, fontSize: 13, color: '#1e40af' }}>
        💡 在此发布企业信息：标题 + 正文为必填；可上传封面图、主视频及图集/视频附件。保存为草稿后点击「发布」即可在官网展示。
      </div>

      {!editingId ? (
        <>
          <div style={{ marginBottom: 20 }}>
            <button onClick={startCreate} type="button" style={btnPrimary}>+ 新建内容</button>
          </div>
          {items.length === 0 ? (
            <p style={{ color: '#6E6E73' }}>暂无内容，点击上方按钮创建第一条企业动态。</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map(item => (
                <div key={item.id} style={cardStyle}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 17, fontWeight: 600, color: '#1D1D1F' }}>{item.title}</span>
                      <span style={{
                        fontSize: 12, padding: '2px 8px', borderRadius: 20,
                        background: item.status === 'published' ? '#DCFCE7' : '#F3F4F6',
                        color: item.status === 'published' ? '#166534' : '#6B7280',
                      }}>
                        {item.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </div>
                    {item.summary && <p style={{ fontSize: 14, color: '#6E6E73', margin: '0 0 8px' }}>{item.summary}</p>}
                    <div style={{ fontSize: 12, color: '#AEAEB2' }}>
                      /news/{item.slug}
                      {item.publishedAt && ` · 发布于 ${new Date(item.publishedAt).toLocaleDateString('zh-CN')}`}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    {item.status === 'published' && (
                      <a href={`/news/${item.slug}`} target="_blank" rel="noreferrer" style={btnGhost}>预览</a>
                    )}
                    <button onClick={() => startEdit(item)} type="button" style={btnGhost}>编辑</button>
                    {item.status === 'published' ? (
                      <button onClick={() => unpublish(item.id)} type="button" style={btnGhost}>撤回</button>
                    ) : (
                      <button onClick={() => publish(item.id)} type="button" style={btnPrimarySm}>发布</button>
                    )}
                    <button onClick={() => remove(item.id)} type="button" style={btnDanger}>删除</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E5EA', padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 24px' }}>
            {editingId === 'new' ? '新建企业动态' : '编辑内容'}
          </h2>

          <Field label="标题 *">
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} placeholder="请输入标题" />
          </Field>
          <Field label="URL 别名（可选，留空自动生成）">
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inputStyle} placeholder="例如 product-launch-2025" />
          </Field>
          <Field label="摘要（列表页展示）">
            <textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} style={{ ...inputStyle, minHeight: 72 }} placeholder="一句话简介" />
          </Field>
          <Field label="正文 *">
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} style={{ ...inputStyle, minHeight: 200 }} placeholder="支持多段落，换行即分段" />
          </Field>

          <Field label="封面图片">
            <MediaRow
              url={form.coverImage}
              uploading={uploading === 'cover'}
              onUpload={() => triggerUpload('cover')}
              onClear={() => setForm(f => ({ ...f, coverImage: '' }))}
              isVideo={false}
            />
          </Field>

          <Field label="主视频（可选）">
            <MediaRow
              url={form.videoUrl}
              uploading={uploading === 'video'}
              onUpload={() => triggerUpload('video')}
              onClear={() => setForm(f => ({ ...f, videoUrl: '' }))}
              isVideo
            />
          </Field>

          <Field label="附件图集 / 视频">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
              {form.media.map((m, i) => (
                <div key={m.url} style={{ position: 'relative', width: 120 }}>
                  {m.type === 'video' ? (
                    <video src={m.url} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, background: '#000' }} />
                  ) : (
                    <img src={m.url} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                  )}
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, media: f.media.filter((_, j) => j !== i) }))}
                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, padding: '2px 6px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => triggerUpload('gallery')} disabled={uploading === 'gallery'} style={btnGhost}>
              {uploading === 'gallery' ? '上传中...' : '+ 添加图片/视频'}
            </button>
          </Field>

          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <button type="button" onClick={save} style={btnPrimary}>保存</button>
            <button type="button" onClick={() => setEditingId(null)} style={btnGhost}>取消</button>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1D1D1F', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  );
}

function MediaRow({
  url, uploading, onUpload, onClear, isVideo,
}: {
  url: string; uploading: boolean; onUpload: () => void; onClear: () => void; isVideo: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      {url && (
        isVideo
          ? <video src={url} controls style={{ maxWidth: 240, maxHeight: 140, borderRadius: 8 }} />
          : <img src={url} alt="" style={{ maxWidth: 160, maxHeight: 100, objectFit: 'cover', borderRadius: 8 }} />
      )}
      <button type="button" onClick={onUpload} disabled={uploading} style={btnGhost}>
        {uploading ? '上传中...' : url ? '更换' : '上传'}
      </button>
      {url && <button type="button" onClick={onClear} style={btnDanger}>清除</button>}
      {url && <span style={{ fontSize: 12, color: '#AEAEB2', wordBreak: 'break-all' }}>{url}</span>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', border: '1.5px solid #E5E5EA',
  borderRadius: 12, fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16, border: '1px solid #E5E5EA',
  padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap',
};

const btnPrimary: React.CSSProperties = {
  padding: '10px 20px', background: '#0066CC', color: '#fff', border: 'none',
  borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
};

const btnPrimarySm: React.CSSProperties = { ...btnPrimary, padding: '8px 16px', fontSize: 13 };

const btnGhost: React.CSSProperties = {
  padding: '8px 16px', background: '#F5F5F7', color: '#1D1D1F', border: '1px solid #E5E5EA',
  borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
};

const btnDanger: React.CSSProperties = {
  padding: '8px 16px', background: '#FFF2F2', color: '#991B1B', border: '1px solid #FCA5A5',
  borderRadius: 10, fontSize: 13, cursor: 'pointer',
};
