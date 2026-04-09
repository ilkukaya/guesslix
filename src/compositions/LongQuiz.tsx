import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  spring,
  interpolate,
  Audio,
  staticFile,
} from "remotion";
import { QuizData, FPS, PHASE, questionFrames } from "../types";
import { C, FONT } from "../themes/tokens";
import { Background } from "../components/Background";
import { Watermark, ScoreHUD, DifficultyBar } from "../components/HUD";
import { QuestionCard } from "../components/QuestionCard";
import { OptionsGrid, AnswerReveal } from "../components/OptionsReveal";
import { TimerRing } from "../components/TimerRing";
import { OutroScreen } from "../components/OutroScreen";

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
        <div style={{ fontSize: 90, fontWeight: 900, letterSpacing: 6 }}>
          <span style={{ color: C.white }}>GUESS</span>
          <span style={{ color: C.cyan, textShadow: `0 0 40px ${C.cyanGlow}` }}>LIX</span>
          <span style={{ color: C.gold, marginLeft: 10 }}>?</span>
        </div>
        <div
          style={{
            fontSize: 20,
            color: C.textMuted,
            letterSpacing: 6,
            marginTop: 16,
            fontWeight: 700,
          }}
        >
          GUESS THE FLAG
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
  score: number;
  streak: number;
  showFunFact: boolean;
}

const QuestionScene: React.FC<QuestionSceneProps> = ({
  question,
  questionNumber,
  totalQuestions,
  category,
  score,
  streak,
  showFunFact,
}) => {
  const frame = useCurrentFrame();

  const enterEnd = PHASE.enter;
  const timerEnd = enterEnd + PHASE.timer(question.timerSeconds);
  const revealEnd = timerEnd + PHASE.reveal;
  const totalRevealAndFact = PHASE.reveal + (showFunFact && question.funFact ? PHASE.funFact : 0);

  const phase =
    frame < enterEnd ? "enter" :
    frame < timerEnd ? "timer" :
    frame < revealEnd ? "reveal" : "funfact";

  const revealState = phase === "reveal" || phase === "funfact" ? "shown" : "hidden";

  // All answers are always correct (viewer guesses, video reveals correct answer)
  const isCorrect = true;
  const points = streak >= 3 ? 150 : 100;

  // Score display updates after reveal
  const displayScore = phase === "enter" || phase === "timer"
    ? score
    : score + points;

  const displayStreak = phase === "enter" || phase === "timer"
    ? streak
    : streak + 1;

  // Timer countdown seconds
  const timerElapsed = Math.max(0, frame - enterEnd);
  const remaining = Math.max(0, Math.ceil(question.timerSeconds - timerElapsed / FPS));

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

      {/* Countdown beeps in last 3 seconds */}
      {phase === "timer" && remaining <= 3 && remaining > 0 && (
        <Audio
          src={staticFile("audio/countdown.wav")}
          volume={0.4}
          startFrom={0}
        />
      )}

      {/* Answer reveal - mounted in its own Sequence so frame resets to 0 */}
      {(phase === "reveal" || phase === "funfact") && (
        <Sequence from={timerEnd} durationInFrames={totalRevealAndFact}>
          <AnswerReveal
            isCorrect={isCorrect}
            points={points}
            funFact={question.funFact}
            showFact={showFunFact}
          />
        </Sequence>
      )}

      {/* Correct ding sound on reveal */}
      <Sequence from={timerEnd} durationInFrames={FPS}>
        <Audio src={staticFile("audio/correct.wav")} volume={0.6} />
      </Sequence>

      <DifficultyBar current={questionNumber} total={totalQuestions} />
    </AbsoluteFill>
  );
};

/* ===== MAIN COMPOSITION ===== */
export const LongQuiz: React.FC<{ quizData: QuizData }> = ({ quizData }) => {
  const { questions, category, totalQuestions } = quizData;

  // All answers are always correct — calculate running scores
  let runningScore = 0;
  let runningStreak = 0;
  let bestStreak = 0;

  const scoreMap = questions.map((_q, _i) => {
    const score = runningScore;
    const streak = runningStreak;

    const pts = runningStreak >= 3 ? 150 : 100;
    runningScore += pts;
    runningStreak += 1;
    if (runningStreak > bestStreak) bestStreak = runningStreak;

    return { score, streak };
  });

  const finalScore = runningScore;
  const correctCount = questions.length;

  // Build sequence offsets
  const introFrames = 90; // 3 seconds
  let offset = introFrames;

  const questionOffsets = questions.map((q) => {
    const start = offset;
    const showFact = !!q.funFact;
    const duration = questionFrames(q, showFact);
    offset += duration;
    return { start, duration, showFact };
  });

  const outroStart = offset;
  const outroDuration = 450; // 15 seconds

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
