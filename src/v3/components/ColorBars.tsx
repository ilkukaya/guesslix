import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { tokens } from '../theme';

interface ColorBarsProps {
  /** Three primary flag colors. */
  colors: readonly [string, string, string];
  /** Local frame where the bars start animating in. */
  startFrame: number;
  layout: 'landscape' | 'portrait';
}

/**
 * v3 color bars — at reveal, three thin vertical bars matching the flag's
 * primary palette grow from the bottom edge upward, staggered. Acts as a
 * visual "decoder" of the flag and gives the reveal a graphic punch
 * grounded in the flag's actual colors.
 */
export const ColorBars: React.FC<ColorBarsProps> = ({
  colors,
  startFrame,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const land = layout === 'landscape';
  const local = frame - startFrame;

  const barH = land ? 8 : 6;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        zIndex: 18,
      }}
    >
      {colors.map((c, i) => {
        const enter = spring({
          frame: local - i * 4,
          fps,
          config: tokens.motion.weighted,
        });
        const w = interpolate(enter, [0, 1], [0, 100]);
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: barH,
              background: c,
              transformOrigin: 'left center',
              transform: `scaleX(${w / 100})`,
              boxShadow: `0 -8px 32px ${c}66`,
            }}
          />
        );
      })}
    </div>
  );
};
