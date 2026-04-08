import React, { useEffect, useRef, ReactNode } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'purple' | 'blue' | 'emerald';
}

const glowColorMap = {
  purple: { base: 270, spread: 60 },
  blue: { base: 220, spread: 60 },
  emerald: { base: 160, spread: 60 },
};

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  glowColor = 'purple',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, []);

  const { base } = glowColorMap[glowColor];

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-3xl bg-white/[0.02] overflow-hidden ${className}`}
      style={{ padding: '2px' }}
    >
      {/* Border layer - radial gradient masked to border only */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(350px circle at var(--mx, 50%) var(--my, 50%), hsl(${base} 80% 60% / 0.7), transparent 70%)`,
          borderRadius: 'inherit',
        }}
      />

      {/* Inner background - covers everything except the 2px border */}
      <div className={`relative rounded-[calc(1.5rem-2px)] bg-[#0C0E1D] h-full z-10 ${className.includes('flex') ? '' : ''}`}>
        {/* Subtle static border visible when not hovered */}
        <div className="absolute inset-0 rounded-[inherit] border border-white/[0.06] pointer-events-none" />
        {children}
      </div>
    </div>
  );
};

export { SpotlightCard };
