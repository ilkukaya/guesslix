/** Design tokens for the v2 flag premium format. */
export const theme = {
  colors: {
    bgDeep: '#0A0E27',
    bgElevated: '#1A1F3A',
    accentPrimary: '#FFE600',
    accentSecondary: '#FF3D7F',
    accentCorrect: '#00E676',
    textPrimary: '#FFFFFF',
    textMuted: '#8B92B8',
  },
  fonts: {
    heading: 'Anton, sans-serif',
    body: 'Inter, sans-serif',
  },
  fontSizes: {
    landscape: {
      question: 96,
      answer: 140,
      counter: 200,
    },
    portrait: {
      question: 72,
      answer: 110,
      counter: 160,
    },
  },
} as const;

export type Layout = 'landscape' | 'portrait';
