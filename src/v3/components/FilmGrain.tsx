import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

/**
 * v3 film grain — animated noise (3 fps stepping) at 5% opacity.
 * Animated grain is the difference between "fancy template" and "shot on film".
 */
export const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const stepped = Math.floor(frame / 3);
  const seed = random(`grain-${stepped}`);

  return (
    <AbsoluteFill
      style={{
        opacity: 0.05,
        pointerEvents: 'none',
        zIndex: 999,
        mixBlendMode: 'overlay',
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id={`v3-grain-${stepped}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed={Math.floor(seed * 1000)}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#v3-grain-${stepped})`} />
      </svg>
    </AbsoluteFill>
  );
};
