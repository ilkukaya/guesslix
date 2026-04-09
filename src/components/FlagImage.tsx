import React from "react";
import { Img, spring, useCurrentFrame, interpolate } from "remotion";
import { C } from "../themes/tokens";
import { FPS } from "../types";

/**
 * Extract ISO 3166-1 alpha-2 country code from a flag emoji.
 * Flag emojis consist of two Regional Indicator Symbol Letters.
 * E.g. 🇯🇵 → "JP"
 */
export function emojiToCountryCode(emoji: string): string {
  const codePoints = [...emoji].map((c) => c.codePointAt(0) ?? 0);
  return codePoints
    .filter((cp) => cp >= 0x1f1e6 && cp <= 0x1f1ff)
    .map((cp) => String.fromCharCode(cp - 0x1f1e6 + 65))
    .join("");
}

interface FlagImageProps {
  emoji: string;
  size?: number;
}

export const FlagImage: React.FC<FlagImageProps> = ({ emoji, size = 200 }) => {
  const frame = useCurrentFrame();
  const code = emojiToCountryCode(emoji).toLowerCase();
  const src = `https://flagcdn.com/w320/${code}.png`;

  const s = spring({ frame, fps: FPS, config: { damping: 14 } });
  const scale = interpolate(s, [0, 1], [0.7, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1]);

  return (
    <div
      style={{
        marginTop: 30,
        display: "flex",
        justifyContent: "center",
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <Img
        src={src}
        width={size}
        style={{
          borderRadius: 12,
          boxShadow: `0 0 40px ${C.cyanGlow}, 0 4px 20px rgba(0,0,0,0.5)`,
          border: `2px solid ${C.borderCyan}`,
        }}
      />
    </div>
  );
};
