import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../../theme';

interface TimerRingV2Props {
  /** Absolute frame where the 4-second timer starts. */
  timerStartFrame: number;
  /** Radius of the ring in px. */
  radius?: number;
  /** Stroke width in px. */
  strokeWidth?: number;
}

/** SVG circular countdown ring — 4 seconds, yellow→red on final second. */
export const TimerRingV2: React.FC<TimerRingV2Props> = ({
  timerStartFrame,
  radius = 100,
  strokeWidth = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TIMER_FRAMES = 4 * fps;
  const localFrame = frame - timerStartFrame;
  const progress = Math.min(1, Math.max(0, localFrame / TIMER_FRAMES));

  const circumference = 2 * Math.PI * radius;
  const dashOffset = progress * circumference;

  // Number countdown: 4→1
  const displayNumber = Math.max(1, Math.ceil(4 * (1 - progress)));

  // Ring color: yellow → red during last second
  const ringColor = interpolate(progress, [0.75, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const color = ringColor < 0.5
    ? theme.colors.accentPrimary
    : theme.colors.accentSecondary;

  // Number pulse: spring at the start of each second
  const frameWithinSecond = localFrame % fps;
  const pulseSpring = spring({
    frame: frameWithinSecond,
    fps,
    config: { damping: 8, stiffness: 300 },
  });
  const numScale = interpolate(pulseSpring, [0, 1], [1.25, 1]);

  const size = (radius + strokeWidth) * 2 + 4;

  return (
    <div
      style={{
        position: 'absolute',
        top: 36,
        left: '50%',
        transform: 'translateX(-50%)',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc — rotated so it depletes from top */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke 0.1s' }}
        />
      </svg>

      {/* Number */}
      <span
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: 96,
          color,
          lineHeight: 1,
          transform: `scale(${numScale})`,
          display: 'block',
          textShadow: `0 0 30px ${color}88`,
          zIndex: 1,
          position: 'relative',
        }}
      >
        {displayNumber}
      </span>
    </div>
  );
};
