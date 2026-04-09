import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont();

export const C = {
  bg: "#0A0E1A",
  bgLight: "#111833",
  bgSurface: "#151C36",
  cyan: "#00E5FF",
  cyanDim: "rgba(0,229,255,0.12)",
  cyanGlow: "rgba(0,229,255,0.35)",
  gold: "#FFD700",
  goldDim: "rgba(255,215,0,0.12)",
  goldGlow: "rgba(255,215,0,0.25)",
  correct: "#00FF88",
  correctDim: "rgba(0,255,136,0.10)",
  correctGlow: "rgba(0,255,136,0.25)",
  wrong: "#FF3366",
  wrongDim: "rgba(255,51,102,0.10)",
  wrongGlow: "rgba(255,51,102,0.25)",
  white: "#FFFFFF",
  textSec: "#C0C8D8",
  textMuted: "#5A6B8A",
  border: "rgba(255,255,255,0.06)",
  borderCyan: "rgba(0,229,255,0.15)",
} as const;

export const FONT = fontFamily;
