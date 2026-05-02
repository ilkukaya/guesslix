import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FlagQuestion } from '../../types/flagQuiz';
import { theme, Layout } from '../../theme';
import { CounterPill } from './CounterPill';
import { FlagDisplay } from './FlagDisplay';
import { TimerRingV2 } from './TimerRingV2';

interface FlagQuestionSceneProps {
  question: FlagQuestion;
  /** 1-based question index for display */
  questionIndex: number;
  totalQuestions: number;
  /** Absolute frame this scene starts at */
  startFrame: number;
  layout: Layout;
}

// Per-scene frame budget breakdown
const PILL_FRAMES = 15;     // 0–14: pill entrance
const ZOOM_FRAMES = 30;     // 15–44: close-up zoom
const TIMER_FRAMES = 120;   // 45–164: 4s countdown
const REVEAL_FRAMES = 16;   // 165–180: answer reveal
const ZOOM_START = PILL_FRAMES;
const TIMER_START = PILL_FRAMES + ZOOM_FRAMES;
const REVEAL_START = TIMER_START + TIMER_FRAMES;

/**
 * Single 180-frame (6s) flag question scene.
 * Phases: pill entrance → zoomed flag → full flag + timer → answer reveal.
 */
export const FlagQuestionScene: React.FC<FlagQuestionSceneProps> = ({
  question,
  questionIndex,
  totalQuestions,
  startFrame,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - startFrame; // local frame (0–179)

  const isLandscape = layout === 'landscape';
  const flagSize = isLandscape ? 600 : 380;

  // ── Phase 1 (0–14): Pill entrance ─────────────────────────────────
  // CounterPill handles its own spring internally from startFrame

  // ── Phase 2 (15–44): Zoom close-up ────────────────────────────────
  const zoomProgress = spring({
    frame: lf - ZOOM_START,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  // During zoom phase: starts at 3x, spring-zooms out to 1x
  const zoomScale = lf < ZOOM_START
    ? 3
    : lf < TIMER_START
    ? interpolate(zoomProgress, [0, 1], [3, 1])
    : 1;

  // Shake during zoom phase
  const shakeX = lf >= ZOOM_START && lf < TIMER_START
    ? Math.sin(lf * 1.7) * 2
    : 0;
  const shakeY = lf >= ZOOM_START && lf < TIMER_START
    ? Math.cos(lf * 2.1) * 2
    : 0;

  // Camera shake in last second of timer (frames TIMER_START+90 to TIMER_START+120)
  const lastSecondFrame = lf - (TIMER_START + 90);
  const camShakeX = lastSecondFrame > 0 && lastSecondFrame < 30
    ? Math.sin(lastSecondFrame * 2.3) * 3
    : 0;
  const camShakeY = lastSecondFrame > 0 && lastSecondFrame < 30
    ? Math.cos(lastSecondFrame * 1.9) * 3
    : 0;

  // ── Phase 4 (165–180): Answer reveal ──────────────────────────────
  const revealProgress = spring({
    frame: lf - REVEAL_START,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const answerY = lf >= REVEAL_START
    ? interpolate(revealProgress, [0, 1], [320, 0])
    : 320;
  const answerOpacity = lf >= REVEAL_START
    ? interpolate(revealProgress, [0, 0.3], [0, 1])
    : 0;

  // Background color flash on reveal (frames 165–175)
  const flashOpacity = lf >= REVEAL_START
    ? interpolate(lf - REVEAL_START, [0, 4, 14], [0, 0.35, 0], {
        extrapolateRight: 'clamp',
      })
    : 0;

  // ── Sound effects ──────────────────────────────────────────────────
  // Tick at each second boundary within the timer phase
  const isSecondBoundary = (f: number) => f >= TIMER_START && (f - TIMER_START) % fps === 0 && f < REVEAL_START;

  const fontSize = {
    answer: isLandscape ? theme.fontSizes.landscape.answer : theme.fontSizes.portrait.answer,
    question: isLandscape ? theme.fontSizes.landscape.question : theme.fontSizes.portrait.question,
  };

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${shakeX + camShakeX}px, ${shakeY + camShakeY}px)`,
      }}
    >
      {/* Color flash overlay on reveal */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${question.primaryColors[0]}, ${question.primaryColors[1]}, ${question.primaryColors[2]})`,
            opacity: flashOpacity,
            zIndex: 5,
          }}
        />
      )}

      {/* Flag container */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: lf < TIMER_START ? 'hidden' : 'visible',
        }}
      >
        <div
          style={{
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center',
          }}
        >
          <FlagDisplay countryCode={question.countryCode} size={flagSize} />
        </div>
      </AbsoluteFill>

      {/* Timer ring — visible only during timer phase */}
      {lf >= TIMER_START && lf < REVEAL_START && (
        <TimerRingV2
          timerStartFrame={startFrame + TIMER_START}
          radius={isLandscape ? 90 : 72}
          strokeWidth={isLandscape ? 12 : 10}
        />
      )}

      {/* Counter pill — always visible after first frame */}
      <CounterPill
        current={questionIndex}
        total={totalQuestions}
        startFrame={startFrame}
      />

      {/* Answer reveal card */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `translateY(${answerY}px)`,
          opacity: answerOpacity,
          zIndex: 20,
          paddingBottom: 48,
        }}
      >
        <div
          style={{
            background: theme.colors.bgElevated,
            border: `3px solid ${theme.colors.accentCorrect}`,
            borderRadius: 20,
            padding: '20px 60px',
            textAlign: 'center',
            boxShadow: `0 0 60px ${theme.colors.accentCorrect}44`,
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: fontSize.answer,
              color: theme.colors.accentCorrect,
              letterSpacing: 4,
              lineHeight: 1.1,
              display: 'block',
              textTransform: 'uppercase',
            }}
          >
            {question.country}
          </span>
          {question.funFact && (
            <span
              style={{
                fontFamily: theme.fonts.body,
                fontSize: isLandscape ? 28 : 22,
                color: theme.colors.textMuted,
                display: 'block',
                marginTop: 8,
                maxWidth: isLandscape ? 900 : 700,
              }}
            >
              {question.funFact}
            </span>
          )}
        </div>
      </div>

      {/* Tick sounds — one per second during timer */}
      {[0, 1, 2, 3].map((sec) => {
        const tickFrame = startFrame + TIMER_START + sec * fps;
        return frame === tickFrame ? (
          <Audio
            key={sec}
            src={staticFile('audio/tick.wav')}
            startFrom={0}
            volume={0.8}
          />
        ) : null;
      })}

      {/* Reveal sound */}
      {frame === startFrame + REVEAL_START && (
        <Audio src={staticFile('audio/reveal.wav')} startFrom={0} volume={0.9} />
      )}
    </AbsoluteFill>
  );
};
