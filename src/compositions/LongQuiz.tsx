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
import {
  QuizData,
  QuizQuestion,
  FPS,
  PHASE,
  questionFrames,
  INTRO_FRAMES,
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
  MINI_SPLASH_FRAMES,
} from "../types";
import { C, FONT } from "../themes/tokens";
import { Background } from "../components/Background";
import { BackgroundMusic, VolumeKeyframe, V, RAMP } from "../components/BackgroundMusic";
import { BrandLogo } from "../components/BrandLogo";
import { Watermark, QuestionCounter, DifficultyBar } from "../components/HUD";
import { QuestionCard } from "../components/QuestionCard";
import { OptionsGrid, FunFactOverlay } from "../components/OptionsReveal";
import { TimerRing } from "../components/TimerRing";
import { OutroScreen } from "../components/OutroScreen";

/* ================================================================
   INTRO SEQUENCE — 8 seconds (240 frames)
   ================================================================ */

const INTRO_FLAGS = [
  { code: "jp", x: 10, y: 18, rot: -8 },
  { code: "br", x: 76, y: 12, rot: 12 },
  { code: "us", x: 42, y: 52, rot: -5 },
  { code: "gb", x: 18, y: 62, rot: 10 },
  { code: "fr", x: 68, y: 58, rot: -12 },
  { code: "de", x: 32, y: 28, rot: 7 },
  { code: "au", x: 82, y: 42, rot: -3 },
  { code: "tr", x: 52, y: 72, rot: 15 },
  { code: "za", x: 6, y: 42, rot: -10 },
  { code: "kr", x: 60, y: 22, rot: 5 },
];

const IntroSequence: React.FC<{ category: string }> = ({ category }) => {
  const frame = useCurrentFrame();
  const P1_END = 90;
  const P2_END = 150;

  const isFlags = category.includes("flag");
  const categoryLabel = category.replace(/_/g, " ").toUpperCase();

  const logoSpring = spring({ frame, fps: FPS, config: { damping: 12 } });
  const logoBaseScale = interpolate(logoSpring, [0, 1], [0.8, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);
  const logoShrink = interpolate(frame, [P1_END, P1_END + 20], [1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoMoveUp = interpolate(frame, [P1_END, P1_END + 20], [0, -160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleFrame = Math.max(0, frame - P1_END);
  const titleSpring = spring({ frame: titleFrame, fps: FPS, config: { damping: 8, mass: 0.7 } });
  const titleScale = interpolate(titleSpring, [0, 1], [0.3, 1]);
  const titleOpacity = frame >= P1_END ? interpolate(titleSpring, [0, 1], [0, 1]) : 0;
  const titleMoveUp = interpolate(frame, [P2_END, P2_END + 15], [0, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Generic "?" bubble positions (used when not flags)
  const BUBBLE_POS = [
    { x: 12, y: 20 }, { x: 78, y: 15 }, { x: 45, y: 55 }, { x: 20, y: 65 },
    { x: 70, y: 60 }, { x: 35, y: 30 }, { x: 85, y: 45 }, { x: 55, y: 75 },
    { x: 8, y: 45 }, { x: 62, y: 22 },
  ];

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(33,150,243,0.12) 0%, transparent 70%)`,
          opacity: 0.5,
        }}
      />
      {/* GUESSLIX Logo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${logoMoveUp}px) scale(${logoBaseScale * logoShrink})`,
          opacity: logoOpacity,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <BrandLogo size={90} letterSpacing={6} glowIntensity={1} />
        </div>
      </div>
      {/* Category title — dynamic from JSON */}
      {frame >= P1_END && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateY(${titleMoveUp}px) scale(${titleScale})`,
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              fontSize: 70,
              fontWeight: 900,
              color: C.cyan,
              textShadow: `0 0 60px ${C.cyanGlow}, 0 0 120px rgba(0,229,255,0.2)`,
              letterSpacing: 10,
            }}
          >
            {categoryLabel}
          </div>
        </div>
      )}
      {/* Phase 3: Flag images (flag category) or "?" bubbles (generic) */}
      {frame >= P2_END && isFlags &&
        INTRO_FLAGS.map((flag, i) => {
          const flagFrame = Math.max(0, frame - P2_END - i * 5);
          const fSpring = spring({ frame: flagFrame, fps: FPS, config: { damping: 12 } });
          const fScale = interpolate(fSpring, [0, 1], [0.2, 1]);
          const fOpacity = interpolate(fSpring, [0, 1], [0, 0.85]);
          const wobble = Math.sin(frame * 0.08 + i * 2) * 3;
          return (
            <div key={flag.code} style={{ position: "absolute", left: `${flag.x}%`, top: `${flag.y}%`, transform: `scale(${fScale}) rotate(${flag.rot + wobble}deg)`, opacity: fOpacity }}>
              <Img src={`https://flagcdn.com/w160/${flag.code}.png`} width={120} style={{ borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, fontWeight: 900, color: C.gold, textShadow: "0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(255,215,0,0.3)" }}>?</div>
            </div>
          );
        })}
      {frame >= P2_END && !isFlags &&
        BUBBLE_POS.map((pos, i) => {
          const bFrame = Math.max(0, frame - P2_END - i * 4);
          const bSpring = spring({ frame: bFrame, fps: FPS, config: { damping: 12 } });
          const bScale = interpolate(bSpring, [0, 1], [0, 1]);
          const bOpacity = interpolate(bSpring, [0, 1], [0, 0.7]);
          return (
            <div key={i} style={{ position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`, transform: `scale(${bScale})`, opacity: bOpacity, width: 70, height: 70, borderRadius: "50%", background: C.bgSurface, border: `2px solid ${C.borderCyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900, color: C.gold }}>
              ?
            </div>
          );
        })}
      <Audio src={staticFile("audio/intro_boom.wav")} volume={0.7} />
    </AbsoluteFill>
  );
};

/* ================================================================
   CATEGORY TRANSITION — Medal spin + category reveal
   ================================================================ */

const CATEGORY_CONFIG: Record<
  string,
  { emoji: string; label: string; subtitle: string; color: string; bgGlow: string }
> = {
  easy: { emoji: "🟢", label: "EASY", subtitle: "Let's warm up!", color: "#00FF88", bgGlow: "rgba(0,255,136,0.15)" },
  medium: { emoji: "🟡", label: "MEDIUM", subtitle: "Getting harder... 💪", color: "#FFD700", bgGlow: "rgba(255,215,0,0.15)" },
  hard: { emoji: "🔴", label: "HARD", subtitle: "Only experts survive! 🧠", color: "#FF8C00", bgGlow: "rgba(255,140,0,0.15)" },
  impossible: { emoji: "💀", label: "IMPOSSIBLE", subtitle: "No one gets these right... 😱", color: "#FF3366", bgGlow: "rgba(255,51,102,0.20)" },
};

const CategoryTransition: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const frame = useCurrentFrame();
  const config = CATEGORY_CONFIG[difficulty] || CATEGORY_CONFIG.easy;

  // Phase 1: GUESSLIX medal spin (0-30 frames = 1s)
  const MEDAL_END = 30;
  const medalRotation = interpolate(frame, [0, MEDAL_END], [0, 360], {
    extrapolateRight: "clamp",
  });
  const medalEntry = spring({ frame, fps: FPS, config: { damping: 12 } });
  const medalScale = interpolate(medalEntry, [0, 1], [0.4, 1]);
  const medalOpacity = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" });
  const medalFade = interpolate(frame, [MEDAL_END - 3, MEDAL_END + 8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2: Category name (after medal)
  const catFrame = Math.max(0, frame - MEDAL_END);
  const catSpring = spring({ frame: catFrame, fps: FPS, config: { damping: 10, mass: 0.8 } });
  const catScale = interpolate(catSpring, [0, 1], [0.3, 1]);
  const catOpacity = frame >= MEDAL_END ? interpolate(catSpring, [0, 1], [0, 1]) : 0;

  const flash = frame >= MEDAL_END
    ? interpolate(frame, [MEDAL_END, MEDAL_END + 5, MEDAL_END + 18], [0, 0.4, 0], { extrapolateRight: "clamp" })
    : 0;

  const shake =
    difficulty === "impossible" && frame > MEDAL_END + 8
      ? Math.sin(frame * 2.5) *
        interpolate(frame, [MEDAL_END + 8, MEDAL_END + 60], [8, 0], { extrapolateRight: "clamp" })
      : 0;

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        fontFamily: FONT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateX(${shake}px)`,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${config.bgGlow} 0%, transparent 70%)`,
        }}
      />

      {/* GUESSLIX Medal (3D coin flip) */}
      {frame < MEDAL_END + 10 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: 600,
          }}
        >
          <div
            style={{
              transform: `rotateY(${medalRotation}deg) scale(${medalScale})`,
              transformStyle: "preserve-3d",
              opacity: medalOpacity * medalFade,
            }}
          >
            <BrandLogo size={60} letterSpacing={5} showQuestion={false} glowIntensity={0.7} />
          </div>
        </div>
      )}

      {/* Flash overlay */}
      <div style={{ position: "absolute", inset: 0, background: config.color, opacity: flash }} />

      {/* Category name (after medal) */}
      {frame >= MEDAL_END - 5 && (
        <div style={{ textAlign: "center", transform: `scale(${catScale})`, opacity: catOpacity }}>
          <div style={{ fontSize: 80, marginBottom: 10 }}>{config.emoji}</div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: config.color,
              textShadow: `0 0 60px ${config.color}80`,
              letterSpacing: 8,
            }}
          >
            {config.label}
          </div>
          <div style={{ fontSize: 28, color: C.textSec, marginTop: 16, fontWeight: 600 }}>
            {config.subtitle}
          </div>
        </div>
      )}

      {/* Coin flip sound */}
      <Audio src={staticFile("audio/coinflip.wav")} volume={0.5} />
      {/* Level up sound after medal */}
      <Sequence from={MEDAL_END} durationInFrames={FPS}>
        <Audio src={staticFile("audio/levelup.wav")} volume={0.55} />
      </Sequence>
    </AbsoluteFill>
  );
};

/* ================================================================
   MINI GUESSLIX SPLASH (every 4 questions, 0.8s)
   ================================================================ */

const BUBBLE_POSITIONS = [
  { x: -130, y: -70 },
  { x: 110, y: -60 },
  { x: -80, y: 55 },
  { x: 120, y: 50 },
  { x: -40, y: -100 },
  { x: 50, y: 90 },
];

const MiniSplash: React.FC = () => {
  const frame = useCurrentFrame();
  const logoSpring = spring({ frame, fps: FPS, config: { damping: 14 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.4, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
      }}
    >
      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          zIndex: 10,
        }}
      >
        <BrandLogo size={52} letterSpacing={4} glowIntensity={0.8} />
      </div>

      {/* "?" bubbles popping in */}
      {BUBBLE_POSITIONS.map((pos, i) => {
        const bFrame = Math.max(0, frame - i * 2);
        const bSpring = spring({ frame: bFrame, fps: FPS, config: { damping: 12 } });
        const bScale = interpolate(bSpring, [0, 1], [0, 1]);
        const bOpacity = interpolate(bSpring, [0, 1], [0, 0.8]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${pos.x}px)`,
              top: `calc(50% + ${pos.y}px)`,
              transform: `scale(${bScale})`,
              opacity: bOpacity,
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: C.bgSurface,
              border: `2px solid ${C.borderCyan}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 900,
              color: C.gold,
            }}
          >
            ?
          </div>
        );
      })}

      <Audio src={staticFile("audio/pop.wav")} volume={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================
   CTA BANNER
   ================================================================ */

const CTA_MESSAGES = [
  "Enjoying? Hit that LIKE button! 👍",
  "SUBSCRIBE for daily quizzes! 🔔",
  "Share with a friend who'd love this! 📤",
];

const CtaBanner: React.FC<{ message: string }> = ({ message }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, 33, 45], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 12], [20, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        bottom: "6%",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        fontFamily: FONT,
        zIndex: 95,
        opacity,
        transform: `translateY(${y}px)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          padding: "10px 28px",
          background: "rgba(0,0,0,0.6)",
          border: `1px solid ${C.borderCyan}`,
          borderRadius: 10,
          fontSize: 18,
          fontWeight: 700,
          color: C.textSec,
          letterSpacing: 1,
        }}
      >
        {message}
      </div>
      <Audio src={staticFile("audio/pop.wav")} volume={0.3} />
    </div>
  );
};

/* ================================================================
   TIMER TICK SOUNDS
   ================================================================ */

const TimerTicks: React.FC<{ timerSeconds: number; enterEnd: number }> = ({
  timerSeconds,
  enterEnd,
}) => {
  const normalCount = Math.max(0, timerSeconds - 3);
  const fastStart = enterEnd + normalCount * FPS;
  const HALF = Math.floor(FPS / 2);
  return (
    <>
      {Array.from({ length: normalCount }, (_, i) => (
        <Sequence key={`tn-${i}`} from={enterEnd + i * FPS} durationInFrames={FPS}>
          <Audio src={staticFile("audio/tick.wav")} volume={0.2} />
        </Sequence>
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <Sequence key={`tf-${i}`} from={fastStart + i * HALF} durationInFrames={HALF}>
          <Audio src={staticFile("audio/tick_fast.wav")} volume={0.3} />
        </Sequence>
      ))}
    </>
  );
};

/* ================================================================
   SINGLE QUESTION SCENE
   ================================================================ */

interface QuestionSceneProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  category: string;
  showFunFact: boolean;
  showCta: boolean;
  ctaMessage: string;
}

const QuestionScene: React.FC<QuestionSceneProps> = ({
  question,
  questionNumber,
  totalQuestions,
  category,
  showFunFact,
  showCta,
  ctaMessage,
}) => {
  const frame = useCurrentFrame();

  const enterEnd = PHASE.enter;
  const timerEnd = enterEnd + PHASE.timer(question.timerSeconds);
  const revealEnd = timerEnd + PHASE.reveal;
  const totalRevealAndFact =
    PHASE.reveal + (showFunFact && question.funFact ? PHASE.funFact : 0);

  const phase =
    frame < enterEnd
      ? "enter"
      : frame < timerEnd
        ? "timer"
        : frame < revealEnd
          ? "reveal"
          : "funfact";

  const revealState = phase === "reveal" || phase === "funfact" ? "shown" : "hidden";
  const isRevealPhase = phase === "reveal" || phase === "funfact";

  return (
    <AbsoluteFill>
      <QuestionCounter current={questionNumber} total={totalQuestions} />

      <QuestionCard
        question={question}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        category={category}
        isRevealed={isRevealPhase}
      />

      <div style={{ position: "absolute", bottom: 120, left: 0, right: 0 }}>
        <OptionsGrid
          options={question.options}
          revealState={revealState}
          correctIndex={question.correctIndex}
        />
      </div>

      {phase === "timer" && (
        <TimerRing timerSeconds={question.timerSeconds} startFrame={enterEnd} />
      )}

      {isRevealPhase && (
        <Sequence from={timerEnd} durationInFrames={totalRevealAndFact}>
          <FunFactOverlay funFact={question.funFact} showFact={showFunFact} />
        </Sequence>
      )}

      {/* Audio */}
      <Sequence from={0} durationInFrames={FPS}>
        <Audio src={staticFile("audio/whoosh.wav")} volume={0.35} />
      </Sequence>
      <TimerTicks timerSeconds={question.timerSeconds} enterEnd={enterEnd} />
      <Sequence from={timerEnd} durationInFrames={FPS}>
        <Audio src={staticFile("audio/correct.wav")} volume={0.6} />
      </Sequence>

      {showCta && isRevealPhase && (
        <Sequence from={timerEnd + 10} durationInFrames={45}>
          <CtaBanner message={ctaMessage} />
        </Sequence>
      )}

      <DifficultyBar current={questionNumber} total={totalQuestions} />
    </AbsoluteFill>
  );
};

/* ================================================================
   MAIN COMPOSITION
   ================================================================ */

export const LongQuiz: React.FC<{ quizData: QuizData }> = ({ quizData }) => {
  const { questions, category } = quizData;

  let offset = INTRO_FRAMES;
  let prevDifficulty = "";

  const transitions: Array<{ start: number; duration: number; difficulty: string }> = [];
  const miniSplashes: Array<{ start: number; duration: number }> = [];
  const questionSlots: Array<{
    start: number;
    duration: number;
    question: QuizQuestion;
    index: number;
    showFact: boolean;
    showCta: boolean;
    ctaMessage: string;
  }> = [];

  questions.forEach((q, i) => {
    const isNewDifficulty = q.difficulty !== prevDifficulty;

    if (isNewDifficulty) {
      const transDur = TRANSITION_FRAMES[q.difficulty] || 60;
      transitions.push({ start: offset, duration: transDur, difficulty: q.difficulty });
      offset += transDur;
      prevDifficulty = q.difficulty;
    }

    // Mini splash every 4 questions (not at category boundaries)
    if (i > 0 && i % 4 === 0 && !isNewDifficulty) {
      miniSplashes.push({ start: offset, duration: MINI_SPLASH_FRAMES });
      offset += MINI_SPLASH_FRAMES;
    }

    const showFact = !!q.funFact;
    const dur = questionFrames(q, showFact);
    const showCta = i > 0 && (i + 1) % 10 === 0;
    const ctaMessage = CTA_MESSAGES[Math.floor(i / 10) % CTA_MESSAGES.length];

    questionSlots.push({
      start: offset,
      duration: dur,
      question: q,
      index: i,
      showFact,
      showCta,
      ctaMessage,
    });
    offset += dur;
  });

  const outroStart = offset;
  const totalVideoFrames = outroStart + OUTRO_FRAMES;

  /* ---- BGM volume schedule ---- */
  const bgm: VolumeKeyframe[] = [];

  // Intro: fade in → high energy
  bgm.push({ frame: 0, volume: V.silent });
  bgm.push({ frame: FPS, volume: V.high });
  bgm.push({ frame: INTRO_FRAMES - RAMP, volume: V.high });
  bgm.push({ frame: INTRO_FRAMES, volume: V.base });

  // Build combined chronological event list
  const events = [
    ...transitions.map((t) => ({ kind: "transition" as const, start: t.start, duration: t.duration })),
    ...miniSplashes.map((s) => ({ kind: "splash" as const, start: s.start, duration: s.duration })),
    ...questionSlots.map((q) => ({
      kind: "question" as const,
      start: q.start,
      duration: q.duration,
      timerSec: q.question.timerSeconds,
    })),
  ].sort((a, b) => a.start - b.start);

  for (const ev of events) {
    if (ev.kind === "transition") {
      bgm.push({ frame: ev.start, volume: V.high });
      bgm.push({ frame: ev.start + ev.duration, volume: V.base });
    } else if (ev.kind === "splash") {
      bgm.push({ frame: ev.start, volume: V.mid });
      bgm.push({ frame: ev.start + ev.duration, volume: V.base });
    } else {
      const enterEnd = ev.start + PHASE.enter;
      const timerEnd = enterEnd + PHASE.timer(ev.timerSec);
      bgm.push({ frame: ev.start, volume: V.base });
      bgm.push({ frame: enterEnd, volume: V.duck });
      bgm.push({ frame: timerEnd - RAMP, volume: V.duck });
      bgm.push({ frame: timerEnd, volume: V.mid });
      bgm.push({ frame: ev.start + ev.duration, volume: V.base });
    }
  }

  // Outro: gentle fade out
  bgm.push({ frame: outroStart, volume: V.mid });
  bgm.push({ frame: totalVideoFrames - 60, volume: V.base * 0.5 });
  bgm.push({ frame: totalVideoFrames, volume: V.silent });

  return (
    <AbsoluteFill>
      <Background />
      <Watermark />
      <BackgroundMusic totalFrames={totalVideoFrames} schedule={bgm} />

      <Sequence from={0} durationInFrames={INTRO_FRAMES}>
        <IntroSequence category={category} />
      </Sequence>

      {transitions.map((t, i) => (
        <Sequence key={`trans-${i}`} from={t.start} durationInFrames={t.duration}>
          <CategoryTransition difficulty={t.difficulty} />
        </Sequence>
      ))}

      {miniSplashes.map((s, i) => (
        <Sequence key={`splash-${i}`} from={s.start} durationInFrames={s.duration}>
          <MiniSplash />
        </Sequence>
      ))}

      {questionSlots.map((slot) => (
        <Sequence
          key={slot.question.id}
          from={slot.start}
          durationInFrames={slot.duration}
        >
          <QuestionScene
            question={slot.question}
            questionNumber={slot.index + 1}
            totalQuestions={questions.length}
            category={category}
            showFunFact={slot.showFact}
            showCta={slot.showCta}
            ctaMessage={slot.ctaMessage}
          />
        </Sequence>
      ))}

      <Sequence from={outroStart} durationInFrames={OUTRO_FRAMES}>
        <AbsoluteFill>
          <OutroScreen />
          <Audio src={staticFile("audio/fanfare.wav")} volume={0.5} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
