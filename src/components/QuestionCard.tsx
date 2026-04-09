import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "../themes/tokens";
import { QuizQuestion, FPS } from "../types";

interface Props {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  category: string;
}

export const QuestionCard: React.FC<Props> = ({
  question,
  questionNumber,
  totalQuestions,
  category,
}) => {
  const frame = useCurrentFrame();

  // Entry animation
  const enterProgress = spring({ frame, fps: FPS, config: { damping: 18 } });
  const y = interpolate(enterProgress, [0, 1], [60, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `translateY(${y}px)`,
        opacity,
        fontFamily: FONT,
        paddingTop: 80,
      }}
    >
      {/* Category label */}
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 4,
          color: C.textMuted,
          textTransform: "uppercase",
        }}
      >
        {category.replace(/_/g, " ")}
      </div>

      {/* Question number */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: C.cyan,
          marginTop: 6,
        }}
      >
        QUESTION {questionNumber} / {totalQuestions}
      </div>

      {/* Question text */}
      <div
        style={{
          fontSize: 42,
          fontWeight: 900,
          color: C.white,
          textAlign: "center",
          marginTop: 28,
          maxWidth: 900,
          lineHeight: 1.2,
        }}
      >
        {question.questionText}
      </div>

      {/* Emoji / media */}
      {question.emoji && (
        <div
          style={{
            fontSize: 120,
            marginTop: 30,
            filter: `drop-shadow(0 0 20px ${C.cyanGlow})`,
          }}
        >
          {question.emoji}
        </div>
      )}
    </div>
  );
};
