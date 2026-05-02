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
import { tokens, Layout, sizes } from '../theme';

interface OutroSceneProps {
  totalQuestions: number;
  layout: Layout;
}

const TIERS = [
  { min: 0,   max: 50,  label: 'TOURIST',   note: 'Pack the maps. There’s a world to see.' },
  { min: 51,  max: 100, label: 'EXPLORER',  note: 'You’ve covered some ground.' },
  { min: 101, max: 150, label: 'CARTOGRAPHER', note: 'Solid atlas. Few people score here.' },
  { min: 151, max: 196, label: 'GEOGRAPHER', note: 'Top tier. You speak fluent flag.' },
  { min: 197, max: 197, label: 'ATLAS',     note: 'Perfect. We bow.' },
];

/**
 * v3 outro — 150 frames (5s). Score-tier ladder + a single CTA line.
 * No emojis, no neon. Editorial close: "WHAT'S YOUR SCORE?" headline,
 * a 5-tier leaderboard list as the playful payoff, and a closing
 * GUESSLIX wordmark stamp.
 */
export const OutroScene: React.FC<OutroSceneProps> = ({
  totalQuestions,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sizes(layout);
  const land = layout === 'landscape';

  const head = spring({ frame, fps, config: tokens.motion.weighted });
  const headO = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });
  const headY = interpolate(head, [0, 1], [50, 0]);

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
      {/* headline */}
      <div
        style={{
          opacity: headO,
          transform: `translateY(${headY}px)`,
          textAlign: 'center',
          marginBottom: land ? 48 : 32,
        }}
      >
        <span
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: s.introKicker,
            color: tokens.colors.gold,
            letterSpacing: 8,
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 16,
          }}
        >
          · Final Tally ·
        </span>
        <span
          style={{
            fontFamily: tokens.fonts.display,
            fontSize: s.outroHead,
            color: tokens.colors.paper,
            letterSpacing: land ? 4 : 2,
            lineHeight: 0.95,
            textShadow: '0 6px 28px rgba(0,0,0,0.5)',
          }}
        >
          WHAT’S YOUR SCORE?
        </span>
      </div>

      {/* tiered ladder */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: land ? 14 : 10,
          width: '100%',
          maxWidth: land ? 1100 : 880,
          marginBottom: land ? 56 : 32,
        }}
      >
        {TIERS.map((tier, i) => {
          const ent = spring({
            frame: frame - 18 - i * 6,
            fps,
            config: tokens.motion.snap,
          });
          const o = interpolate(frame, [18 + i * 6, 32 + i * 6], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const x = interpolate(ent, [0, 1], [-40, 0]);
          const range =
            tier.min === tier.max
              ? `${tier.min}/${totalQuestions}`
              : `${tier.min}–${Math.min(tier.max, totalQuestions)}`;
          return (
            <div
              key={tier.label}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: land ? 28 : 16,
                opacity: o,
                transform: `translateX(${x}px)`,
                paddingBottom: land ? 12 : 8,
                borderBottom: `1px solid ${tokens.colors.rule}`,
              }}
            >
              <span
                style={{
                  fontFamily: tokens.fonts.body,
                  fontSize: land ? 28 : 20,
                  color: tokens.colors.inkDim,
                  letterSpacing: 4,
                  width: land ? 140 : 100,
                  flexShrink: 0,
                }}
              >
                {range}
              </span>
              <span
                style={{
                  fontFamily: tokens.fonts.display,
                  fontSize: land ? 64 : 44,
                  color: tokens.colors.gold,
                  letterSpacing: 4,
                  lineHeight: 1,
                  flexShrink: 0,
                  width: land ? 360 : 240,
                }}
              >
                {tier.label}
              </span>
              <span
                style={{
                  fontFamily: tokens.fonts.body,
                  fontSize: land ? 26 : 18,
                  color: tokens.colors.paper,
                  fontStyle: 'italic',
                  flex: 1,
                }}
              >
                {tier.note}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div
        style={{
          opacity: interpolate(frame, [60, 75], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          display: 'flex',
          alignItems: 'center',
          gap: land ? 32 : 20,
        }}
      >
        <span
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: s.outroSub,
            color: tokens.colors.paper,
            fontWeight: 500,
            letterSpacing: 2,
          }}
        >
          Drop your score below.
        </span>
        <span
          style={{
            fontFamily: tokens.fonts.display,
            fontSize: land ? 56 : 40,
            color: tokens.colors.canvas,
            background: tokens.colors.gold,
            padding: land ? '12px 32px' : '8px 22px',
            letterSpacing: 6,
          }}
        >
          GUESSLIX
        </span>
      </div>

      {frame === 0 && (
        <Audio src={staticFile('audio/fanfare.wav')} volume={0.7} />
      )}
    </AbsoluteFill>
  );
};
