import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { tokens, Layout, sizes } from '../theme';
import { Continent, FlagDifficulty, DIFFICULTY_PIPS } from '../types';

interface MetaStripProps {
  questionIndex: number;
  totalQuestions: number;
  continent: Continent;
  difficulty: FlagDifficulty;
  layout: Layout;
  /** Local frame offset for entrance animation (0 = strip enters now). */
  entranceFrame: number;
}

/**
 * v3 meta strip — top-of-frame editorial header showing the question
 * counter, continent (as the "hint"), and a 4-pip difficulty meter.
 * Replaces v2's redundant "GUESS THE FLAG" bar; treats info like a
 * magazine breadcrumb instead of a banner ad.
 */
export const MetaStrip: React.FC<MetaStripProps> = ({
  questionIndex,
  totalQuestions,
  continent,
  difficulty,
  layout,
  entranceFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sizes(layout);
  const land = layout === 'landscape';

  const enter = spring({
    frame: frame - entranceFrame,
    fps,
    config: tokens.motion.snap,
  });
  const x = interpolate(enter, [0, 1], [-60, 0]);
  const o = interpolate(frame - entranceFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pips = DIFFICULTY_PIPS[difficulty];

  return (
    <div
      style={{
        position: 'absolute',
        top: s.safePad,
        left: s.safePad,
        right: s.safePad,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        opacity: o,
        transform: `translateX(${x}px)`,
        zIndex: 30,
      }}
    >
      {/* left cluster — counter + rule + continent */}
      <div style={{ display: 'flex', alignItems: 'center', gap: land ? 28 : 18 }}>
        <span
          style={{
            fontFamily: tokens.fonts.display,
            fontSize: s.metaTitle,
            color: tokens.colors.gold,
            letterSpacing: 2,
            lineHeight: 1,
          }}
        >
          {String(questionIndex).padStart(3, '0')}
        </span>
        <span
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: s.metaChip,
            color: tokens.colors.inkDim,
            letterSpacing: 4,
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          / {totalQuestions}
        </span>
        <span
          style={{
            display: 'inline-block',
            width: land ? 64 : 36,
            height: 1,
            background: tokens.colors.rule,
          }}
        />
        <span
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: s.metaChip,
            color: tokens.colors.paper,
            letterSpacing: 6,
            textTransform: 'uppercase',
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {continent}
        </span>
      </div>

      {/* right cluster — difficulty pips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: land ? 14 : 10 }}>
        <span
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: s.metaChip,
            color: tokens.colors.inkDim,
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginRight: land ? 12 : 8,
          }}
        >
          {difficulty}
        </span>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              width: land ? 14 : 10,
              height: land ? 14 : 10,
              borderRadius: 999,
              background: i < pips ? tokens.colors.gold : 'transparent',
              border: `1.5px solid ${
                i < pips ? tokens.colors.gold : tokens.colors.rule
              }`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
