import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { tokens, Layout, sizes } from '../theme';
import { SoundFx } from './SoundFx';

interface IntroSceneProps {
  totalQuestions: number;
  layout: Layout;
}

/**
 * v3 intro — 90 frames (3s). Editorial title slate:
 *  · KICKER tag at top ("ATLAS · VOL. 197")
 *  · Display title GUESS · THE · FLAG split across three lines for impact
 *  · Subtitle meta strip with rule
 *  · Sweep wipe at the end transitions to question 1
 */
export const IntroScene: React.FC<IntroSceneProps> = ({
  totalQuestions,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sizes(layout);
  const land = layout === 'landscape';

  // Per-line spring entrances (staggered)
  const titleLines = ['GUESS', 'THE', 'FLAG'];

  const kicker = spring({ frame, fps, config: tokens.motion.snap });
  const kickerO = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const kickerY = interpolate(kicker, [0, 1], [-30, 0]);

  const sub = spring({ frame: frame - 50, fps, config: tokens.motion.weighted });
  const subO = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subY = interpolate(sub, [0, 1], [40, 0]);

  // exit wipe — last 12 frames a gold bar sweeps right across
  const wipeX = interpolate(frame, [78, 90], [-110, 110], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: s.safePad,
      }}
    >
      {/* kicker tag */}
      <div
        style={{
          opacity: kickerO,
          transform: `translateY(${kickerY}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: land ? 36 : 24,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 48,
            height: 1,
            background: tokens.colors.gold,
          }}
        />
        <span
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: s.introKicker,
            color: tokens.colors.gold,
            letterSpacing: 8,
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Atlas · Vol. {totalQuestions}
        </span>
        <span
          style={{
            display: 'inline-block',
            width: 48,
            height: 1,
            background: tokens.colors.gold,
          }}
        />
      </div>

      {/* stacked title */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: land ? -10 : -6 }}>
        {titleLines.map((line, i) => {
          const lineSpring = spring({
            frame: frame - 8 - i * 6,
            fps,
            config: tokens.motion.weighted,
          });
          const o = interpolate(frame, [8 + i * 6, 22 + i * 6], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(lineSpring, [0, 1], [60, 0]);
          const middle = i === 1;
          return (
            <span
              key={line}
              style={{
                fontFamily: tokens.fonts.display,
                fontSize: s.introTitle,
                lineHeight: 0.92,
                letterSpacing: land ? 6 : 3,
                color: middle ? 'transparent' : tokens.colors.paper,
                WebkitTextStroke: middle ? `2px ${tokens.colors.gold}` : 'none',
                opacity: o,
                transform: `translateY(${y}px)`,
                textShadow: middle
                  ? 'none'
                  : '0 6px 32px rgba(0,0,0,0.55)',
              }}
            >
              {line}
            </span>
          );
        })}
      </div>

      {/* subtitle */}
      <div
        style={{
          opacity: subO,
          transform: `translateY(${subY}px)`,
          marginTop: land ? 48 : 32,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: s.introMeta,
            color: tokens.colors.inkDim,
            letterSpacing: 3,
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          {totalQuestions} flags · 4 seconds each · how many?
        </span>
      </div>

      {/* exit wipe — paper bar sweeps right */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: tokens.colors.gold,
          transform: `translateX(${wipeX}%) skewX(-8deg)`,
          opacity: 0.95,
          pointerEvents: 'none',
        }}
      />

      <SoundFx src="audio/intro_boom.wav" from={0} volume={0.8} durationInFrames={75} />
      <SoundFx src="audio/whoosh.wav" from={78} volume={0.85} durationInFrames={30} />
    </AbsoluteFill>
  );
};
