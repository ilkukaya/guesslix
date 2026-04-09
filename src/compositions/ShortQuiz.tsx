import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  spring,
  interpolate,
  Img,
  Audio,
  staticFile,
} from "remotion";
import { QuizData, QuizQuestion, FPS } from "../types";
import { C, FONT } from "../themes/tokens";
import { Background } from "../components/Background";
import { FlagImage } from "../components/FlagImage";
import { emojiToCountryCode } from "../components/FlagImage";

/* ================================================================
   SHORTS TIMING (frames @ 30fps)
   ================================================================ */
const S = {
  HOOK: 60, // 2s
  Q_ENTER: 9, // 0.3s
  Q_TIMER: 90, // 3s
  Q_REVEAL: 15, // 0.5s
  Q_TRANSITION: 6, // 0.2s
  CTA_MID: 30, // 1s
  OUTRO: 120, // 4s
};
const Q_TOTAL = S.Q_ENTER + S.Q_TIMER + S.Q_REVEAL + S.Q_TRANSITION; // 120 = 4s

/* ================================================================
   DIFFICULTY CONFIG
   ================================================================ */
const DIFF_BADGE: Record<string, { label: string; emoji: string; color: string }> = {
  easy: { label: "EASY", emoji: "🟢", color: "#00FF88" },
  medium: { label: "MEDIUM", emoji: "🟡", color: "#FFD700" },
  hard: { label: "HARD", emoji: "🔴", color: "#FF8C00" },
  impossible: { label: "IMPOSSIBLE", emoji: "💀", color: "#FF3366" },
};

// Animated gradient tints per difficulty (stronger for energy)
const DIFF_GRADIENT: Record<string, string> = {
  easy: "linear-gradient(180deg, rgba(0,255,136,0.06) 0%, rgba(10,14,26,0) 60%)",
  medium: "linear-gradient(180deg, rgba(255,215,0,0.06) 0%, rgba(10,14,26,0) 60%)",
  hard: "linear-gradient(180deg, rgba(255,140,0,0.08) 0%, rgba(10,14,26,0) 60%)",
  impossible: "linear-gradient(180deg, rgba(255,51,102,0.10) 0%, rgba(10,14,26,0) 60%)",
};

/* ================================================================
   HOOK — 2 seconds of pure energy
   ================================================================ */
const HOOK_FLAGS = ["jp", "br", "us", "gb", "de", "kr", "za", "tr", "fr", "au"];

const Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // Main text — explosive bounce
  const textSpring = spring({ frame, fps: FPS, config: { damping: 7, mass: 0.5 } });
  const textScale = interpolate(textSpring, [0, 1], [0.2, 1]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  // Text exits before hook ends
  const textExit = interpolate(frame, [44, 56], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Brain emoji pulse
  const brainPulse = interpolate(Math.sin(frame * 0.4), [-1, 1], [0.9, 1.2]);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* Rapid spinning flag collage — BIGGER, FASTER */}
      {HOOK_FLAGS.map((code, i) => {
        const speed = 5;
        const angle = (frame * speed + i * 36) % 360;
        const radius = 250 + (i % 3) * 160;
        const x = 540 + Math.cos((angle * Math.PI) / 180) * radius;
        const y = 960 + Math.sin((angle * Math.PI) / 180) * radius;
        const rot = frame * 3 + i * 36;
        const flagOpacity = interpolate(frame, [0, 8], [0, 0.35], {
          extrapolateRight: "clamp",
        });
        return (
          <Img
            key={code}
            src={`https://flagcdn.com/w160/${code}.png`}
            width={140}
            style={{
              position: "absolute",
              left: x - 70,
              top: y - 47,
              transform: `rotate(${rot}deg)`,
              opacity: flagOpacity,
              borderRadius: 8,
            }}
          />
        );
      })}

      {/* Central glow burst */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.cyanDim} 0%, transparent 70%)`,
          opacity: interpolate(frame, [0, 10], [0, 0.6], { extrapolateRight: "clamp" }),
        }}
      />

      {/* Hook text — BIG */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          zIndex: 10,
        }}
      >
        <div
          style={{
            transform: `scale(${textScale})`,
            opacity: textOpacity * textExit,
            textAlign: "center",
            paddingLeft: 30,
            paddingRight: 30,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: C.white,
              textShadow: `0 0 40px rgba(0,0,0,0.9), 0 0 80px ${C.cyanGlow}`,
              lineHeight: 1.2,
            }}
          >
            CAN YOU GUESS
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: C.gold,
              textShadow: `0 0 50px ${C.goldGlow}, 0 0 100px ${C.goldDim}`,
              lineHeight: 1.2,
              marginTop: 4,
            }}
          >
            ALL 4?
          </div>
          <div
            style={{
              fontSize: 64,
              marginTop: 12,
              transform: `scale(${brainPulse})`,
            }}
          >
            🧠
          </div>
        </div>
      </div>

      <Audio src={staticFile("audio/whoosh.wav")} volume={0.5} />
    </AbsoluteFill>
  );
};

/* ================================================================
   SHORTS OPTIONS — custom inline (not OptionsGrid, full control)
   ================================================================ */
const LETTERS = ["A", "B", "C", "D"];

const ShortsOptions: React.FC<{
  options: string[];
  revealState: "hidden" | "shown";
  correctIndex: number;
  parentFrame: number;
}> = ({ options, revealState, correctIndex, parentFrame }) => {
  const revealed = revealState === "shown";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: "100%",
        paddingLeft: 40,
        paddingRight: 40,
        fontFamily: FONT,
      }}
    >
      {options.map((opt, i) => {
        // Stagger slide-in from left
        const delay = i * 2;
        const enterFrame = Math.max(0, parentFrame - delay);
        const enterSpring = spring({
          frame: enterFrame,
          fps: FPS,
          config: { damping: 16 },
        });
        const slideX = interpolate(enterSpring, [0, 1], [-200, 0]);
        const enterOpacity = interpolate(enterSpring, [0, 1], [0, 1]);

        const isCorrect = i === correctIndex;

        // Reveal animations
        let bg: string = "rgba(255,255,255,0.06)";
        let borderColor: string = "rgba(255,255,255,0.08)";
        let textColor: string = C.textSec;
        let shadow: string = "none";
        let scale = 1;
        let dimOpacity = 1;

        if (revealed) {
          if (isCorrect) {
            bg = C.correctDim;
            borderColor = C.correct;
            textColor = C.correct;
            shadow = `0 0 20px ${C.correctGlow}`;
            scale = 1.04;
          } else {
            scale = 0.92;
            dimOpacity = 0.25;
          }
        }

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "18px 22px",
              borderRadius: 14,
              background: bg,
              border: `1.5px solid ${borderColor}`,
              boxShadow: shadow,
              transform: `translateX(${slideX}px) scale(${scale})`,
              opacity: enterOpacity * dimOpacity,
              transition: revealed ? "all 0.2s ease" : "none",
            }}
          >
            {/* Letter badge */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: revealed && isCorrect ? C.correctDim : "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 900,
                color: revealed && isCorrect ? C.correct : C.textMuted,
                flexShrink: 0,
              }}
            >
              {LETTERS[i]}
            </div>
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: textColor,
                letterSpacing: 0.5,
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

/* ================================================================
   QUESTION SCENE — full-screen vertical, ENERGETIC
   ================================================================ */
const ShortQuestion: React.FC<{
  question: QuizQuestion;
  num: number;
  total: number;
}> = ({ question, num, total }) => {
  const frame = useCurrentFrame();
  const enterEnd = S.Q_ENTER;
  const timerEnd = enterEnd + S.Q_TIMER;

  const phase =
    frame < enterEnd ? "enter" : frame < timerEnd ? "timer" : "reveal";
  const revealState: "hidden" | "shown" = phase === "reveal" ? "shown" : "hidden";

  // Swipe-in from bottom
  const enterSpring = spring({ frame, fps: FPS, config: { damping: 18 } });
  const enterY = interpolate(enterSpring, [0, 1], [300, 0]);
  const enterOpacity = interpolate(enterSpring, [0, 1], [0, 1]);

  // Exit swipe-up at the end
  const exitStart = S.Q_ENTER + S.Q_TIMER + S.Q_REVEAL;
  const exitY = interpolate(frame, [exitStart, exitStart + S.Q_TRANSITION], [0, -400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [exitStart, exitStart + S.Q_TRANSITION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Timer
  const timerElapsed = Math.max(0, frame - enterEnd);
  const timerProgress = Math.min(timerElapsed / S.Q_TIMER, 1);
  const remaining = Math.max(0, Math.ceil(3 - timerElapsed / FPS));
  const isWarning = remaining <= 2 && remaining > 1;
  const isCritical = remaining <= 1;
  const ringColor = isCritical ? C.wrong : isWarning ? C.gold : C.cyan;
  const glowColor = isCritical ? C.wrongGlow : isWarning ? C.goldGlow : C.cyanGlow;

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * timerProgress;

  // Timer spinning glow
  const spinAngle = frame * 6;

  // Difficulty badge
  const badge = DIFF_BADGE[question.difficulty] || DIFF_BADGE.easy;
  const gradient = DIFF_GRADIENT[question.difficulty] || "transparent";

  // Flag image
  const code = question.emoji ? emojiToCountryCode(question.emoji).toLowerCase() : "";
  const flagSrc = `https://flagcdn.com/w640/${code}.png`;

  // Flag pop-in
  const flagSpring = spring({ frame, fps: FPS, config: { damping: 10, mass: 0.6 } });
  const flagScale = interpolate(flagSpring, [0, 1], [0.4, 1]);
  const flagOpacity = interpolate(flagSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      {/* Difficulty gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: gradient }} />

      {/* Main content — swipe animated */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: "15%", // safe zone
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: FONT,
          transform: `translateY(${enterY + exitY}px)`,
          opacity: enterOpacity * exitOpacity,
        }}
      >
        {/* ~5% top spacing */}
        <div style={{ height: "5%" }} />

        {/* Question number + difficulty badge — BIG */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: C.cyan }}>
            {num}/{total}
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: badge.color,
              letterSpacing: 2,
              padding: "4px 12px",
              borderRadius: 6,
              border: `1.5px solid ${badge.color}`,
              background: `${badge.color}15`,
            }}
          >
            {badge.label} {badge.emoji}
          </div>
        </div>

        {/* Question text — BIG */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: C.white,
            textAlign: "center",
            marginTop: 20,
            lineHeight: 1.15,
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          {question.questionText}
        </div>

        {/* Flag — HUGE, explosive pop-in */}
        {question.emoji && (
          <div
            style={{
              marginTop: 20,
              transform: `scale(${flagScale})`,
              opacity: flagOpacity,
            }}
          >
            <Img
              src={flagSrc}
              width={420}
              style={{
                borderRadius: 16,
                boxShadow: `0 0 60px ${C.cyanGlow}, 0 0 120px rgba(0,229,255,0.12), 0 8px 40px rgba(0,0,0,0.6)`,
                border: `2px solid ${C.borderCyan}`,
              }}
            />
          </div>
        )}

        {/* Timer — centered below flag, spinning glow ring */}
        {phase === "timer" && (
          <div
            style={{
              marginTop: 16,
              width: 70,
              height: 70,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Spinning glow */}
            <div
              style={{
                position: "absolute",
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: `conic-gradient(from ${spinAngle}deg, transparent 0deg, ${ringColor}40 90deg, transparent 180deg)`,
                opacity: 0.6,
              }}
            />
            {/* Background circle */}
            <div
              style={{
                position: "absolute",
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(10,14,26,0.9)",
                boxShadow: `0 0 20px ${glowColor}`,
              }}
            />
            <svg width={70} height={70} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
              <circle cx={35} cy={35} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
              <circle
                cx={35}
                cy={35}
                r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: C.white,
                zIndex: 5,
              }}
            >
              {remaining}
            </div>
          </div>
        )}

        {/* Options — full width, slide-in stagger */}
        <div style={{ marginTop: 16, width: "100%" }}>
          <ShortsOptions
            options={question.options}
            revealState={revealState}
            correctIndex={question.correctIndex}
            parentFrame={frame}
          />
        </div>
      </div>

      {/* Audio */}
      <Sequence from={0} durationInFrames={10}>
        <Audio src={staticFile("audio/whoosh.wav")} volume={0.3} />
      </Sequence>
      {Array.from({ length: 4 }, (_, i) => (
        <Sequence
          key={`tf-${i}`}
          from={enterEnd + S.Q_TIMER - 60 + i * 15}
          durationInFrames={15}
        >
          <Audio src={staticFile("audio/tick_fast.wav")} volume={0.28} />
        </Sequence>
      ))}
      <Sequence from={timerEnd} durationInFrames={15}>
        <Audio src={staticFile("audio/correct.wav")} volume={0.55} />
      </Sequence>
    </AbsoluteFill>
  );
};

/* ================================================================
   MID-CTA (between Q2 & Q3)
   ================================================================ */
const MidCta: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, 22, 30], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  const s = spring({ frame, fps: FPS, config: { damping: 12 } });
  const scale = interpolate(s, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "20%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        zIndex: 95,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          padding: "16px 32px",
          background: "rgba(0,0,0,0.75)",
          borderRadius: 14,
          border: `1px solid ${C.borderCyan}`,
          fontSize: 32,
          fontWeight: 900,
          color: C.white,
          transform: `scale(${scale})`,
          textShadow: `0 0 20px ${C.cyanGlow}`,
        }}
      >
        Comment your score! 👇
      </div>
      <Audio src={staticFile("audio/pop.wav")} volume={0.25} />
    </div>
  );
};

/* ================================================================
   OUTRO — confetti, CTA, loop-friendly
   ================================================================ */

// Deterministic random
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};
const CONFETTI_COLORS = [C.cyan, C.gold, C.correct, "#FF69B4", "#9B59B6", C.wrong];

const ShortOutro: React.FC = () => {
  const frame = useCurrentFrame();

  const anim = (delay: number) => {
    const s = spring({ frame, fps: FPS, delay, config: { damping: 12 } });
    return {
      opacity: interpolate(s, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
    };
  };

  const subscribePulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [1, 1.08]);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* Confetti — 35 particles */}
      {Array.from({ length: 35 }, (_, i) => {
        const x = rand(i * 7 + 1) * 100;
        const speed = rand(i * 13 + 3) * 1.0 + 0.3;
        const size = rand(i * 3 + 5) * 7 + 3;
        const rotation = frame * (rand(i * 17 + 9) * 5 - 2.5);
        const color = CONFETTI_COLORS[Math.floor(rand(i * 23 + 11) * CONFETTI_COLORS.length)];
        const delay = Math.floor(rand(i * 31 + 13) * 30);
        const drift = Math.sin(frame * 0.05 + i) * 12;
        const elapsed = Math.max(0, frame - delay);
        const y = -8 + elapsed * speed;
        const op = interpolate(elapsed, [0, 8, 90, 110], [0, 0.85, 0.5, 0], {
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size * 0.6,
              background: color,
              borderRadius: 2,
              transform: `rotate(${rotation}deg) translateX(${drift}px)`,
              opacity: op,
            }}
          />
        );
      })}

      {/* Content in safe zone */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: "15%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 30,
          paddingRight: 30,
        }}
      >
        <div style={anim(0)}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: C.gold,
              textShadow: `0 0 50px ${C.goldGlow}, 0 0 100px ${C.goldDim}`,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            How many did
            <br />
            you get? 🤔
          </div>
        </div>

        <div style={anim(10)}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: C.cyan,
              marginTop: 28,
              textShadow: `0 0 25px ${C.cyanGlow}`,
            }}
          >
            Comment below! 👇
          </div>
        </div>

        <div style={anim(20)}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: C.white,
              marginTop: 20,
            }}
          >
            SUBSCRIBE 🔔
          </div>
        </div>

        <div style={anim(28)}>
          <div
            style={{
              marginTop: 32,
              padding: "16px 50px",
              background: `linear-gradient(135deg, ${C.wrong} 0%, #FF1744 100%)`,
              borderRadius: 14,
              fontSize: 24,
              fontWeight: 900,
              color: C.white,
              letterSpacing: 4,
              transform: `scale(${subscribePulse})`,
              boxShadow: `0 0 30px ${C.wrongGlow}`,
            }}
          >
            SUBSCRIBE
          </div>
        </div>

        <div style={anim(36)}>
          <div
            style={{
              marginTop: 36,
              fontSize: 36,
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

      <Audio src={staticFile("audio/fanfare.wav")} volume={0.35} />
    </AbsoluteFill>
  );
};

/* ================================================================
   MAIN COMPOSITION
   ================================================================ */

function pickShortsQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  const picked: QuizQuestion[] = [];
  const order: Array<QuizQuestion["difficulty"]> = ["easy", "medium", "hard", "impossible"];
  for (const diff of order) {
    const q = questions.find((q) => q.difficulty === diff);
    if (q) picked.push({ ...q, timerSeconds: 3 });
  }
  return picked;
}

export const ShortQuiz: React.FC<{ quizData: QuizData }> = ({ quizData }) => {
  const shorts = pickShortsQuestions(quizData.questions);

  let offset = 0;
  const hookStart = offset;
  offset += S.HOOK;
  const q1Start = offset;
  offset += Q_TOTAL;
  const q2Start = offset;
  offset += Q_TOTAL;
  const ctaStart = offset;
  offset += S.CTA_MID;
  const q3Start = offset;
  offset += Q_TOTAL;
  const q4Start = offset;
  offset += Q_TOTAL;
  const outroStart = offset;
  offset += S.OUTRO;

  return (
    <AbsoluteFill>
      <Background />

      {/* Watermark: GUESSLIX full, 18px */}
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 20,
          fontFamily: FONT,
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: 2,
          opacity: 0.3,
          zIndex: 100,
        }}
      >
        <span style={{ color: C.white }}>GUESS</span>
        <span style={{ color: C.cyan }}>LIX</span>
      </div>

      <Sequence from={hookStart} durationInFrames={S.HOOK}>
        <Hook />
      </Sequence>

      {shorts[0] && (
        <Sequence from={q1Start} durationInFrames={Q_TOTAL}>
          <ShortQuestion question={shorts[0]} num={1} total={4} />
        </Sequence>
      )}
      {shorts[1] && (
        <Sequence from={q2Start} durationInFrames={Q_TOTAL}>
          <ShortQuestion question={shorts[1]} num={2} total={4} />
        </Sequence>
      )}

      <Sequence from={ctaStart} durationInFrames={S.CTA_MID}>
        <MidCta />
      </Sequence>

      {shorts[2] && (
        <Sequence from={q3Start} durationInFrames={Q_TOTAL}>
          <ShortQuestion question={shorts[2]} num={3} total={4} />
        </Sequence>
      )}
      {shorts[3] && (
        <Sequence from={q4Start} durationInFrames={Q_TOTAL}>
          <ShortQuestion question={shorts[3]} num={4} total={4} />
        </Sequence>
      )}

      <Sequence from={outroStart} durationInFrames={S.OUTRO}>
        <ShortOutro />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SHORT_TOTAL_FRAMES =
  S.HOOK + Q_TOTAL * 4 + S.CTA_MID + S.OUTRO; // 690 = 23s
