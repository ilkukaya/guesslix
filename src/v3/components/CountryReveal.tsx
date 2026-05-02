import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { tokens, Layout, sizes } from '../theme';

interface CountryRevealProps {
  country: string;
  funFact: string;
  /** Local frame the reveal animation begins. */
  startFrame: number;
  layout: Layout;
}

/**
 * v3 country reveal — kinetic typography. The country name slams in
 * with a stacked treatment: a heavy outlined "ghost" word behind the
 * solid filled word, both arriving on slightly different timings to
 * create a mechanical-press feel. Underneath, a hairline rule and a
 * single-line fact in body text. Magazine, not banner.
 */
export const CountryReveal: React.FC<CountryRevealProps> = ({
  country,
  funFact,
  startFrame,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sizes(layout);
  const land = layout === 'landscape';
  const local = frame - startFrame;
  if (local < 0) return null;

  // Solid word — slams in on a weighted spring (with a tiny overshoot).
  const solid = spring({
    frame: local,
    fps,
    config: { damping: 12, stiffness: 140, mass: 1 },
  });
  const solidScale = interpolate(solid, [0, 1], [1.18, 1]);
  const solidOpacity = interpolate(local, [0, 6], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Outlined ghost word — drifts out from behind the solid word.
  const ghost = spring({
    frame: local - 4,
    fps,
    config: tokens.motion.weighted,
  });
  const ghostX = interpolate(ghost, [0, 1], [0, land ? 16 : 10]);
  const ghostY = interpolate(ghost, [0, 1], [0, land ? 14 : 8]);
  const ghostOpacity = interpolate(local, [4, 18], [0, 0.45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Rule + caption come last
  const meta = spring({
    frame: local - 14,
    fps,
    config: tokens.motion.snap,
  });
  const metaY = interpolate(meta, [0, 1], [20, 0]);
  const metaOpacity = interpolate(local, [14, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const upper = country.toUpperCase();

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: land ? s.safePad + 32 : s.safePad + 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 22,
        pointerEvents: 'none',
      }}
    >
      {/* stacked country name */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        {/* outlined ghost copy (behind) */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            fontFamily: tokens.fonts.display,
            fontSize: s.countryLabel,
            lineHeight: 0.9,
            letterSpacing: land ? 4 : 2,
            color: 'transparent',
            WebkitTextStroke: `2px ${tokens.colors.gold}`,
            opacity: ghostOpacity,
            transform: `translate(${ghostX}px, ${ghostY}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          {upper}
        </span>

        {/* solid copy */}
        <span
          style={{
            position: 'relative',
            fontFamily: tokens.fonts.display,
            fontSize: s.countryLabel,
            lineHeight: 0.9,
            letterSpacing: land ? 4 : 2,
            color: tokens.colors.paper,
            opacity: solidOpacity,
            transform: `scale(${solidScale})`,
            display: 'inline-block',
            textShadow: `0 4px 28px rgba(0,0,0,0.6)`,
            whiteSpace: 'nowrap',
          }}
        >
          {upper}
        </span>
      </div>

      {/* hairline rule + fact */}
      <div
        style={{
          marginTop: land ? 32 : 22,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: land ? 16 : 12,
          opacity: metaOpacity,
          transform: `translateY(${metaY}px)`,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: land ? 120 : 80,
            height: 1,
            background: tokens.colors.gold,
          }}
        />
        <span
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: s.funFact,
            color: tokens.colors.inkDim,
            fontStyle: 'italic',
            letterSpacing: 0.5,
            lineHeight: 1.35,
            maxWidth: land ? 1200 : 820,
            textAlign: 'center',
            padding: '0 24px',
          }}
        >
          {funFact}
        </span>
      </div>
    </div>
  );
};
