import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { theme, Layout } from '../../theme';

loadAnton();
loadInter();

interface IntroSceneV2Props {
  totalQuestions: number;
  layout: Layout;
}

/** 90-frame (3s) intro screen with title and subtitle. */
export const IntroSceneV2: React.FC<IntroSceneV2Props> = ({
  totalQuestions,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isLandscape = layout === 'landscape';

  // Title entrance
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const titleY = interpolate(titleSpring, [0, 1], [-120, 0]);
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Subtitle entrance — delayed
  const subtitleSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const subtitleY = interpolate(subtitleSpring, [0, 1], [80, 0]);
  const subtitleOpacity = interpolate(frame, [20, 38], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Mesh pulse for intro
  const pulseScale = 1 + Math.sin(frame / 12) * 0.02;

  const titleSize = isLandscape ? 200 : 130;
  const subtitleSize = isLandscape ? 48 : 34;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isLandscape ? 32 : 20,
        padding: 60,
      }}
    >
      {/* Background pulse blob */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, #2A1F6088 0%, transparent 70%)`,
          transform: `scale(${pulseScale})`,
          zIndex: 0,
        }}
      />

      {/* GUESS THE FLAG */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: titleSize,
            lineHeight: 1,
            background: `linear-gradient(135deg, ${theme.colors.accentPrimary}, #FFF176, ${theme.colors.accentPrimary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: 4,
            display: 'block',
            textTransform: 'uppercase',
          }}
        >
          GUESS THE FLAG
        </span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          transform: `translateY(${subtitleY}px)`,
          opacity: subtitleOpacity,
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.body,
            fontSize: subtitleSize,
            color: theme.colors.textPrimary,
            fontWeight: 400,
            letterSpacing: 1,
          }}
        >
          {totalQuestions} Countries · 4 Seconds Each · How Many Can You Get?
        </span>
      </div>

      {/* Whoosh on start */}
      {frame === 0 && (
        <Audio src={staticFile('audio/intro_whoosh.wav')} startFrom={0} volume={1} />
      )}
    </AbsoluteFill>
  );
};
