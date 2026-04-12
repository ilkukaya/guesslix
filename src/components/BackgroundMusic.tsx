import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { FPS } from "../types";

const BGM_SRC = "audio/bgm.wav";
const BGM_DURATION = 180 * FPS; // 3 min = 5400 frames @ 30fps

export interface VolumeKeyframe {
  frame: number;
  volume: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Linear interpolation across sorted keyframes */
export function volumeAt(frame: number, schedule: VolumeKeyframe[]): number {
  if (schedule.length === 0) return 0;
  if (frame <= schedule[0].frame) return schedule[0].volume;
  const last = schedule[schedule.length - 1];
  if (frame >= last.frame) return last.volume;
  for (let i = 0; i < schedule.length - 1; i++) {
    if (frame >= schedule[i].frame && frame < schedule[i + 1].frame) {
      const t =
        (frame - schedule[i].frame) /
        (schedule[i + 1].frame - schedule[i].frame);
      return lerp(schedule[i].volume, schedule[i + 1].volume, t);
    }
  }
  return last.volume;
}

/* ---- Volume presets ---- */
export const V = {
  silent: 0,
  duck: 0.06, // timer ticks playing — stay low
  base: 0.12, // normal cruising level
  mid: 0.15, // reveal / fun-fact — slight excitement
  high: 0.18, // intro, transitions — full energy
} as const;

/* ---- Ramp width (frames) for smooth transitions ---- */
export const RAMP = 8;

interface Props {
  totalFrames: number;
  schedule: VolumeKeyframe[];
}

/**
 * Loops a 3-minute background music track for the entire video length
 * with frame-accurate volume ducking driven by a keyframe schedule.
 */
export const BackgroundMusic: React.FC<Props> = ({ totalFrames, schedule }) => {
  const loops = Math.ceil(totalFrames / BGM_DURATION);

  return (
    <>
      {Array.from({ length: loops }, (_, i) => {
        const start = i * BGM_DURATION;
        const dur = Math.min(BGM_DURATION, totalFrames - start);
        if (dur <= 0) return null;
        return (
          <Sequence key={i} from={start} durationInFrames={dur}>
            <Audio
              src={staticFile(BGM_SRC)}
              volume={(localFrame) =>
                Math.max(0, volumeAt(start + localFrame, schedule))
              }
            />
          </Sequence>
        );
      })}
    </>
  );
};
