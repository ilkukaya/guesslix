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
} from "../types";
import { C, FONT } from "../themes/tokens";
import { Background } from "../components/Background";
import { Watermark, QuestionCounter, DifficultyBar } from "../components/HUD";
import { QuestionCard } from "../components/QuestionCard";
import { OptionsGrid, FunFactOverlay } from "../components/OptionsReveal";
import { TimerRing } from "../components/TimerRing";
import { OutroScreen } from "../components/OutroScreen";

/* ================================================================
   INTRO SEQUENCE — 8 seconds (240 frames)
   Phase 1 (0-90):   GUESSLIX logo + boom
   Phase 2 (90-150): "GUESS THE FLAG" big title
   Phase 3 (150-240): Random flags with "?" pouring in
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

const IntroSequence: React.FC = () => {
  const frame = useCurrentFrame();

  const P1_END = 90;
  const P2_END = 150;

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
  const titleSpring = spring({
    frame: titleFrame,
    fps: FPS,
    config: { damping: 8, mass: 0.7 },
  });
  const titleScale = interpolate(titleSpring, [0, 1], [0.3, 1]);
  const titleOpacity = frame >= P1_END ? interpolate(titleSpring, [0, 1], [0, 1]) : 0;
  const titleMoveUp = interpolate(frame, [P2_END, P2_END + 15], [0, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          background: `radial-gradient(circle, ${C.cyanDim} 0%, transparent 70%)`,
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
        <div style={{ fontSize: 90, fontWeight: 900, letterSpacing: 6, textAlign: "center" }}>
          <span style={{ color: C.white }}>GUESS</span>
          <span style={{ color: C.cyan, textShadow: `0 0 40px ${C.cyanGlow}` }}>LIX</span>
          <span style={{ color: C.gold, marginLeft: 10 }}>?</span>
        </div>
      </div>

      {/* "GUESS THE FLAG" big title */}
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
            GUESS THE FLAG
          </div>
        </div>
      )}

      {/* Random flags with "?" — phase 3 */}
      {frame >= P2_END &&
        INTRO_FLAGS.map((flag, i) => {
          const flagDelay = i * 5;
          const flagFrame = Math.max(0, frame - P2_END - flagDelay);
          const fSpring = spring({
            frame: flagFrame,
            fps: FPS,
            config: { damping: 12 },
          });
          const fScale = interpolate(fSpring, [0, 1], [0.2, 1]);
          const fOpacity = interpolate(fSpring, [0, 1], [0, 0.85]);
          const wobble = Math.sin(frame * 0.08 + i * 2) * 3;

          return (
            <div
              key={flag.code}
              style={{
                position: "absolute",
                left: `${flag.x}%`,
                top: `${flag.y}%`,
                transform: `scale(${fScale}) rotate(${flag.rot + wobble}deg)`,
                opacity: fOpacity,
              }}
            >
              <Img
                src={`https://flagcdn.com/w160/${flag.code}.png`}
                width={120}
                style={{
                  borderRadius: 8,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 60,
                  fontWeight: 900,
                  color: C.gold,
                  textShadow: "0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(255,215,0,0.3)",
                }}
              >
                ?
              </div>
            </div>
          );
        })}

      {/* Audio: intro boom when logo appears */}
      <Audio src={staticFile("audio/intro_boom.wav")} volume={0.7} />
    </AbsoluteFill>
  );
};

/* ================================================================
   CATEGORY TRANSITION SCREEN
   ================================================================ */

const CATEGORY_CONFIG: Record<
  string,
  { emoji: string; label: string; subtitle: string; color: string; bgGlow: string }
> = {
  easy: {
    emoji: "🟢",
    label: "EASY",
    subtitle: "Let's warm up!",
    color: "#00FF88",
    bgGlow: "rgba(0,255,136,0.15)",
  },
  medium: {
    emoji: "🟡",
    label: "MEDIUM",
    subtitle: "Getting harder... 💪",
    color: "#FFD700",
    bgGlow: "rgba(255,215,0,0.15)",
  },
  hard: {
    emoji: "🔴",
    label: "HARD",
    subtitle: "Only experts survive! 🧠",
    color: "#FF8C00",
    bgGlow: "rgba(255,140,0,0.15)",
  },
  impossible: {
    emoji: "💀",
    label: "IMPOSSIBLE",
    subtitle: "No one gets these right... 😱",
    color: "#FF3366",
    bgGlow: "rgba(255,51,102,0.20)",
  },
};

const CategoryTransition: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const frame = useCurrentFrame();
  const config = CATEGORY_CONFIG[difficulty] || CATEGORY_CONFIG.easy;

  const s = spring({ frame, fps: FPS, config: { damping: 10, mass: 0.8 } });
  const scale = interpolate(s, [0, 1], [0.3, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1]);

  const flash = interpolate(frame, [0, 5, 18], [0, 0.4, 0], {
    extrapolateRight: "clamp",
  });

  const shake =
    difficulty === "impossible" && frame > 8
      ? Math.sin(frame * 2.5) *
        interpolate(frame, [8, 70], [8, 0], { extrapolateRight: "clamp" })
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
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${config.bgGlow} 0%, transparent 70%)`,
        }}
      />
      <div
        style={{ position: "absolute", inset: 0, background: config.color, opacity: flash }}
      />
      <div style={{ textAlign: "center", transform: `scale(${scale})`, opacity }}>
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

      {/* Audio: level up sound */}
      <Audio src={staticFile("audio/levelup.wav")} volume={0.55} />
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
  const opacity = interpolate(frame, [0, 12, 33, 45], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
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
      {/* Pop sound */}
      <Audio src={staticFile("audio/pop.wav")} volume={0.3} />
    </div>
  );
};

/* ================================================================
   TIMER TICK SOUNDS — builds tick Sequences for a question
   ================================================================ */

const TimerTicks: React.FC<{ timerSeconds: number; enterEnd: number }> = ({
  timerSeconds,
  enterEnd,
}) => {
  const normalCount = Math.max(0, timerSeconds - 3);
  const fastStart = enterEnd + normalCount * FPS;
  const HALF = Math.floor(FPS / 2); // 15 frames

  return (
    <>
      {/* Normal ticks: 1 per second for the non-urgent portion */}
      {Array.from({ length: normalCount }, (_, i) => (
        <Sequence key={`tn-${i}`} from={enterEnd + i * FPS} durationInFrames={FPS}>
          <Audio src={staticFile("audio/tick.wav")} volume={0.2} />
        </Sequence>
      ))}
      {/* Fast ticks: every 0.5s for the last 3 seconds */}
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
      />

      <div style={{ position: "absolute", bottom: 140, left: 0, right: 0 }}>
        <OptionsGrid
          options={question.options}
          revealState={revealState}
          correctIndex={question.correctIndex}
        />
      </div>

      {phase === "timer" && (
        <TimerRing timerSeconds={question.timerSeconds} startFrame={enterEnd} />
      )}

      {/* Fun fact overlay */}
      {isRevealPhase && (
        <Sequence from={timerEnd} durationInFrames={totalRevealAndFact}>
          <FunFactOverlay funFact={question.funFact} showFact={showFunFact} />
        </Sequence>
      )}

      {/* === AUDIO === */}

      {/* Whoosh on question enter */}
      <Sequence from={0} durationInFrames={FPS}>
        <Audio src={staticFile("audio/whoosh.wav")} volume={0.35} />
      </Sequence>

      {/* Timer tick sounds */}
      <TimerTicks timerSeconds={question.timerSeconds} enterEnd={enterEnd} />

      {/* Correct ding on reveal */}
      <Sequence from={timerEnd} durationInFrames={FPS}>
        <Audio src={staticFile("audio/correct.wav")} volume={0.6} />
      </Sequence>

      {/* CTA banner + pop sound during reveal */}
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
    if (q.difficulty !== prevDifficulty) {
      const transDur = TRANSITION_FRAMES[q.difficulty] || 60;
      transitions.push({ start: offset, duration: transDur, difficulty: q.difficulty });
      offset += transDur;
      prevDifficulty = q.difficulty;
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

  return (
    <AbsoluteFill>
      <Background />
      <Watermark />

      {/* Intro + boom sound */}
      <Sequence from={0} durationInFrames={INTRO_FRAMES}>
        <IntroSequence />
      </Sequence>

      {/* Category transitions + level up sound */}
      {transitions.map((t, i) => (
        <Sequence key={`trans-${i}`} from={t.start} durationInFrames={t.duration}>
          <CategoryTransition difficulty={t.difficulty} />
        </Sequence>
      ))}

      {/* Questions (all audio wired inside QuestionScene) */}
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

      {/* Outro + fanfare sound */}
      <Sequence from={outroStart} durationInFrames={OUTRO_FRAMES}>
        <AbsoluteFill>
          <OutroScreen />
          <Audio src={staticFile("audio/fanfare.wav")} volume={0.5} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
