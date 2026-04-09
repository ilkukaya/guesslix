import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "../themes/tokens";
import { FPS } from "../types";

/* ===== OPTIONS GRID ===== */
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

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isShort ? "1fr" : "1fr 1fr",
        gap: isShort ? 14 : 18,
        width: isShort ? "85%" : "70%",
        margin: "0 auto",
        fontFamily: FONT,
      }}
    >
      {options.map((opt, i) => {
        // Stagger entrance
        const delay = i * 3;
        const enter = spring({ frame, fps: FPS, delay, config: { damping: 16 } });
        const scale = interpolate(enter, [0, 1], [0.85, 1]);
        const opacity = interpolate(enter, [0, 1], [0, 1]);

        // Reveal state
        const isCorrect = i === correctIndex;
        const revealed = revealState === "shown";

        let bg = C.border;
        let borderColor = "rgba(255,255,255,0.08)";
        let textColor = C.textSec;
        let shadow = "none";
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

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: isShort ? "18px 20px" : "22px 28px",
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

            {/* Option text */}
            <span
              style={{
                fontSize: isShort ? 22 : 26,
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

/* ===== ANSWER REVEAL OVERLAY ===== */
interface RevealProps {
  isCorrect: boolean;
  points: number;
  funFact?: string;
  showFact: boolean;
}

export const AnswerReveal: React.FC<RevealProps> = ({
  isCorrect,
  points,
  funFact,
  showFact,
}) => {
  const frame = useCurrentFrame();
  const pop = spring({ frame, fps: FPS, config: { damping: 10, mass: 0.6 } });
  const scale = interpolate(pop, [0, 1], [0.5, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);

  // Points float up
  const pointsY = interpolate(frame, [0, 40], [0, -40], {
    extrapolateRight: "clamp",
  });
  const pointsOpacity = interpolate(frame, [0, 10, 35, 45], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  // Fun fact fade
  const factOpacity = showFact
    ? interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp" })
    : 0;

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
        pointerEvents: "none",
      }}
    >
      {/* CORRECT / WRONG text */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: isCorrect ? C.correct : C.wrong,
          textShadow: `0 0 50px ${isCorrect ? C.correctGlow : C.wrongGlow}`,
          letterSpacing: 6,
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        {isCorrect ? "CORRECT!" : "WRONG!"}
      </div>

      {/* Points */}
      {isCorrect && (
        <div
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: C.gold,
            marginTop: 10,
            transform: `translateY(${pointsY}px)`,
            opacity: pointsOpacity,
          }}
        >
          +{points} pts
        </div>
      )}

      {/* Fun fact */}
      {funFact && showFact && (
        <div
          style={{
            marginTop: 40,
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
          }}
        >
          💡 {funFact}
        </div>
      )}
    </div>
  );
};
