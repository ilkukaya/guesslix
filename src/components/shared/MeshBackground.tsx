import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { theme } from '../../theme';

/** Slowly animating radial blob mesh gradient — premium background effect. */
export const MeshBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const x1 = 30 + Math.sin(frame / 200) * 15;
  const y1 = 25 + Math.cos(frame / 180) * 12;
  const x2 = 70 + Math.cos(frame / 220) * 15;
  const y2 = 65 + Math.sin(frame / 190) * 12;
  const x3 = 50 + Math.sin(frame / 160) * 10;
  const y3 = 45 + Math.cos(frame / 240) * 10;

  return (
    <AbsoluteFill style={{ background: theme.colors.bgDeep }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <radialGradient id="blob1" cx={`${x1}%`} cy={`${y1}%`} r="35%">
            <stop offset="0%" stopColor="#4A3F8C" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4A3F8C" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob2" cx={`${x2}%`} cy={`${y2}%`} r="30%">
            <stop offset="0%" stopColor="#1A4060" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1A4060" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob3" cx={`${x3}%`} cy={`${y3}%`} r="25%">
            <stop offset="0%" stopColor="#3D1A5C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3D1A5C" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#blob1)" />
        <rect width="100" height="100" fill="url(#blob2)" />
        <rect width="100" height="100" fill="url(#blob3)" />
      </svg>
    </AbsoluteFill>
  );
};
