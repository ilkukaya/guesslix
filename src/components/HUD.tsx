import React from "react";
import { C, FONT } from "../themes/tokens";

/* ===== WATERMARK ===== */
export const Watermark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 28,
      right: 36,
      fontFamily: FONT,
      fontSize: 18,
      fontWeight: 900,
      letterSpacing: 3,
      color: C.white,
      opacity: 0.3,
      zIndex: 100,
    }}
  >
    GUESSLIX
  </div>
);

/* ===== SCORE HUD ===== */
interface ScoreHUDProps {
  score: number;
  streak: number;
}

export const ScoreHUD: React.FC<ScoreHUDProps> = ({ score, streak }) => (
  <div
    style={{
      position: "absolute",
      top: 24,
      left: 40,
      right: 40,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: FONT,
      zIndex: 90,
    }}
  >
    {/* Streak */}
    <div
      style={{
        fontSize: 22,
        fontWeight: 900,
        color: C.gold,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {streak >= 5 ? "🔥" : streak > 0 ? "⚡" : ""}
      <span>{streak > 0 ? `${streak} streak` : ""}</span>
      {streak >= 5 && (
        <span
          style={{
            fontSize: 13,
            color: C.wrong,
            fontWeight: 700,
            marginLeft: 8,
            letterSpacing: 2,
          }}
        >
          ON FIRE!
        </span>
      )}
    </div>

    {/* Score */}
    <div style={{ fontSize: 22, fontWeight: 900, color: C.cyan }}>
      SCORE: {score.toLocaleString()}
    </div>
  </div>
);

/* ===== DIFFICULTY BAR ===== */
interface DiffBarProps {
  current: number;
  total: number;
}

export const DifficultyBar: React.FC<DiffBarProps> = ({ current, total }) => (
  <div
    style={{
      position: "absolute",
      bottom: 16,
      left: 40,
      right: 40,
      height: 4,
      background: "rgba(255,255,255,0.04)",
      borderRadius: 2,
      zIndex: 90,
    }}
  >
    <div
      style={{
        height: "100%",
        width: `${(current / total) * 100}%`,
        borderRadius: 2,
        background: `linear-gradient(90deg, ${C.correct}, ${C.gold}, ${C.wrong})`,
        transition: "width 0.4s ease",
      }}
    />
  </div>
);
