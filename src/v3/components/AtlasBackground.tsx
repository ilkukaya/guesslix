import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { tokens } from '../theme';

/**
 * v3 background — deep navy canvas with slow-drifting topographic-style
 * concentric arcs and a faint vignette. Replaces v2's bland mesh blobs
 * with something that reads as "atlas / map / cartography".
 */
export const AtlasBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 240) * 40;
  const drift2 = Math.cos(frame / 320) * 30;

  return (
    <AbsoluteFill style={{ background: tokens.colors.canvas }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <radialGradient id="atlas-vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#1B2548" stopOpacity="0.5" />
            <stop offset="60%" stopColor={tokens.colors.canvas} stopOpacity="0" />
            <stop offset="100%" stopColor="#04071A" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="atlas-glow-l" cx="20%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#2A3A78" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2A3A78" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="atlas-glow-r" cx="85%" cy="75%" r="45%">
            <stop offset="0%" stopColor="#5C2E66" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#5C2E66" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1920" height="1080" fill="url(#atlas-glow-l)" />
        <rect width="1920" height="1080" fill="url(#atlas-glow-r)" />

        {/* topographic concentric arcs — drift slowly */}
        <g
          stroke={tokens.colors.gold}
          strokeOpacity="0.05"
          strokeWidth="1"
          fill="none"
          transform={`translate(${drift}, ${drift2})`}
        >
          {Array.from({ length: 14 }, (_, i) => (
            <ellipse
              key={i}
              cx="960"
              cy="540"
              rx={200 + i * 95}
              ry={140 + i * 70}
            />
          ))}
        </g>

        <rect width="1920" height="1080" fill="url(#atlas-vignette)" />
      </svg>
    </AbsoluteFill>
  );
};
