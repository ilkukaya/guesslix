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
import { theme, Layout } from '../../theme';

interface OutroSceneV2Props {
  layout: Layout;
}

/** 150-frame (5s) outro screen with score prompt and CTA. */
export const OutroSceneV2: React.FC<OutroSceneV2Props> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isLandscape = layout === 'landscape';

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const headlineScale = interpolate(headlineSpring, [0, 1], [0.6, 1]);
  const headlineOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const ctaSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const ctaY = interpolate(ctaSpring, [0, 1], [60, 0]);
  const ctaOpacity = interpolate(frame, [18, 35], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const subSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const subY = interpolate(subSpring, [0, 1], [40, 0]);
  const subOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const headlineSize = isLandscape ? 180 : 110;
  const ctaSize = isLandscape ? 64 : 44;
  const subSize = isLandscape ? 40 : 28;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isLandscape ? 32 : 22,
        padding: 60,
      }}
    >
      {/* Glow blob */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, #1E3A6088 0%, transparent 65%)`,
          zIndex: 0,
        }}
      />

      {/* WHAT'S YOUR SCORE? */}
      <div
        style={{
          transform: `scale(${headlineScale})`,
          opacity: headlineOpacity,
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: headlineSize,
            color: theme.colors.accentPrimary,
            letterSpacing: 3,
            lineHeight: 1,
            display: 'block',
            textTransform: 'uppercase',
            textShadow: `0 0 60px ${theme.colors.accentPrimary}66`,
          }}
        >
          WHAT'S YOUR SCORE?
        </span>
      </div>

      {/* Comment below */}
      <div
        style={{
          transform: `translateY(${ctaY}px)`,
          opacity: ctaOpacity,
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.body,
            fontSize: ctaSize,
            color: theme.colors.textPrimary,
            fontWeight: 600,
          }}
        >
          Comment below 👇
        </span>
      </div>

      {/* Subscribe */}
      <div
        style={{
          transform: `translateY(${subY}px)`,
          opacity: subOpacity,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.body,
            fontSize: subSize,
            color: theme.colors.textMuted,
          }}
        >
          Subscribe for more →
        </span>
        {/* Logo placeholder */}
        <div
          style={{
            background: theme.colors.bgElevated,
            border: `2px solid ${theme.colors.textMuted}44`,
            borderRadius: 12,
            padding: '10px 32px',
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: isLandscape ? 48 : 36,
              color: theme.colors.accentPrimary,
              letterSpacing: 2,
            }}
          >
            GUESSLIX
          </span>
        </div>
      </div>

      {frame === 0 && (
        <Audio src={staticFile('audio/outro.wav')} startFrom={0} volume={0.9} />
      )}
    </AbsoluteFill>
  );
};
