import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { tokens, Layout, sizes } from '../theme';
import { FlagQuestion, SWEEP_DIRECTION } from '../types';
import { MetaStrip } from './MetaStrip';
import { TimerBar } from './TimerBar';
import { GhostCountdown } from './GhostCountdown';
import { FlagPlate } from './FlagPlate';
import { CountryReveal } from './CountryReveal';
import { ColorBars } from './ColorBars';
import { SoundFx } from './SoundFx';

interface FlagSceneProps {
  question: FlagQuestion;
  questionIndex: number;
  totalQuestions: number;
  /** Absolute frame this scene starts at. */
  startFrame: number;
  layout: Layout;
}

// 6-second scene = 180 frames at 30fps, sliced as:
//   0-15  (0.5s) sweep-in + meta enters, flag arriving
//   15-135 (4s)  timer running — flag full, ghost countdown 4→1
//   135-150 (0.5s) "time" flash + reveal kickoff
//   150-180 (1s) country reveal, color bars, fact
const SWEEP_FRAMES = 15;
const TIMER_FRAMES = 120; // 4s
const FLASH_FRAMES = 15;
const REVEAL_FRAMES = 30;

const TIMER_START = SWEEP_FRAMES; // 15
const FLASH_START = TIMER_START + TIMER_FRAMES; // 135
const REVEAL_START = FLASH_START + FLASH_FRAMES; // 150

/**
 * v3 single-question scene — 180 frames (6s).
 * Layout: meta strip top, flag center (large), country reveal bottom,
 * color bars at the very bottom edge during reveal. Ghost countdown
 * sits behind the flag during the timer phase.
 */
export const FlagScene: React.FC<FlagSceneProps> = ({
  question,
  questionIndex,
  totalQuestions,
  startFrame,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lf = frame - startFrame;
  const s = sizes(layout);
  const land = layout === 'landscape';

  // ── flag sweep-in (directional from continent) ────────────────────
  const sweepDir = SWEEP_DIRECTION[question.continent];
  const sweep = spring({
    frame: lf,
    fps,
    config: tokens.motion.weighted,
  });
  const sweepProg = interpolate(sweep, [0, 1], [0, 1]);
  const flagDistance = land ? 280 : 220;
  const sweepX =
    sweepDir === 'left'
      ? interpolate(sweepProg, [0, 1], [-flagDistance, 0])
      : sweepDir === 'right'
        ? interpolate(sweepProg, [0, 1], [flagDistance, 0])
        : 0;
  const sweepY =
    sweepDir === 'top'
      ? interpolate(sweepProg, [0, 1], [-flagDistance, 0])
      : sweepDir === 'bottom'
        ? interpolate(sweepProg, [0, 1], [flagDistance, 0])
        : 0;
  const flagOpacity = interpolate(lf, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // ── parallax drift during timer phase ─────────────────────────────
  const drift = lf - TIMER_START;
  const driftX = drift > 0 ? Math.sin(drift / 60) * 6 : 0;
  const driftY = drift > 0 ? Math.cos(drift / 80) * 4 : 0;

  // ── camera shake during final second of timer ─────────────────────
  const lastSec = lf - (FLASH_START - fps);
  const shake =
    lastSec > 0 && lastSec < fps
      ? interpolate(lastSec, [0, fps], [0, 1])
      : 0;
  const camX = shake * Math.sin(lf * 2.4) * 4;
  const camY = shake * Math.cos(lf * 2.0) * 4;

  // ── time-up flash (white pop, 0.5s) ───────────────────────────────
  const flashLf = lf - FLASH_START;
  const flashOpacity =
    flashLf >= 0 && flashLf < FLASH_FRAMES
      ? interpolate(flashLf, [0, 3, FLASH_FRAMES], [0, 0.55, 0])
      : 0;

  // ── reveal lift — flag lifts and dims slightly so name lands ─────
  const lift = spring({
    frame: lf - REVEAL_START,
    fps,
    config: tokens.motion.weighted,
  });
  const flagLift = lf >= REVEAL_START ? interpolate(lift, [0, 1], [0, -40]) : 0;
  const flagDim = lf >= REVEAL_START ? interpolate(lift, [0, 1], [1, 0.35]) : 1;

  // ── flag y position — center in landscape, slightly upper-half in portrait ──
  const flagTop = land ? '46%' : '34%';

  return (
    <AbsoluteFill
      style={{ transform: `translate(${camX}px, ${camY}px)` }}
    >
      {/* ── ghost countdown (behind flag) ── */}
      <GhostCountdown
        timerStartFrame={startFrame + TIMER_START}
        seconds={4}
        layout={layout}
      />

      {/* ── flag plate ── */}
      <div
        style={{
          position: 'absolute',
          top: flagTop,
          left: '50%',
          transform: `translate(-50%, -50%) translate(${sweepX}px, ${sweepY + flagLift}px)`,
          opacity: flagOpacity * flagDim,
          zIndex: 10,
        }}
      >
        <FlagPlate
          countryCode={question.countryCode}
          width={s.flagWidth}
          height={s.flagHeight}
          driftX={driftX}
          driftY={driftY}
          framed
        />
      </div>

      {/* ── meta strip top ── */}
      <MetaStrip
        questionIndex={questionIndex}
        totalQuestions={totalQuestions}
        continent={question.continent}
        difficulty={question.difficulty}
        layout={layout}
        entranceFrame={startFrame}
      />

      {/* ── slim timer bar ── */}
      {lf >= TIMER_START && lf < FLASH_START && (
        <TimerBar
          timerStartFrame={startFrame + TIMER_START}
          seconds={4}
          layout={layout}
        />
      )}

      {/* ── flash on time-up ── */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            background: tokens.colors.paper,
            opacity: flashOpacity,
            zIndex: 50,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── reveal: country name + fact ── */}
      {lf >= REVEAL_START && (
        <>
          <CountryReveal
            country={question.country}
            funFact={question.funFact}
            startFrame={REVEAL_START}
            layout={layout}
          />
          <ColorBars
            colors={question.primaryColors}
            startFrame={REVEAL_START}
            layout={layout}
          />
        </>
      )}

      {/* ── audio cues — Sequence-wrapped so they actually play ── */}
      <SoundFx src="audio/whoosh.wav" from={0} volume={0.5} durationInFrames={30} />
      {[0, 1, 2, 3].map((sec) => (
        <SoundFx
          key={sec}
          src={sec === 3 ? 'audio/tick_fast.wav' : 'audio/tick.wav'}
          from={TIMER_START + sec * fps}
          volume={sec === 3 ? 0.9 : 0.55}
          durationInFrames={fps}
        />
      ))}
      <SoundFx src="audio/pop.wav" from={FLASH_START} volume={0.7} durationInFrames={20} />
      <SoundFx src="audio/correct.wav" from={REVEAL_START} volume={0.85} durationInFrames={45} />
    </AbsoluteFill>
  );
};

export const SCENE_FRAMES = SWEEP_FRAMES + TIMER_FRAMES + FLASH_FRAMES + REVEAL_FRAMES; // 180
