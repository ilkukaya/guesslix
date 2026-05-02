import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../../theme';

interface CounterPillProps {
  /** 1-based question index */
  current: number;
  total: number;
  startFrame: number;
}

/** Question number pill with spring entrance animation. */
export const CounterPill: React.FC<CounterPillProps> = ({
  current,
  total,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 32,
        right: 40,
        transform: `scale(${scale})`,
        transformOrigin: 'top right',
        background: theme.colors.bgElevated,
        border: `2px solid ${theme.colors.accentPrimary}`,
        borderRadius: 999,
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        zIndex: 100,
      }}
    >
      <span
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: 32,
          color: theme.colors.accentPrimary,
          lineHeight: 1,
        }}
      >
        {current}
      </span>
      <span
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 22,
          color: theme.colors.textMuted,
          lineHeight: 1,
        }}
      >
        / {total}
      </span>
    </div>
  );
};
