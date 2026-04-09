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
import { OptionsGrid } from "../components/OptionsReveal";
import { FlagImage } from "../components/FlagImage";

/* ================================================================
   SHORTS TIMING CONSTANTS (frames)
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

// Background tint per difficulty
const DIFF_TINT: Record<string, string> = {
  easy: "rgba(0,255,136,0.04)",
  medium: "rgba(255,215,0,0.04)",
  hard: "rgba(255,140,0,0.06)",
  impossible: "rgba(255,51,102,0.08)",
};

const DIFF_BADGE: Record<string, { label: string; emoji: string; color: string }> = {
  easy: { label: "EASY", emoji: "🟢", color: "#00FF88" },
  medium: { label: "MEDIUM", emoji: "🟡", color: "#FFD700" },
  hard: { label: "HARD", emoji: "🔴", color: "#FF8C00" },
  impossible: { label: "IMPOSSIBLE", emoji: "💀", color: "#FF3366" },
};

/* ================================================================
   HOOK — First 2 seconds, scroll-stopping
   ================================================================ */
const HOOK_FLAGS = ["jp", "br", "us", "gb", "de", "kr", "za", "tr"];

const Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // Main text bounce
  const textSpring = spring({ frame, fps: FPS, config: { damping: 8, mass: 0.6 } });
  const textScale = interpolate(textSpring, [0, 1], [0.3, 1]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  // Text exits before hook ends
  const textExit = interpolate(frame, [45, 58], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* Rapid flag collage spinning in background */}
      {HOOK_FLAGS.map((code, i) => {
        const angle = (frame * 3 + i * 45) % 360;
        const radius = 300 + (i % 3) * 120;
        const x = 540 + Math.cos((angle * Math.PI) / 180) * radius;
        const y = 960 + Math.sin((angle * Math.PI) / 180) * radius;
        const rot = frame * 2 + i * 30;
        const flagOpacity = interpolate(frame, [0, 10], [0, 0.3], {
          extrapolateRight: "clamp",
        });
        return (
          <Img
            key={code}
            src={`https://flagcdn.com/w160/${code}.png`}
            width={100}
            style={{
              position: "absolute",
              left: x - 50,
              top: y - 33,
              transform: `rotate(${rot}deg)`,
              opacity: flagOpacity,
              borderRadius: 6,
            }}
          />
        );
      })}

      {/* Main hook text */}
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
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: C.white,
              textShadow: `0 0 40px rgba(0,0,0,0.8), 0 0 80px ${C.cyanGlow}`,
              lineHeight: 1.3,
            }}
          >
            CAN YOU GUESS
            <br />
            <span style={{ color: C.gold }}>ALL 4?</span>{" "}
            <span style={{ fontSize: 48 }}>🧠</span>
          </div>
        </div>
      </div>

      <Audio src={staticFile("audio/whoosh.wav")} volume={0.5} />
    </AbsoluteFill>
  );
};

/* ================================================================
   COMPACT QUESTION SCENE (Shorts-optimized)
   ================================================================ */
const ShortQuestion: React.FC<{
  question: QuizQuestion;
  num: number;
  total: number;
}> = ({ question, num, total }) => {
  const frame = useCurrentFrame();
  const enterEnd = S.Q_ENTER;
  const timerEnd = enterEnd + S.Q_TIMER;
  const revealEnd = timerEnd + S.Q_REVEAL;

  const phase =
    frame < enterEnd ? "enter" : frame < timerEnd ? "timer" : "reveal";
  const revealState = phase === "reveal" ? "shown" : "hidden";

  // Entry animation (fast)
  const enterSpring = spring({ frame, fps: FPS, config: { damping: 20 } });
  const enterOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const enterY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Timer progress
  const timerElapsed = Math.max(0, frame - enterEnd);
  const timerProgress = Math.min(timerElapsed / S.Q_TIMER, 1);
  const remaining = Math.max(0, Math.ceil(3 - timerElapsed / FPS));

  // Timer ring colors
  const isWarning = remaining <= 2 && remaining > 1;
  const isCritical = remaining <= 1;
  const ringColor = isCritical ? C.wrong : isWarning ? C.gold : C.cyan;

  // Timer ring math
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * timerProgress;

  // Difficulty badge
  const badge = DIFF_BADGE[question.difficulty] || DIFF_BADGE.easy;

  // Background tint
  const tint = DIFF_TINT[question.difficulty] || "transparent";

  return (
    <AbsoluteFill>
      {/* Difficulty tint overlay */}
      <div style={{ position: "absolute", inset: 0, background: tint }} />

      {/* Content — all within top 85% (safe zone) */}
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
          fontFamily: FONT,
          transform: `translateY(${enterY}px)`,
          opacity: enterOpacity,
        }}
      >
        {/* Question number + difficulty badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 60,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900, color: C.cyan }}>
            {num}/{total}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 900,
              color: badge.color,
              letterSpacing: 2,
              padding: "2px 8px",
              borderRadius: 5,
              border: `1px solid ${badge.color}`,
            }}
          >
            {badge.label} {badge.emoji}
          </div>
        </div>

        {/* Question text */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: C.white,
            textAlign: "center",
            marginTop: 16,
            maxWidth: 900,
            lineHeight: 1.2,
            paddingLeft: 30,
            paddingRight: 30,
          }}
        >
          {question.questionText}
        </div>

        {/* Flag image (big, centered) */}
        <div style={{ position: "relative", marginTop: 16 }}>
          {question.emoji && <FlagImage emoji={question.emoji} size={280} />}

          {/* Timer — small circle on bottom-right of flag */}
          {phase === "timer" && (
            <div
              style={{
                position: "absolute",
                bottom: -10,
                right: -10,
                width: 50,
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "rgba(10,14,26,0.85)",
                  boxShadow: `0 0 15px ${ringColor}40`,
                }}
              />
              <svg width={50} height={50} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
                <circle cx={25} cy={25} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={3} />
                <circle
                  cx={25}
                  cy={25}
                  r={radius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: C.white,
                  zIndex: 5,
                }}
              >
                {remaining}
              </div>
            </div>
          )}
        </div>

        {/* Options — single column for shorts */}
        <div style={{ marginTop: 24, width: "88%", maxWidth: 500 }}>
          <OptionsGrid
            options={question.options}
            revealState={revealState}
            correctIndex={question.correctIndex}
            isShort
          />
        </div>
      </div>

      {/* Audio */}
      <Sequence from={0} durationInFrames={10}>
        <Audio src={staticFile("audio/tick.wav")} volume={0.25} />
      </Sequence>
      {/* Fast ticks last 2 seconds */}
      {Array.from({ length: 4 }, (_, i) => (
        <Sequence
          key={`tf-${i}`}
          from={enterEnd + S.Q_TIMER - 60 + i * 15}
          durationInFrames={15}
        >
          <Audio src={staticFile("audio/tick_fast.wav")} volume={0.3} />
        </Sequence>
      ))}
      <Sequence from={timerEnd} durationInFrames={15}>
        <Audio src={staticFile("audio/correct.wav")} volume={0.55} />
      </Sequence>
    </AbsoluteFill>
  );
};

/* ================================================================
   MID-CTA OVERLAY (between Q2 and Q3)
   ================================================================ */
const MidCta: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, 22, 30], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        fontFamily: FONT,
        zIndex: 95,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          padding: "12px 24px",
          background: "rgba(0,0,0,0.7)",
          borderRadius: 12,
          border: `1px solid ${C.borderCyan}`,
          fontSize: 24,
          fontWeight: 700,
          color: C.textSec,
        }}
      >
        Comment how many you got right! 👇
      </div>
      <Audio src={staticFile("audio/pop.wav")} volume={0.2} />
    </div>
  );
};

/* ================================================================
   OUTRO (4 seconds — loop-friendly)
   ================================================================ */
const ShortOutro: React.FC = () => {
  const frame = useCurrentFrame();

  const anim = (delay: number) => {
    const s = spring({ frame, fps: FPS, delay, config: { damping: 14 } });
    return {
      opacity: interpolate(s, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(s, [0, 1], [25, 0])}px)`,
    };
  };

  const pulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [1, 1.06]);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* Content in safe zone (top 85%) */}
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
        }}
      >
        <div style={anim(0)}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: C.gold,
              textShadow: `0 0 40px ${C.goldGlow}`,
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            How many did
            <br />
            you get? 🤔
          </div>
        </div>

        <div style={anim(8)}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: C.cyan,
              marginTop: 24,
              textShadow: `0 0 20px ${C.cyanGlow}`,
            }}
          >
            SUBSCRIBE for daily quizzes! 🔔
          </div>
        </div>

        <div style={anim(16)}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.white,
              marginTop: 16,
            }}
          >
            LIKE if you got 3+ right! 👍
          </div>
        </div>

        <div style={anim(24)}>
          <div
            style={{
              marginTop: 30,
              padding: "14px 40px",
              background: `linear-gradient(135deg, ${C.wrong} 0%, #FF1744 100%)`,
              borderRadius: 12,
              fontSize: 20,
              fontWeight: 900,
              color: C.white,
              letterSpacing: 3,
              transform: `scale(${pulse})`,
              boxShadow: `0 0 25px ${C.wrongGlow}`,
            }}
          >
            SUBSCRIBE
          </div>
        </div>

        <div style={anim(32)}>
          <div
            style={{
              marginTop: 28,
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: 3,
              opacity: 0.5,
            }}
          >
            <span style={{ color: C.white }}>GUESS</span>
            <span style={{ color: C.cyan }}>LIX</span>
          </div>
        </div>
      </div>

      <Audio src={staticFile("audio/pop.wav")} volume={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================
   MAIN SHORT QUIZ COMPOSITION
   Pick 1 question per difficulty: easy, medium, hard, impossible
   Timeline: Hook → Q1 → Q2 → CTA → Q3 → Q4 → Outro
   ================================================================ */

function pickShortsQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  const picked: QuizQuestion[] = [];
  const order: Array<QuizQuestion["difficulty"]> = ["easy", "medium", "hard", "impossible"];
  for (const diff of order) {
    const q = questions.find((q) => q.difficulty === diff);
    if (q) picked.push({ ...q, timerSeconds: 3 }); // Force 3s timer for shorts
  }
  return picked;
}

export const ShortQuiz: React.FC<{ quizData: QuizData }> = ({ quizData }) => {
  const shorts = pickShortsQuestions(quizData.questions);

  // Build timeline
  let offset = 0;

  // Hook
  const hookStart = offset;
  offset += S.HOOK; // 60

  // Q1
  const q1Start = offset;
  offset += Q_TOTAL; // 120

  // Q2
  const q2Start = offset;
  offset += Q_TOTAL; // 120

  // Mid-CTA
  const ctaStart = offset;
  offset += S.CTA_MID; // 30

  // Q3
  const q3Start = offset;
  offset += Q_TOTAL; // 120

  // Q4
  const q4Start = offset;
  offset += Q_TOTAL; // 120

  // Outro
  const outroStart = offset;
  offset += S.OUTRO; // 120

  return (
    <AbsoluteFill>
      <Background />

      {/* Watermark: "GL?" compact */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontFamily: FONT,
          fontSize: 16,
          fontWeight: 900,
          letterSpacing: 1,
          opacity: 0.3,
          zIndex: 100,
        }}
      >
        <span style={{ color: C.white }}>G</span>
        <span style={{ color: C.cyan }}>L</span>
        <span style={{ color: C.gold }}>?</span>
      </div>

      {/* Hook */}
      <Sequence from={hookStart} durationInFrames={S.HOOK}>
        <Hook />
      </Sequence>

      {/* Q1 (easy) */}
      {shorts[0] && (
        <Sequence from={q1Start} durationInFrames={Q_TOTAL}>
          <ShortQuestion question={shorts[0]} num={1} total={4} />
        </Sequence>
      )}

      {/* Q2 (medium) */}
      {shorts[1] && (
        <Sequence from={q2Start} durationInFrames={Q_TOTAL}>
          <ShortQuestion question={shorts[1]} num={2} total={4} />
        </Sequence>
      )}

      {/* Mid-CTA overlay */}
      <Sequence from={ctaStart} durationInFrames={S.CTA_MID}>
        <MidCta />
      </Sequence>

      {/* Q3 (hard) */}
      {shorts[2] && (
        <Sequence from={q3Start} durationInFrames={Q_TOTAL}>
          <ShortQuestion question={shorts[2]} num={3} total={4} />
        </Sequence>
      )}

      {/* Q4 (impossible) */}
      {shorts[3] && (
        <Sequence from={q4Start} durationInFrames={Q_TOTAL}>
          <ShortQuestion question={shorts[3]} num={4} total={4} />
        </Sequence>
      )}

      {/* Outro */}
      <Sequence from={outroStart} durationInFrames={S.OUTRO}>
        <ShortOutro />
      </Sequence>
    </AbsoluteFill>
  );
};

/** Total frames for the short quiz */
export const SHORT_TOTAL_FRAMES =
  S.HOOK + Q_TOTAL * 4 + S.CTA_MID + S.OUTRO; // 690 = 23s
