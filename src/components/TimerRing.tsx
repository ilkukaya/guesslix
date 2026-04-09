import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C, FONT } from "../themes/tokens";
import { FPS } from "../types";

interface Props {
  timerSeconds: number;
  startFrame: number;
}

export const TimerRing: React.FC<Props> = ({ timerSeconds, startFrame }) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;
  const totalFrames = timerSeconds * FPS;
  const progress = Math.min(elapsed / totalFrames, 1);
  const remaining = Math.max(Math.ceil(timerSeconds - elapsed / FPS), 0);

  // Circle math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * progress;

  // Color transitions
  const isWarning = remaining <= 3 && remaining > 1;
  const isCritical = remaining <= 1;
  const ringColor = isCritical ? C.wrong : isWarning ? C.gold : C.cyan;
  const glowColor = isCritical ? C.wrongGlow : isWarning ? C.goldGlow : C.cyanGlow;

  // Pulse effect in last 3 seconds
  const pulse = remaining <= 3
    ? interpolate(Math.sin(elapsed * 0.5), [-1, 1], [0.95, 1.08])
    : 1;

  // Number color
  const numColor = isCritical ? C.wrong : isWarning ? C.gold : C.white;

  if (progress >= 1) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: `translateX(-50%) scale(${pulse})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Outer glow ring */}
      <div
        style={{
          position: "absolute",
          width: 110,
          height: 110,
          borderRadius: "50%",
          boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`,
          opacity: remaining <= 3 ? 0.5 : 0.15,
        }}
      />

      <svg width={110} height={110} style={{ transform: "rotate(-90deg)" }}>
        {/* Background ring */}
        <circle
          cx={55}
          cy={55}
          r={radius}
          fill="none"
          stroke={C.borderCyan}
          strokeWidth={4}
        />
        {/* Progress ring */}
        <circle
          cx={55}
          cy={55}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke 0.3s" }}
        />
      </svg>

      {/* Number overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 110,
          height: 110,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          fontSize: 38,
          fontWeight: 900,
          color: numColor,
        }}
      >
        {remaining}
      </div>
    </div>
  );
};
