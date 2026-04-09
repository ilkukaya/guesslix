import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "../themes/tokens";
import { FPS } from "../types";

// Deterministic pseudo-random
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

const CONFETTI_COLORS = [C.cyan, C.gold, C.correct, "#FF69B4", "#9B59B6", C.wrong];

const ConfettiParticle: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const x = rand(index * 7 + 1) * 100;
  const speed = rand(index * 13 + 3) * 1.2 + 0.4;
  const size = rand(index * 3 + 5) * 8 + 4;
  const rotation = frame * (rand(index * 17 + 9) * 6 - 3);
  const color = CONFETTI_COLORS[Math.floor(rand(index * 23 + 11) * CONFETTI_COLORS.length)];
  const delay = Math.floor(rand(index * 31 + 13) * 40);
  const drift = Math.sin(frame * 0.05 + index) * 15;

  const elapsed = Math.max(0, frame - delay);
  const y = -10 + elapsed * speed;
  const opacity = interpolate(elapsed, [0, 10, 250, 300], [0, 0.9, 0.6, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size * 0.6,
        background: color,
        borderRadius: 2,
        transform: `rotate(${rotation}deg) translateX(${drift}px)`,
        opacity,
      }}
    />
  );
};

export const OutroScreen: React.FC = () => {
  const frame = useCurrentFrame();

  // Staggered animations
  const anim = (delay: number) => {
    const s = spring({ frame, fps: FPS, delay, config: { damping: 14 } });
    return {
      opacity: interpolate(s, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
    };
  };

  // Subscribe button pulse
  const pulse = interpolate(
    Math.sin(frame * 0.12),
    [-1, 1],
    [1, 1.06]
  );

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
        overflow: "hidden",
      }}
    >
      {/* Confetti */}
      {Array.from({ length: 40 }, (_, i) => (
        <ConfettiParticle key={i} index={i} />
      ))}

      {/* Main CTA */}
      <div style={anim(0)}>
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            color: C.gold,
            textShadow: `0 0 50px ${C.goldGlow}`,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          How many did YOU get right?
        </div>
      </div>

      <div style={anim(10)}>
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: C.cyan,
            marginTop: 24,
            textShadow: `0 0 30px ${C.cyanGlow}`,
          }}
        >
          Comment your score below! 👇
        </div>
      </div>

      <div style={anim(20)}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: C.white,
            marginTop: 20,
          }}
        >
          Don't forget to SUBSCRIBE and LIKE! 🔔👍
        </div>
      </div>

      <div style={anim(30)}>
        <div
          style={{
            fontSize: 20,
            color: C.textMuted,
            marginTop: 14,
            letterSpacing: 2,
            fontWeight: 600,
          }}
        >
          New quiz every day!
        </div>
      </div>

      {/* Subscribe button with pulse */}
      <div style={anim(40)}>
        <div
          style={{
            marginTop: 44,
            padding: "18px 50px",
            background: `linear-gradient(135deg, ${C.wrong} 0%, #FF1744 100%)`,
            borderRadius: 14,
            fontSize: 20,
            fontWeight: 900,
            color: C.white,
            letterSpacing: 4,
            transform: `scale(${pulse})`,
            boxShadow: `0 0 30px ${C.wrongGlow}, 0 4px 15px rgba(0,0,0,0.3)`,
          }}
        >
          SUBSCRIBE
        </div>
      </div>

      {/* Logo at bottom */}
      <div style={anim(50)}>
        <div
          style={{
            marginTop: 50,
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 4,
            opacity: 0.5,
          }}
        >
          <span style={{ color: C.white }}>GUESS</span>
          <span style={{ color: C.cyan }}>LIX</span>
        </div>
      </div>
    </div>
  );
};
