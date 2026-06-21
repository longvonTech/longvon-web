'use client';
import { useState, useEffect } from 'react';

const IMAGES = [
  '/images/ring1c/White-45-Left.jpg',
  '/images/ring1c/Pink-45-Left.jpg',
  '/images/ring1c/Blue-45-Left.jpg',
  '/images/ring1c/Black-45-Left.jpg',
];

export function HeroImage() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const handler = (e: any) => setActive(e.detail);
    window.addEventListener('ring-color-change', handler);
    return () => window.removeEventListener('ring-color-change', handler);
  }, []);
  return (
    <div style={{ position:'absolute', inset:0 }}>
      {IMAGES.map((src, i) => (
        <img key={src} src={src} alt="Ring1C" style={{
          position:'absolute', inset:0, width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center 30%',
          opacity: i===active ? 0.85 : 0,
          transition:'opacity 0.6s ease',
        }} />
      ))}
    </div>
  );
}
