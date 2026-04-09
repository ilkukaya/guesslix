import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C } from "../themes/tokens";

// Deterministic pseudo-random based on seed
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

const makeParticles = (count: number): Particle[] =>
  Array.from({ length: count }, (_, i) => ({
    x: rand(i * 7 + 1) * 100,
    y: rand(i * 13 + 3) * 100,
    size: rand(i * 3 + 5) * 2.5 + 1,
    speed: rand(i * 11 + 7) * 0.3 + 0.1,
    opacity: rand(i * 17 + 9) * 0.25 + 0.05,
    color: rand(i) > 0.6 ? C.gold : C.cyan,
  }));

const particles = makeParticles(25);

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bgLight} 100%)`,
      }}
    >
      {/* Subtle center glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.cyanDim} 0%, transparent 70%)`,
          opacity: interpolate(
            Math.sin(frame * 0.02),
            [-1, 1],
            [0.3, 0.6]
          ),
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => {
        const yOffset = ((frame * p.speed) % 110) - 5;
        const xDrift = Math.sin(frame * 0.015 + i) * 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x + xDrift}%`,
              top: `${((p.y + yOffset) % 105)}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              opacity: p.opacity,
            }}
          />
        );
      })}

      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${C.borderCyan} 1px, transparent 1px),
            linear-gradient(90deg, ${C.borderCyan} 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: 0.06,
        }}
      />
    </AbsoluteFill>
  );
};
