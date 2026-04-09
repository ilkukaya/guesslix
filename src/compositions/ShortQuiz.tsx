import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, spring, interpolate } from "remotion";
import { QuizData, FPS, PHASE, questionFrames } from "../types";
import { C, FONT } from "../themes/tokens";
import { Background } from "../components/Background";
import { QuestionCard } from "../components/QuestionCard";
import { OptionsGrid, AnswerReveal } from "../components/OptionsReveal";
import { TimerRing } from "../components/TimerRing";

const generateAnswerPattern = (count: number): boolean[] =>
  Array.from({ length: count }, (_, i) => {
    const seed = Math.sin(i * 4321 + 1234) * 10000;
    return (seed - Math.floor(seed)) > 0.25; // ~75% correct for shorts
  });

/* Short outro with CTA */
const ShortOutro: React.FC<{ correct: number; total: number }> = ({ correct, total }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: FPS, config: { damping: 12 } });
  const scale = interpolate(s, [0, 1], [0.7, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
      }}
    >
      <div style={{ transform: `scale(${scale})`, opacity, textAlign: "center" }}>
        <div style={{ fontSize: 20, color: C.textMuted, letterSpacing: 4, fontWeight: 700 }}>
          YOUR SCORE
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: C.gold,
            textShadow: `0 0 40px ${C.goldGlow}`,
            marginTop: 8,
          }}
        >
          {correct}/{total}
        </div>
        <div style={{ fontSize: 22, color: C.cyan, fontWeight: 700, marginTop: 8 }}>
          {correct === total ? "PERFECT! 🏆" : correct >= total * 0.6 ? "NICE! 🎯" : "TRY AGAIN! 💪"}
        </div>
        <div
          style={{
            marginTop: 50,
            fontSize: 20,
            color: C.textSec,
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          Think you can beat 200?
        </div>
        <div style={{ fontSize: 22, color: C.cyan, fontWeight: 900, marginTop: 8 }}>
          👆 Full quiz on channel
        </div>
        <div
          style={{
            marginTop: 40,
            padding: "14px 32px",
            border: `2px solid ${C.cyan}`,
            borderRadius: 10,
            fontSize: 16,
            color: C.cyan,
            fontWeight: 900,
            letterSpacing: 3,
          }}
        >
          SUBSCRIBE
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* Question scene for shorts (simplified) */
const ShortQuestion: React.FC<{
  question: QuizData["questions"][0];
  num: number;
  total: number;
  category: string;
  isCorrect: boolean;
}> = ({ question, num, total, category, isCorrect }) => {
  const frame = useCurrentFrame();
  const enterEnd = PHASE.enter;
  const timerEnd = enterEnd + PHASE.timer(question.timerSeconds);
  const phase = frame < enterEnd ? "enter" : frame < timerEnd ? "timer" : "reveal";
  const revealState = phase === "reveal" ? "shown" : "hidden";

  return (
    <AbsoluteFill>
      <QuestionCard
        question={question}
        questionNumber={num}
        totalQuestions={total}
        category={category}
      />
      <div style={{ position: "absolute", bottom: 280, left: 0, right: 0 }}>
        <OptionsGrid
          options={question.options}
          revealState={revealState}
          correctIndex={question.correctIndex}
          isShort
        />
      </div>
      {phase === "timer" && (
        <TimerRing timerSeconds={question.timerSeconds} startFrame={enterEnd} />
      )}
      {phase === "reveal" && (
        <AnswerReveal isCorrect={isCorrect} points={100} showFact={false} />
      )}
    </AbsoluteFill>
  );
};

/* Main ShortQuiz composition */
export const ShortQuiz: React.FC<{ quizData: QuizData }> = ({ quizData }) => {
  const { questions, category } = quizData;
  const shorts = questions.slice(0, 5);
  const answers = generateAnswerPattern(shorts.length);
  const correctCount = answers.filter(Boolean).length;

  let offset = 0;
  const offsets = shorts.map((q) => {
    const start = offset;
    const duration = questionFrames(q, false);
    offset += duration;
    return { start, duration };
  });

  const outroDuration = 90; // 3 seconds

  return (
    <AbsoluteFill>
      <Background />
      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          fontFamily: FONT,
          fontSize: 14,
          fontWeight: 900,
          letterSpacing: 2,
          color: C.white,
          opacity: 0.1,
          zIndex: 100,
        }}
      >
        GUESSLIX
      </div>

      {shorts.map((q, i) => (
        <Sequence key={q.id} from={offsets[i].start} durationInFrames={offsets[i].duration}>
          <ShortQuestion
            question={q}
            num={i + 1}
            total={shorts.length}
            category={category}
            isCorrect={answers[i]}
          />
        </Sequence>
      ))}

      <Sequence from={offset} durationInFrames={outroDuration}>
        <ShortOutro correct={correctCount} total={shorts.length} />
      </Sequence>
    </AbsoluteFill>
  );
};
