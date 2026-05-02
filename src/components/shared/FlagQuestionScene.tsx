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
// @ts-ignore
import 'flag-icons/css/flag-icons.min.css';
import { FlagQuestion } from '../../types/flagQuiz';
import { theme, Layout } from '../../theme';
import { TimerRingV2 } from './TimerRingV2';

interface FlagQuestionSceneProps {
  question: FlagQuestion;
  questionIndex: number;
  totalQuestions: number;
  startFrame: number;
  layout: Layout;
}

const PILL_FRAMES  = 15;
const ZOOM_FRAMES  = 30;
const TIMER_FRAMES = 120;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const REVEAL_FRAMES = 15;

const ZOOM_START   = PILL_FRAMES;                       // 15
const TIMER_START  = PILL_FRAMES + ZOOM_FRAMES;         // 45
const REVEAL_START = TIMER_START + TIMER_FRAMES;        // 165

/**
 * Single 180-frame (6s) flag question scene.
 * Flag lives inside a bounded card — no full-screen takeover.
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
  const lf = frame - startFrame;

  const isLandscape = layout === 'landscape';

  // Card dimensions — flag lives inside these bounds
  const cardW = isLandscape ? 720 : 500;
  const cardH = isLandscape ? 480 : 340; // 4:3
  // The `fi` class renders: width = fontSize * 1.333, height = fontSize
  // So to fill the card: fontSize = cardH
  const baseFontSize = cardH;

  // ── Zoom scale (inside bounded card) ──────────────────────────────
  const zoomSpring = spring({
    frame: lf - ZOOM_START,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const zoomScale =
    lf < ZOOM_START ? 3
    : lf < TIMER_START ? interpolate(zoomSpring, [0, 1], [3, 1])
    : 1;

  // Shake during zoom phase (±2px on the card)
  const shakeX = lf >= ZOOM_START && lf < TIMER_START ? Math.sin(lf * 1.7) * 2 : 0;
  const shakeY = lf >= ZOOM_START && lf < TIMER_START ? Math.cos(lf * 2.1) * 2 : 0;

  // Camera shake — last second of timer (frames 150–164 relative)
  const lastSecLf = lf - (TIMER_START + 90);
  const camX = lastSecLf > 0 && lastSecLf < 30 ? Math.sin(lastSecLf * 2.3) * 3 : 0;
  const camY = lastSecLf > 0 && lastSecLf < 30 ? Math.cos(lastSecLf * 1.9) * 3 : 0;

  // ── Header entrance ───────────────────────────────────────────────
  const headerOpacity = interpolate(lf, [0, 14], [0, 1], { extrapolateRight: 'clamp' });

  // ── Answer reveal ─────────────────────────────────────────────────
  const revealSpring = spring({
    frame: lf - REVEAL_START,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const answerSlideY = lf >= REVEAL_START ? interpolate(revealSpring, [0, 1], [280, 0]) : 280;
  const answerOpacity = lf >= REVEAL_START ? interpolate(revealSpring, [0, 0.25], [0, 1]) : 0;

  // Flag color flash on reveal
  const flashOpacity =
    lf >= REVEAL_START
      ? interpolate(lf - REVEAL_START, [0, 3, 12], [0, 0.4, 0], { extrapolateRight: 'clamp' })
      : 0;

  // ── Sizes ─────────────────────────────────────────────────────────
  const answerFontSize  = isLandscape ? 96 : 68;
  const headerFontSize  = isLandscape ? 40 : 30;
  const subLabelSize    = isLandscape ? 32 : 24;
  const pillFontSize    = isLandscape ? 28 : 22;

  return (
    <AbsoluteFill
      style={{ transform: `translate(${camX}px, ${camY}px)` }}
    >
      {/* ── Color flash on reveal ── */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${question.primaryColors[0]}, ${question.primaryColors[1]}, ${question.primaryColors[2]})`,
            opacity: flashOpacity,
            zIndex: 5,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── TOP HEADER BAR ────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: isLandscape ? 96 : 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isLandscape ? '0 52px' : '0 36px',
          background: 'linear-gradient(to bottom, rgba(10,14,39,0.98) 60%, transparent)',
          zIndex: 30,
          opacity: headerOpacity,
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: headerFontSize,
            color: theme.colors.accentPrimary,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          GUESS THE FLAG
        </span>

        {/* Question counter pill */}
        <div
          style={{
            background: theme.colors.bgElevated,
            border: `2px solid ${theme.colors.accentPrimary}`,
            borderRadius: 999,
            padding: isLandscape ? '8px 24px' : '6px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: pillFontSize + 4,
              color: theme.colors.accentPrimary,
              lineHeight: 1,
            }}
          >
            {questionIndex}
          </span>
          <span
            style={{
              fontFamily: theme.fonts.body,
              fontSize: pillFontSize - 2,
              color: theme.colors.textMuted,
              lineHeight: 1,
            }}
          >
            / {totalQuestions}
          </span>
        </div>
      </div>

      {/* ── FLAG CARD — bounded container, zoom inside ─────────────── */}
      <div
        style={{
          position: 'absolute',
          top: isLandscape ? '42%' : '40%',
          left: '50%',
          transform: `translate(-50%, -50%) translate(${shakeX}px, ${shakeY}px)`,
          zIndex: 10,
        }}
      >
        {/* Bounded card with overflow:hidden — zoom is clipped here */}
        <div
          style={{
            width: cardW,
            height: cardH,
            overflow: 'hidden',
            borderRadius: 14,
            boxShadow: '0 28px 80px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.5)',
            position: 'relative',
            border: `2px solid rgba(255,255,255,0.08)`,
          }}
        >
          {/* Flag centered and scaled WITHIN the card */}
          <span
            className={`fi fi-${question.countryCode.toLowerCase()}`}
            style={{
              fontSize: baseFontSize,
              display: 'block',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${zoomScale})`,
              transformOrigin: 'center',
            }}
          />
        </div>
      </div>

      {/* ── WHICH COUNTRY? label ─────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: isLandscape ? 260 : 320,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 20,
          opacity: lf >= ZOOM_START && lf < REVEAL_START ? headerOpacity : 0,
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.body,
            fontSize: subLabelSize,
            color: theme.colors.textMuted,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          Which country is this? 🤔
        </span>
      </div>

      {/* ── TIMER RING ────────────────────────────────────────────────── */}
      {lf >= TIMER_START && lf < REVEAL_START && (
        <div
          style={{
            position: 'absolute',
            bottom: isLandscape ? 60 : 80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
          }}
        >
          <TimerRingInline
            timerStartFrame={startFrame + TIMER_START}
            radius={isLandscape ? 72 : 56}
            strokeWidth={isLandscape ? 11 : 9}
          />
        </div>
      )}

      {/* ── ANSWER REVEAL ────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: isLandscape ? 52 : 60,
          transform: `translateY(${answerSlideY}px)`,
          opacity: answerOpacity,
          zIndex: 25,
        }}
      >
        <div
          style={{
            background: theme.colors.bgElevated,
            border: `3px solid ${theme.colors.accentCorrect}`,
            borderRadius: 20,
            padding: isLandscape ? '24px 72px' : '18px 48px',
            textAlign: 'center',
            boxShadow: `0 0 80px ${theme.colors.accentCorrect}55`,
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: answerFontSize,
              color: theme.colors.accentCorrect,
              letterSpacing: 4,
              textTransform: 'uppercase',
              display: 'block',
              lineHeight: 1.1,
            }}
          >
            {question.country}
          </span>
          <span
            style={{
              fontFamily: theme.fonts.body,
              fontSize: isLandscape ? 24 : 18,
              color: theme.colors.textMuted,
              display: 'block',
              marginTop: 10,
              maxWidth: isLandscape ? 860 : 620,
            }}
          >
            {question.funFact}
          </span>
        </div>
      </div>

      {/* ── AUDIO ─────────────────────────────────────────────────────── */}
      {[0, 1, 2, 3].map((sec) =>
        frame === startFrame + TIMER_START + sec * fps ? (
          <Audio key={sec} src={staticFile('audio/tick.wav')} startFrom={0} volume={0.8} />
        ) : null,
      )}
      {frame === startFrame + REVEAL_START && (
        <Audio src={staticFile('audio/reveal.wav')} startFrom={0} volume={0.9} />
      )}
    </AbsoluteFill>
  );
};

/* ── Inline timer ring (positioned by parent, no absolute self-positioning) ── */
interface TimerInlineProps {
  timerStartFrame: number;
  radius: number;
  strokeWidth: number;
}

const TimerRingInline: React.FC<TimerInlineProps> = ({
  timerStartFrame,
  radius,
  strokeWidth,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TIMER_FRAMES_INNER = 4 * fps;
  const localFrame = frame - timerStartFrame;
  const progress = Math.min(1, Math.max(0, localFrame / TIMER_FRAMES_INNER));
  const circumference = 2 * Math.PI * radius;
  const dashOffset = progress * circumference;
  const displayNumber = Math.max(1, Math.ceil(4 * (1 - progress)));

  const ringColor = progress >= 0.75 ? theme.colors.accentSecondary : theme.colors.accentPrimary;

  const frameWithinSecond = localFrame % fps;
  const pulseSpring = spring({ frame: frameWithinSecond, fps, config: { damping: 8, stiffness: 300 } });
  const numScale = interpolate(pulseSpring, [0, 1], [1.3, 1]);

  const size = (radius + strokeWidth) * 2 + 4;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={ringColor} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: radius,
          color: ringColor,
          lineHeight: 1,
          transform: `scale(${numScale})`,
          display: 'block',
          textShadow: `0 0 24px ${ringColor}88`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {displayNumber}
      </span>
    </div>
  );
};
