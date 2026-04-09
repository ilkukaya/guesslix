import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  spring,
  interpolate,
} from "remotion";
import { QuizData, FPS, PHASE, questionFrames } from "../types";
import { C, FONT } from "../themes/tokens";
import { Background } from "../components/Background";
import { Watermark, ScoreHUD, DifficultyBar } from "../components/HUD";
import { QuestionCard } from "../components/QuestionCard";
import { OptionsGrid, AnswerReveal } from "../components/OptionsReveal";
import { TimerRing } from "../components/TimerRing";
import { OutroScreen } from "../components/OutroScreen";

// Pre-generate "answer pattern" — simulate which answers are correct
// For real use, you'd control this via props
const generateAnswerPattern = (count: number): boolean[] =>
  Array.from({ length: count }, (_, i) => {
    // Simulate ~70% correct rate with some streaks
    const seed = Math.sin(i * 4321 + 1234) * 10000;
    return (seed - Math.floor(seed)) > 0.3;
  });

/* ===== INTRO SEQUENCE ===== */
const IntroSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: FPS, config: { damping: 12 } });
  const scale = interpolate(s, [0, 1], [0.8, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1]);

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
      <div style={{ transform: `scale(${scale})`, opacity, textAlign: "center" }}>
        <div style={{ fontSize: 80, fontWeight: 900, letterSpacing: 6 }}>
          <span style={{ color: C.white }}>GUESS</span>
          <span style={{ color: C.cyan, textShadow: `0 0 40px ${C.cyanGlow}` }}>LIX</span>
          <span style={{ color: C.gold, marginLeft: 10 }}>?</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===== SINGLE QUESTION SCENE ===== */
interface QuestionSceneProps {
  question: QuizData["questions"][0];
  questionNumber: number;
  totalQuestions: number;
  category: string;
  isCorrect: boolean;
  score: number;
  streak: number;
  showFunFact: boolean;
}

const QuestionScene: React.FC<QuestionSceneProps> = ({
  question,
  questionNumber,
  totalQuestions,
  category,
  isCorrect,
  score,
  streak,
  showFunFact,
}) => {
  const frame = useCurrentFrame();

  const enterEnd = PHASE.enter;
  const timerEnd = enterEnd + PHASE.timer(question.timerSeconds);
  const revealEnd = timerEnd + PHASE.reveal;

  const phase =
    frame < enterEnd ? "enter" :
    frame < timerEnd ? "timer" :
    frame < revealEnd ? "reveal" : "funfact";

  const revealState = phase === "reveal" || phase === "funfact" ? "shown" : "hidden";
  const points = isCorrect ? (streak >= 3 ? 150 : 100) : 0;

  // Score display updates after reveal
  const displayScore = phase === "enter" || phase === "timer"
    ? score
    : score + points;

  const displayStreak = phase === "enter" || phase === "timer"
    ? streak
    : isCorrect ? streak + 1 : 0;

  return (
    <AbsoluteFill>
      <ScoreHUD score={displayScore} streak={displayStreak} />

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
        <TimerRing
          timerSeconds={question.timerSeconds}
          startFrame={enterEnd}
        />
      )}

      {(phase === "reveal" || phase === "funfact") && (
        <Sequence from={0}>
          <AnswerReveal
            isCorrect={isCorrect}
            points={points}
            funFact={question.funFact}
            showFact={showFunFact && phase === "funfact"}
          />
        </Sequence>
      )}

      <DifficultyBar current={questionNumber} total={totalQuestions} />
    </AbsoluteFill>
  );
};

/* ===== MAIN COMPOSITION ===== */
export const LongQuiz: React.FC<{ quizData: QuizData }> = ({ quizData }) => {
  const { questions, category, totalQuestions } = quizData;
  const answers = generateAnswerPattern(questions.length);

  // Calculate running scores and streaks
  let runningScore = 0;
  let runningStreak = 0;
  let bestStreak = 0;
  let correctCount = 0;

  const scoreMap = questions.map((q, i) => {
    const score = runningScore;
    const streak = runningStreak;
    const isCorrect = answers[i];

    if (isCorrect) {
      const pts = runningStreak >= 3 ? 150 : 100;
      runningScore += pts;
      runningStreak += 1;
      correctCount += 1;
      if (runningStreak > bestStreak) bestStreak = runningStreak;
    } else {
      runningStreak = 0;
    }

    return { score, streak, isCorrect };
  });

  const finalScore = runningScore;

  // Build sequence offsets
  const introFrames = 20;
  let offset = introFrames;

  const questionOffsets = questions.map((q, i) => {
    const start = offset;
    const showFact = !!q.funFact;
    const duration = questionFrames(q, showFact);
    offset += duration;
    return { start, duration, showFact };
  });

  const outroStart = offset;
  const outroDuration = 300; // 10 seconds

  return (
    <AbsoluteFill>
      <Background />
      <Watermark />

      {/* Intro */}
      <Sequence from={0} durationInFrames={introFrames}>
        <IntroSequence />
      </Sequence>

      {/* Questions */}
      {questions.map((q, i) => (
        <Sequence
          key={q.id}
          from={questionOffsets[i].start}
          durationInFrames={questionOffsets[i].duration}
        >
          <QuestionScene
            question={q}
            questionNumber={i + 1}
            totalQuestions={totalQuestions || questions.length}
            category={category}
            isCorrect={scoreMap[i].isCorrect}
            score={scoreMap[i].score}
            streak={scoreMap[i].streak}
            showFunFact={questionOffsets[i].showFact}
          />
        </Sequence>
      ))}

      {/* Outro */}
      <Sequence from={outroStart} durationInFrames={outroDuration}>
        <AbsoluteFill>
          <OutroScreen
            finalScore={finalScore}
            totalQuestions={questions.length}
            correctCount={correctCount}
            bestStreak={bestStreak}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
