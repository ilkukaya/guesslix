import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "../themes/tokens";
import { FPS } from "../types";

interface Props {
  finalScore: number;
  totalQuestions: number;
  correctCount: number;
  bestStreak: number;
}

export const OutroScreen: React.FC<Props> = ({
  finalScore,
  totalQuestions,
  correctCount,
  bestStreak,
}) => {
  const frame = useCurrentFrame();
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  const rank =
    accuracy >= 90 ? "GENIUS" :
    accuracy >= 70 ? "EXPERT" :
    accuracy >= 50 ? "SMART" : "BEGINNER";

  const topPct =
    accuracy >= 90 ? "1%" :
    accuracy >= 70 ? "10%" :
    accuracy >= 50 ? "30%" : "50%";

  // Staggered animations
  const anim = (delay: number) => {
    const s = spring({ frame, fps: FPS, delay, config: { damping: 14 } });
    return {
      opacity: interpolate(s, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
    };
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        zIndex: 80,
      }}
    >
      <div style={anim(0)}>
        <div style={{ fontSize: 18, color: C.textMuted, letterSpacing: 5, fontWeight: 700 }}>
          YOUR FINAL SCORE
        </div>
      </div>

      <div style={anim(8)}>
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            color: C.gold,
            textShadow: `0 0 60px ${C.goldGlow}`,
            marginTop: 8,
          }}
        >
          {finalScore.toLocaleString()}
        </div>
      </div>

      <div style={anim(16)}>
        <div style={{ fontSize: 28, color: C.cyan, fontWeight: 700, marginTop: 8 }}>
          🏆 Top {topPct} — {rank} level
        </div>
      </div>

      <div style={anim(24)}>
        <div style={{ fontSize: 20, color: C.textMuted, marginTop: 20 }}>
          Best streak: 🔥 {bestStreak} &nbsp;|&nbsp; Accuracy: {accuracy}% &nbsp;|&nbsp; {correctCount}/{totalQuestions} correct
        </div>
      </div>

      <div style={anim(32)}>
        <div
          style={{
            marginTop: 44,
            padding: "16px 40px",
            background: C.cyanDim,
            border: `2px solid ${C.cyan}`,
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 900,
            color: C.cyan,
            letterSpacing: 4,
          }}
        >
          SUBSCRIBE FOR MORE
        </div>
      </div>

      <div style={anim(40)}>
        <div style={{ fontSize: 18, color: C.textMuted, marginTop: 20, letterSpacing: 1 }}>
          Comment your score below! 👇
        </div>
      </div>
    </div>
  );
};
