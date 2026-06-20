import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAuthorById } from '../../../lib/knowledge-api';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const author = await getAuthorById(id).catch(() => null);
  if (!author) return { title: '作者未找到 | MATEYOU' };
  return { title: `${author.name} | MATEYOU 健康知识库` };
}

export default async function AuthorPage({ params }: Props) {
  const { id } = await params;
  const author = await getAuthorById(id).catch(() => null);
  if (!author) notFound();

  return (
    <main style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>{author!.name}</h1>
      {author!.title && <p style={{ color: '#888', marginTop: 4 }}>{author!.title}</p>}
      {author!.bio && <p style={{ marginTop: 16, lineHeight: 1.7, color: '#444' }}>{author!.bio}</p>}
    </main>
  );
}
