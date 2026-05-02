import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';

interface SoundFxProps {
  /** Path under /public, e.g. "audio/tick.wav". */
  src: string;
  /** Absolute frame at which to start playing (relative to nearest parent Sequence). */
  from: number;
  /** Volume 0-1. */
  volume?: number;
  /** How long to keep the audio mounted. Should be ≥ the SFX file length. */
  durationInFrames?: number;
}

/**
 * One-shot SFX helper. Wraps `<Audio>` in a `<Sequence>` so the player
 * mounts the audio for a full window — playing back the whole clip.
 *
 * Why this exists: `{frame === X && <Audio />}` only mounts for ONE frame
 * which means the audio never actually plays back (Remotion needs the
 * Audio component present for the duration of playback).
 */
export const SoundFx: React.FC<SoundFxProps> = ({
  src,
  from,
  volume = 1,
  durationInFrames = 60,
}) => (
  <Sequence from={from} durationInFrames={durationInFrames} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);
