import React from "react";
import { C, FONT } from "../themes/tokens";
import { BrandLogo } from "./BrandLogo";

/* ===== WATERMARK (colored, 26px) ===== */
export const Watermark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 26,
      right: 36,
      zIndex: 100,
    }}
  >
    <BrandLogo size={26} opacity={0.4} letterSpacing={3} showQuestion={false} glowIntensity={0} />
  </div>
);

/* ===== QUESTION COUNTER (28px) ===== */
interface QuestionCounterProps {
  current: number;
  total: number;
}

export const QuestionCounter: React.FC<QuestionCounterProps> = ({
  current,
  total,
}) => (
  <div
    style={{
      position: "absolute",
      top: 26,
      left: 40,
      fontFamily: FONT,
      fontSize: 28,
      fontWeight: 900,
      color: C.cyan,
      zIndex: 90,
      letterSpacing: 1,
    }}
  >
    {current}/{total}
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
