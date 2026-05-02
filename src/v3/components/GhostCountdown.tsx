import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { tokens, Layout, sizes } from '../theme';

interface GhostCountdownProps {
  /** Absolute frame the 4-second timer begins. */
  timerStartFrame: number;
  /** Total seconds. */
  seconds: number;
  layout: Layout;
}

/**
 * v3 countdown — full-frame ghost numerals (920px display) that morph
 * from 4→3→2→1 behind the flag. Each digit fades+scales in on the
 * second tick with a weighted spring; the final second tints coral and
 * pulses faster. Replaces v2's bottom timer ring (small + buried).
 */
export const GhostCountdown: React.FC<GhostCountdownProps> = ({
  timerStartFrame,
  seconds,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sizes(layout);

  const local = frame - timerStartFrame;
  if (local < 0 || local >= seconds * fps) return null;

  const secondIndex = Math.floor(local / fps);
  const intoSecond = local - secondIndex * fps;
  const display = seconds - secondIndex;
  const isFinal = display === 1;

  const enter = spring({
    frame: intoSecond,
    fps,
    config: tokens.motion.weighted,
  });
  const exit = interpolate(intoSecond, [fps - 8, fps - 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(enter, [0, 1], [0.7, 1]) * (isFinal ? 1.05 : 1);
  const opacity = interpolate(enter, [0, 1], [0, 0.16]) * exit;

  const color = isFinal ? tokens.colors.coral : tokens.colors.paper;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: tokens.fonts.display,
          fontSize: s.ghostNumber,
          color,
          opacity,
          lineHeight: 0.85,
          letterSpacing: -20,
          transform: `scale(${scale})`,
          textShadow: isFinal
            ? `0 0 80px ${tokens.colors.coral}55`
            : 'none',
        }}
      >
        {display}
      </span>
    </div>
  );
};
