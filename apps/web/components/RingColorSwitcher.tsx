'use client';
import { useState } from 'react';


const COLORS = [
  { id: 'white', label: '白色', hex: '#F0F0F0', img: '/images/ring1c/White-45-Left.jpg' },
  { id: 'pink',  label: '粉色', hex: '#E8A0A8', img: '/images/ring1c/Pink-45-Left.jpg'  },
  { id: 'blue',  label: '蓝色', hex: '#6B9ED2', img: '/images/ring1c/Blue-45-Left.jpg'  },
  { id: 'black', label: '黑色', hex: '#2C2C2E', img: '/images/ring1c/Black-45-Left.jpg' },
];

export function RingColorSwitcher() {
  const [active, setActive] = useState(0);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 420, height: 420, margin: '0 auto' }}>
        {COLORS.map((c, i) => (
          <div key={c.id} style={{ position: 'absolute', inset: 0, opacity: i === active ? 1 : 0, transition: 'opacity 0.5s ease' }}>
            <img src={c.img} alt={'Ring1C ' + c.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 28 }}>
        {COLORS.map((c, i) => (
          <button key={c.id} onClick={() => setActive(i)} aria-label={c.label} style={{ width: 24, height: 24, borderRadius: '50%', background: c.hex, border: i === active ? '2px solid #1D1D1F' : '2px solid transparent', outline: i === active ? '2px solid rgba(0,0,0,0.15)' : 'none', outlineOffset: 2, cursor: 'pointer', padding: 0, boxShadow: '0 0 0 1px rgba(0,0,0,0.12)', transition: 'all 0.2s' }} />
        ))}
      </div>
      <p style={{ fontSize: 13, color: '#6E6E73', marginTop: 10 }}>{COLORS[active].label} · Ring1C</p>
    </div>
  );
}
