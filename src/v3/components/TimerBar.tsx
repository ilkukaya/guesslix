import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { tokens, Layout, sizes } from '../theme';

interface TimerBarProps {
  /** Absolute frame the timer begins. */
  timerStartFrame: number;
  /** Duration in seconds. */
  seconds: number;
  layout: Layout;
}

/**
 * v3 timer bar — slim horizontal progress beneath the meta strip.
 * Drains right-to-left so the remaining segment reads as "time left".
 * Tints coral over the final second. Pairs with the GhostCountdown
 * which carries the numeric beat.
 */
export const TimerBar: React.FC<TimerBarProps> = ({
  timerStartFrame,
  seconds,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sizes(layout);
  const land = layout === 'landscape';

  const total = seconds * fps;
  const local = frame - timerStartFrame;
  if (local < 0) return null;

  const progress = Math.min(1, Math.max(0, local / total));
  const remaining = 1 - progress;
  const danger = progress >= 0.75;
  const fill = danger ? tokens.colors.coral : tokens.colors.gold;

  // tiny pulse on each second tick
  const intoSecond = local % fps;
  const pulse = interpolate(intoSecond, [0, 6], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: s.safePad + (land ? 96 : 78),
        left: s.safePad,
        right: s.safePad,
        height: land ? 6 : 5,
        zIndex: 25,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: tokens.colors.rule,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${remaining * 100}%`,
            background: fill,
            boxShadow: danger
              ? `0 0 18px ${tokens.colors.coral}AA`
              : `0 0 8px ${tokens.colors.gold}66`,
            transition: 'background 0.1s linear',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${remaining * 100}%`,
            transform: 'translateX(-50%)',
            width: land ? 14 : 10,
            height: '100%',
            background: fill,
            opacity: pulse * 0.8,
            filter: 'blur(2px)',
          }}
        />
      </div>
    </div>
  );
};
