import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "../themes/tokens";
import { FPS, PHASE } from "../types";

/* ===== OPTIONS GRID (supports 2 or 4 options) ===== */
interface OptionsProps {
  options: string[];
  revealState: "hidden" | "shown";
  correctIndex: number;
  isShort?: boolean;
}

const LETTERS = ["A", "B", "C", "D"];

export const OptionsGrid: React.FC<OptionsProps> = ({
  options,
  revealState,
  correctIndex,
  isShort,
}) => {
  const frame = useCurrentFrame();
  const isTwoOptions = options.length <= 2;

  // For 2 options: side by side row. For 4: 2x2 grid (long) or column (short)
  const gridCols = isTwoOptions
    ? "1fr 1fr"
    : isShort
      ? "1fr"
      : "1fr 1fr";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: gridCols,
        gap: isShort ? 14 : 18,
        width: isShort ? "85%" : isTwoOptions ? "60%" : "70%",
        margin: "0 auto",
        fontFamily: FONT,
      }}
    >
      {options.map((opt, i) => {
        const delay = i * 3;
        const enter = spring({ frame, fps: FPS, delay, config: { damping: 16 } });
        const scale = interpolate(enter, [0, 1], [0.85, 1]);
        const opacity = interpolate(enter, [0, 1], [0, 1]);

        const isCorrect = i === correctIndex;
        const revealed = revealState === "shown";

        let bg: string = C.border;
        let borderColor: string = "rgba(255,255,255,0.08)";
        let textColor: string = C.textSec;
        let shadow: string = "none";
        let dimmed = false;

        if (revealed) {
          if (isCorrect) {
            bg = C.correctDim;
            borderColor = C.correct;
            textColor = C.correct;
            shadow = `0 0 24px ${C.correctGlow}`;
          } else {
            dimmed = true;
          }
        }

        // For 2-option layout, make buttons bigger
        const padding = isTwoOptions
          ? isShort ? "24px 20px" : "28px 32px"
          : isShort ? "18px 20px" : "22px 28px";
        const fontSize = isTwoOptions
          ? isShort ? 28 : 30
          : isShort ? 22 : 26;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isTwoOptions ? "center" : "flex-start",
              gap: 14,
              padding,
              borderRadius: 14,
              background: bg,
              border: `1.5px solid ${borderColor}`,
              boxShadow: shadow,
              transform: `scale(${scale})`,
              opacity: dimmed ? 0.25 : opacity,
              transition: "all 0.3s ease",
            }}
          >
            {/* Letter badge */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: revealed && isCorrect
                  ? C.correctDim
                  : "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 900,
                color: revealed && isCorrect ? C.correct : C.textMuted,
                flexShrink: 0,
              }}
            >
              {LETTERS[i]}
            </div>
            <span
              style={{
                fontSize,
                fontWeight: 700,
                color: textColor,
                letterSpacing: 1,
              }}
            >
              {opt}
              {revealed && isCorrect ? " ✓" : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ===== FUN FACT OVERLAY ===== */
interface FunFactProps {
  funFact?: string;
  showFact: boolean;
}

export const FunFactOverlay: React.FC<FunFactProps> = ({ funFact, showFact }) => {
  const frame = useCurrentFrame();
  const revealFrames = PHASE.reveal;
  const factOpacity = showFact
    ? interpolate(frame, [revealFrames, revealFrames + 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const factY = showFact
    ? interpolate(frame, [revealFrames, revealFrames + 15], [20, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  if (!funFact || !showFact) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        zIndex: 80,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          marginTop: 220,
          maxWidth: 700,
          padding: "20px 30px",
          background: C.bgSurface,
          border: `1px solid ${C.borderCyan}`,
          borderRadius: 14,
          fontSize: 20,
          color: C.textSec,
          textAlign: "center",
          lineHeight: 1.5,
          opacity: factOpacity,
          transform: `translateY(${factY}px)`,
        }}
      >
        <span style={{ color: C.gold, marginRight: 8 }}>💡</span>
        {funFact}
      </div>
    </div>
  );
};
