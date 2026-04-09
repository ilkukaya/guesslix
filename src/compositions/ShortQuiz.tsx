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
import { QuestionCard } from "../components/QuestionCard";
import { OptionsGrid } from "../components/OptionsReveal";
import { TimerRing } from "../components/TimerRing";

/* Short outro with CTA */
const ShortOutro: React.FC<{ total: number }> = ({ total }) => {
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
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: C.gold,
            textShadow: `0 0 40px ${C.goldGlow}`,
          }}
        >
          How many did you get?
        </div>
        <div
          style={{
            fontSize: 22,
            color: C.cyan,
            fontWeight: 700,
            marginTop: 16,
          }}
        >
          Comment below! 👇
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 20,
            color: C.textSec,
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          Want the full 50-question challenge?
        </div>
        <div style={{ fontSize: 22, color: C.cyan, fontWeight: 900, marginTop: 8 }}>
          Full quiz on channel
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

/* Question scene for shorts */
const ShortQuestion: React.FC<{
  question: QuizData["questions"][0];
  num: number;
  total: number;
  category: string;
}> = ({ question, num, total, category }) => {
  const frame = useCurrentFrame();
  const enterEnd = PHASE.enter;
  const timerEnd = enterEnd + PHASE.timer(question.timerSeconds);
  const phase = frame < enterEnd ? "enter" : frame < timerEnd ? "timer" : "reveal";
  const revealState = phase === "reveal" ? "shown" : "hidden";

  return (
    <AbsoluteFill>
      {/* Question counter */}
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 20,
          fontFamily: FONT,
          fontSize: 18,
          fontWeight: 900,
          color: C.cyan,
          zIndex: 90,
        }}
      >
        {num}/{total}
      </div>

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
      {/* Whoosh on enter */}
      <Sequence from={0} durationInFrames={FPS}>
        <Audio src={staticFile("audio/whoosh.wav")} volume={0.3} />
      </Sequence>
      {/* Timer ticks */}
      {Array.from({ length: Math.max(0, question.timerSeconds - 3) }, (_, i) => (
        <Sequence key={`tn-${i}`} from={enterEnd + i * FPS} durationInFrames={FPS}>
          <Audio src={staticFile("audio/tick.wav")} volume={0.2} />
        </Sequence>
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <Sequence key={`tf-${i}`} from={enterEnd + Math.max(0, question.timerSeconds - 3) * FPS + i * Math.floor(FPS / 2)} durationInFrames={Math.floor(FPS / 2)}>
          <Audio src={staticFile("audio/tick_fast.wav")} volume={0.25} />
        </Sequence>
      ))}
      {/* Correct ding on reveal */}
      <Sequence from={timerEnd} durationInFrames={FPS}>
        <Audio src={staticFile("audio/correct.wav")} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};

/* Main ShortQuiz composition */
export const ShortQuiz: React.FC<{ quizData: QuizData }> = ({ quizData }) => {
  const { questions, category } = quizData;
  const shorts = questions.slice(0, 5);

  let offset = 0;
  const offsets = shorts.map((q) => {
    const start = offset;
    const duration = questionFrames(q, false);
    offset += duration;
    return { start, duration };
  });

  const outroDuration = 90;

  return (
    <AbsoluteFill>
      <Background />
      {/* Colored watermark */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          fontFamily: FONT,
          fontSize: 16,
          fontWeight: 900,
          letterSpacing: 2,
          opacity: 0.35,
          zIndex: 100,
        }}
      >
        <span style={{ color: C.white }}>GUESS</span>
        <span style={{ color: C.cyan }}>LIX</span>
      </div>

      {shorts.map((q, i) => (
        <Sequence key={q.id} from={offsets[i].start} durationInFrames={offsets[i].duration}>
          <ShortQuestion
            question={q}
            num={i + 1}
            total={shorts.length}
            category={category}
          />
        </Sequence>
      ))}

      <Sequence from={offset} durationInFrames={outroDuration}>
        <ShortOutro total={shorts.length} />
      </Sequence>
    </AbsoluteFill>
  );
};
