import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "../themes/tokens";
import { QuizQuestion, FPS, PHASE, resolveType } from "../types";
import { QuestionVisual } from "./QuestionVisual";

interface Props {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  category: string;
  isRevealed?: boolean;
}

export const QuestionCard: React.FC<Props> = ({
  question,
  questionNumber,
  totalQuestions,
  category,
  isRevealed = false,
}) => {
  const frame = useCurrentFrame();
  const type = resolveType(question);

  const enterProgress = spring({ frame, fps: FPS, config: { damping: 18 } });
  const y = interpolate(enterProgress, [0, 1], [60, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  const diffColor =
    question.difficulty === "easy"
      ? C.correct
      : question.difficulty === "medium"
        ? C.gold
        : question.difficulty === "hard"
          ? "#FF8C00"
          : C.wrong;

  // text_only: bigger question text, no visual
  const isTextOnly = type === "text_only";
  const questionFontSize = isTextOnly ? 56 : 42;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `translateY(${y}px)`,
        opacity,
        fontFamily: FONT,
        paddingTop: 72,
      }}
    >
      {/* Category label */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 4,
          color: C.textMuted,
          textTransform: "uppercase",
        }}
      >
        {category.replace(/_/g, " ")}
      </div>

      {/* Question number + difficulty */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.cyan }}>
          QUESTION {questionNumber} / {totalQuestions}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 900,
            color: diffColor,
            letterSpacing: 2,
            padding: "3px 10px",
            borderRadius: 6,
            border: `1px solid ${diffColor}`,
            textTransform: "uppercase",
          }}
        >
          {question.difficulty}
        </div>
      </div>

      {/* Question text */}
      <div
        style={{
          fontSize: questionFontSize,
          fontWeight: 900,
          color: C.white,
          textAlign: "center",
          marginTop: isTextOnly ? 60 : 20,
          maxWidth: 900,
          lineHeight: 1.2,
        }}
      >
        {question.questionText}
      </div>

      {/* Visual — type-based (QuestionVisual handles the switch) */}
      <QuestionVisual
        question={question}
        size={320}
        enterDuration={PHASE.enter}
        isRevealed={isRevealed}
      />
    </div>
  );
};
