import React from "react";
import { Img, useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "../themes/tokens";
import { QuizQuestion, FPS, resolveType } from "../types";
import { FlagImage } from "./FlagImage";

interface Props {
  question: QuizQuestion;
  size: number; // image width
  enterDuration: number; // frames for enter phase
  isRevealed: boolean; // answer revealed
}

export const QuestionVisual: React.FC<Props> = ({
  question,
  size,
  enterDuration,
  isRevealed,
}) => {
  const frame = useCurrentFrame();
  const type = resolveType(question);
  const timerDuration = question.timerSeconds * FPS;
  const enterEnd = enterDuration;

  // Common spring entry
  const entrySpring = spring({ frame, fps: FPS, config: { damping: 14 } });
  const entryScale = interpolate(entrySpring, [0, 1], [0.7, 1]);
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1]);

  // Common image style
  const imgStyle: React.CSSProperties = {
    borderRadius: 14,
    boxShadow: `0 0 60px ${C.cyanGlow}, 0 0 120px rgba(0,229,255,0.12), 0 8px 30px rgba(0,0,0,0.6)`,
    border: `2px solid ${C.borderCyan}`,
  };

  switch (type) {
    /* ---- FLAG (existing) ---- */
    case "emoji_flag":
      if (!question.emoji) return null;
      return <FlagImage emoji={question.emoji} size={size} />;

    /* ---- IMAGE GUESS (logo, food, landmark...) ---- */
    case "image_guess":
      if (!question.imageUrl) return null;
      return (
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${entryScale})`,
            opacity: entryOpacity,
          }}
        >
          <Img src={question.imageUrl} width={size} style={imgStyle} />
        </div>
      );

    /* ---- EMOJI DECODE (🎬🦁👑) ---- */
    case "emoji_decode":
      if (!question.emojiClue) return null;
      return (
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${entryScale})`,
            opacity: entryOpacity,
          }}
        >
          <div
            style={{
              fontSize: size > 300 ? 120 : 100,
              filter: `drop-shadow(0 0 20px ${C.cyanGlow})`,
              letterSpacing: 8,
            }}
          >
            {question.emojiClue}
          </div>
        </div>
      );

    /* ---- TEXT ONLY ---- */
    case "text_only":
      return null; // No visual — QuestionCard shows bigger text

    /* ---- ZOOMED (zoom out over timer) ---- */
    case "zoomed": {
      if (!question.imageUrl) return null;
      const elapsed = Math.max(0, frame - enterEnd);
      const zoomScale = interpolate(elapsed, [0, timerDuration], [3.0, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const aspectHeight = size * 0.67;
      return (
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            opacity: entryOpacity,
          }}
        >
          <div
            style={{
              width: size,
              height: aspectHeight,
              borderRadius: 14,
              overflow: "hidden",
              border: `2px solid ${C.borderCyan}`,
              boxShadow: `0 0 60px ${C.cyanGlow}, 0 8px 30px rgba(0,0,0,0.6)`,
            }}
          >
            <Img
              src={question.imageUrl}
              width={size}
              style={{
                transform: `scale(${isRevealed ? 1 : zoomScale})`,
                transformOrigin: "center center",
              }}
            />
          </div>
        </div>
      );
    }

    /* ---- BLURRED (blur clears over timer) ---- */
    case "blurred": {
      if (!question.imageUrl) return null;
      const elapsed2 = Math.max(0, frame - enterEnd);
      const blurAmount = isRevealed
        ? 0
        : interpolate(elapsed2, [0, timerDuration], [30, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
      return (
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            opacity: entryOpacity,
          }}
        >
          <Img
            src={question.imageUrl}
            width={size}
            style={{ ...imgStyle, filter: `blur(${blurAmount}px)` }}
          />
        </div>
      );
    }

    /* ---- SILHOUETTE (black shape, reveals on answer) ---- */
    case "silhouette": {
      if (!question.imageUrl) return null;
      const brightness = isRevealed ? 1 : 0;
      return (
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${entryScale})`,
            opacity: entryOpacity,
          }}
        >
          <Img
            src={question.imageUrl}
            width={size}
            style={{
              ...imgStyle,
              filter: `brightness(${brightness})`,
              transition: "filter 0.4s ease",
            }}
          />
        </div>
      );
    }

    /* ---- FIND THE ODD (3x3 grid) ---- */
    case "find_odd": {
      if (!question.gridItems || question.gridItems.length < 9) return null;
      const cellSize = Math.floor(size / 3.5);
      return (
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${entryScale})`,
            opacity: entryOpacity,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
              padding: 12,
              background: C.bgSurface,
              borderRadius: 14,
              border: `1px solid ${C.borderCyan}`,
            }}
          >
            {question.gridItems.map((item, i) => {
              const isOdd = i === question.oddIndex;
              const highlighted = isRevealed && isOdd;
              const dimmed = isRevealed && !isOdd;
              return (
                <div
                  key={i}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: cellSize * 0.6,
                    borderRadius: 10,
                    background: highlighted
                      ? C.correctDim
                      : "rgba(255,255,255,0.03)",
                    border: highlighted
                      ? `2px solid ${C.correct}`
                      : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: highlighted ? `0 0 20px ${C.correctGlow}` : "none",
                    opacity: dimmed ? 0.3 : 1,
                    transform: highlighted ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {item.startsWith("http") ? (
                    <Img src={item} width={cellSize * 0.8} style={{ borderRadius: 6 }} />
                  ) : (
                    item
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    /* ---- TRUE/FALSE ---- */
    case "true_false":
      return null; // No special visual — handled by 2-option layout

    /* ---- COMPARISON (A vs B) ---- */
    case "comparison": {
      if (!question.itemA || !question.itemB) return null;
      const vsSpring = spring({ frame, fps: FPS, delay: 8, config: { damping: 10 } });
      const vsScale = interpolate(vsSpring, [0, 1], [0.3, 1]);
      const vsOpacity = interpolate(vsSpring, [0, 1], [0, 1]);
      const itemSize = Math.floor(size * 0.4);

      const renderItem = (
        item: { label: string; value?: string; imageUrl?: string },
        idx: number
      ) => {
        const isCorrectItem = idx === question.correctIndex;
        const glow = isRevealed && isCorrectItem;
        const dim = isRevealed && !isCorrectItem;
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              opacity: dim ? 0.35 : 1,
              transform: glow ? "scale(1.05)" : dim ? "scale(0.95)" : "scale(1)",
              transition: "all 0.3s ease",
            }}
          >
            {item.imageUrl && (
              <Img
                src={item.imageUrl}
                width={itemSize}
                style={{
                  borderRadius: 12,
                  border: glow ? `2px solid ${C.correct}` : `1px solid ${C.borderCyan}`,
                  boxShadow: glow ? `0 0 30px ${C.correctGlow}` : "none",
                }}
              />
            )}
            <div
              style={{
                fontSize: size > 300 ? 24 : 20,
                fontWeight: 900,
                color: glow ? C.correct : C.white,
                fontFamily: FONT,
                textAlign: "center",
              }}
            >
              {item.label}
            </div>
            {item.value && (
              <div
                style={{
                  fontSize: size > 300 ? 18 : 15,
                  color: C.textSec,
                  fontFamily: FONT,
                }}
              >
                {item.value}
              </div>
            )}
          </div>
        );
      };

      return (
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            opacity: entryOpacity,
          }}
        >
          {renderItem(question.itemA, 0)}
          <div
            style={{
              fontSize: size > 300 ? 48 : 36,
              fontWeight: 900,
              color: C.gold,
              textShadow: `0 0 30px ${C.goldGlow}`,
              fontFamily: FONT,
              transform: `scale(${vsScale})`,
              opacity: vsOpacity,
            }}
          >
            VS
          </div>
          {renderItem(question.itemB, 1)}
        </div>
      );
    }

    default:
      // Fallback: if unknown type and has emoji, try flag
      if (question.emoji) return <FlagImage emoji={question.emoji} size={size} />;
      if (question.imageUrl) {
        return (
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
            <Img src={question.imageUrl} width={size} style={imgStyle} />
          </div>
        );
      }
      return null;
  }
};
