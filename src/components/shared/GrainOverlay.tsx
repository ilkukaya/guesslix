import React from 'react';
import { AbsoluteFill } from 'remotion';

/** Static film grain texture at 4% opacity — Netflix-style depth. */
export const GrainOverlay: React.FC = () => (
  <AbsoluteFill
    style={{ opacity: 0.04, pointerEvents: 'none', zIndex: 999 }}
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <filter id="grain-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter)" />
    </svg>
  </AbsoluteFill>
);
