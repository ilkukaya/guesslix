/**
 * v3 design tokens — "Atlas" editorial cinematic system.
 *
 * Direction: editorial magazine feel (think National Geographic / Monocle)
 * meets motion-graphic punch. Replaces v2's neon TikTok palette with a
 * weighted, color-graded look that survives compression and feels premium
 * at any size.
 */
export const tokens = {
  colors: {
    /** Deep navy — primary canvas. Cooler than v2's bgDeep. */
    canvas: '#0B1024',
    /** Slightly lifted navy — used for ribbons, chips, ghost layers. */
    surface: '#141A36',
    /** Warm ivory — paper accent surfaces, anchors editorial vibe. */
    paper: '#F4ECDB',
    /** Brushed gold — primary highlight (replaces neon yellow). */
    gold: '#D4AF37',
    /** Brighter gold for type strokes. */
    goldHi: '#F0CE6A',
    /** Coral — used for time-running-out + difficulty heat. */
    coral: '#FF6F5C',
    /** Mint — correct/reveal pulse. */
    mint: '#7BD9A0',
    /** Pure white text. */
    ink: '#FFFFFF',
    /** Dim text — captions, meta. */
    inkDim: '#9AA0BD',
    /** Hairline rule color. */
    rule: 'rgba(244, 236, 219, 0.18)',
  },
  fonts: {
    /** Anton — heavy condensed display. Already in @remotion/google-fonts. */
    display: 'Anton, "Arial Black", sans-serif',
    /** Inter — body, captions, meta. */
    body: 'Inter, system-ui, sans-serif',
  },
  motion: {
    /** Heavy, weighted spring — premium feel. */
    weighted: { damping: 18, stiffness: 110, mass: 1 },
    /** Snap — fast UI accents. */
    snap: { damping: 14, stiffness: 220, mass: 0.6 },
    /** Soft — slow ambient drift. */
    soft: { damping: 22, stiffness: 60, mass: 1 },
  },
} as const;

export type Layout = 'landscape' | 'portrait';

/** Layout-specific size table. Single source of truth for v3 typography. */
export const sizes = (layout: Layout) => {
  const land = layout === 'landscape';
  return {
    countryLabel: land ? 200 : 140,
    countryLabelLight: land ? 110 : 78,
    metaChip: land ? 28 : 22,
    metaTitle: land ? 56 : 38,
    ghostNumber: land ? 920 : 780,
    timerCaption: land ? 24 : 18,
    funFact: land ? 32 : 22,
    introTitle: land ? 240 : 150,
    introKicker: land ? 36 : 26,
    introMeta: land ? 44 : 32,
    outroHead: land ? 200 : 130,
    outroSub: land ? 56 : 38,
    flagWidth: land ? 1080 : 880,
    flagHeight: land ? 720 : 587,
    safePad: land ? 96 : 64,
    rule: land ? 2 : 2,
  };
};
