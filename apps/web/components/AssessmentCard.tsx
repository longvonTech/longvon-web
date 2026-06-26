import Link from 'next/link';

function WeightScaleIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <path
        d="M36 8v48M22 20h28M18 20c-4 0-7 3-7 7v2c0 4 3 7 7 7s7-3 7-7v-2c0-4-3-7-7-7zM54 20c-4 0-7 3-7 7v2c0 4 3 7 7 7s7-3 7-7v-2c0-4-3-7-7-7z"
        stroke="#9CA3AF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="18" cy="36" rx="10" ry="3" fill="#D1D5DB" />
      <ellipse cx="54" cy="36" rx="10" ry="3" fill="#D1D5DB" />
      <path d="M36 56v6" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 62h16" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export interface AssessmentCardProps {
  badge: string;
  title: string;
  description: string;
  duration: string;
  questions: string;
  href: string;
  headerColor?: string;
  accentColor?: string;
}

export function AssessmentCard({
  badge,
  title,
  description,
  duration,
  questions,
  href,
  headerColor = '#F3F0FA',
  accentColor = '#7B3FE4',
}: AssessmentCardProps) {
  return (
    <article
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: headerColor,
          minHeight: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            fontSize: 13,
            fontWeight: 600,
            color: '#6B7280',
          }}
        >
          {title}
        </span>
        <WeightScaleIcon />
        <span
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            fontSize: 11,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            color: '#fff',
            background: '#374151',
            padding: '4px 10px',
            borderRadius: 6,
          }}
        >
          {badge}
        </span>
      </div>

      <div style={{ padding: '24px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 10, lineHeight: 1.3 }}>
          {title}
        </h2>
        <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.65, flex: 1, marginBottom: 16 }}>
          {description}
        </p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <span
            style={{
              fontSize: 12,
              color: '#6B7280',
              background: '#F3F4F6',
              padding: '4px 12px',
              borderRadius: 20,
            }}
          >
            {duration}
          </span>
          <span
            style={{
              fontSize: 12,
              color: '#6B7280',
              background: '#F3F4F6',
              padding: '4px 12px',
              borderRadius: 20,
            }}
          >
            {questions}
          </span>
        </div>
        <Link
          href={href}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '14px 20px',
            background: accentColor,
            color: '#fff',
            borderRadius: 980,
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          开始自评
        </Link>
      </div>
    </article>
  );
}
