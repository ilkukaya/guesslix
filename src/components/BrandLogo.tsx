import React from "react";
import { FONT } from "../themes/tokens";

interface BrandLogoProps {
  size?: number;
  opacity?: number;
  letterSpacing?: number;
  showQuestion?: boolean;
  glowIntensity?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 40,
  opacity = 1,
  letterSpacing = 4,
  showQuestion = true,
  glowIntensity = 0.5,
}) => {
  const glowPx = Math.round(size * 0.4);
  const blueGlow =
    glowIntensity > 0
      ? `drop-shadow(0 0 ${glowPx}px rgba(33,150,243,${(0.35 * glowIntensity).toFixed(2)}))`
      : "none";
  const goldGlow =
    glowIntensity > 0
      ? `drop-shadow(0 0 ${Math.round(glowPx * 0.7)}px rgba(255,179,0,${(0.3 * glowIntensity).toFixed(2)}))`
      : "none";

  const clipStyle: React.CSSProperties = {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  };

  return (
    <span
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 900,
        fontStyle: "italic",
        letterSpacing,
        opacity,
        display: "inline-flex",
        alignItems: "baseline",
      }}
    >
      {/* GUESS — metallic silver gradient */}
      <span
        style={{
          background:
            "linear-gradient(180deg, #E8ECF4 0%, #FFFFFF 30%, #C8CCD4 55%, #A0A8B8 100%)",
          ...clipStyle,
        }}
      >
        GUESS
      </span>
      {/* LIX — blue gradient */}
      <span
        style={{
          background:
            "linear-gradient(180deg, #64B5F6 0%, #2196F3 40%, #1565C0 100%)",
          ...clipStyle,
          filter: blueGlow,
        }}
      >
        LIX
      </span>
      {/* ? — gold gradient */}
      {showQuestion && (
        <span
          style={{
            background:
              "linear-gradient(180deg, #FFD54F 0%, #FFB300 45%, #FF8F00 100%)",
            ...clipStyle,
            marginLeft: Math.round(size * 0.08),
            filter: goldGlow,
          }}
        >
          ?
        </span>
      )}
    </span>
  );
};
