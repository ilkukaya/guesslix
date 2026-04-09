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

  const anim = (delay: number) => {
    const s = spring({ frame, fps: FPS, delay, config: { damping: 14 } });
    return {
      opacity: interpolate(s, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
    };
  };

  // Subscribe button pulse
  const pulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [1, 1.08]);

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
      {Array.from({ length: 50 }, (_, i) => (
        <ConfettiParticle key={i} index={i} />
      ))}

      {/* Main CTA */}
      <div style={anim(0)}>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: C.gold,
            textShadow: `0 0 60px ${C.goldGlow}, 0 0 120px ${C.goldDim}`,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          How many did YOU
          <br />
          get right?
        </div>
      </div>

      <div style={anim(12)}>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: C.cyan,
            marginTop: 36,
            textShadow: `0 0 30px ${C.cyanGlow}`,
          }}
        >
          Comment your score below! 👇
        </div>
      </div>

      <div style={anim(24)}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: C.white,
            marginTop: 28,
          }}
        >
          Don't forget to SUBSCRIBE and LIKE! 🔔👍
        </div>
      </div>

      <div style={anim(36)}>
        <div
          style={{
            fontSize: 22,
            color: C.textSec,
            marginTop: 20,
            letterSpacing: 3,
            fontWeight: 700,
          }}
        >
          New quiz every day!
        </div>
      </div>

      {/* Subscribe button with pulse */}
      <div style={anim(48)}>
        <div
          style={{
            marginTop: 50,
            padding: "22px 70px",
            background: `linear-gradient(135deg, ${C.wrong} 0%, #FF1744 100%)`,
            borderRadius: 16,
            fontSize: 26,
            fontWeight: 900,
            color: C.white,
            letterSpacing: 5,
            transform: `scale(${pulse})`,
            boxShadow: `0 0 40px ${C.wrongGlow}, 0 6px 20px rgba(0,0,0,0.4)`,
          }}
        >
          SUBSCRIBE
        </div>
      </div>

      {/* Logo at bottom */}
      <div style={anim(60)}>
        <div
          style={{
            marginTop: 56,
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: 5,
            opacity: 0.6,
          }}
        >
          <span style={{ color: C.white }}>GUESS</span>
          <span style={{ color: C.cyan }}>LIX</span>
        </div>
      </div>
    </div>
  );
};
