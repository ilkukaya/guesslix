import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { FlagQuizV3Props } from '../types';
import { AtlasBackground } from '../components/AtlasBackground';
import { FilmGrain } from '../components/FilmGrain';
import { IntroScene } from '../components/IntroScene';
import { OutroScene } from '../components/OutroScene';
import { FlagScene, SCENE_FRAMES } from '../components/FlagScene';

loadAnton();
loadInter();

const SHORT_INTRO_FRAMES = 60; // 2s
const SHORT_OUTRO_FRAMES = 90; // 3s

export const calcShortV3Duration = (questionCount: number): number =>
  SHORT_INTRO_FRAMES + questionCount * SCENE_FRAMES + SHORT_OUTRO_FRAMES;

/**
 * v3 short-form composition (1080×1920, 30fps). 10 questions =
 * 60 + 10×180 + 90 = 1,950 frames ≈ 65s. Pads under YT Shorts cap
 * with energy-front-loaded pacing.
 */
export const ShortQuizV3: React.FC<FlagQuizV3Props> = ({
  questions,
  maxQuestions,
}) => {
  const active = questions.slice(0, maxQuestions);
  const introEnd = SHORT_INTRO_FRAMES;
  const outroStart = introEnd + active.length * SCENE_FRAMES;

  return (
    <AbsoluteFill>
      <AtlasBackground />
      <FilmGrain />

      <Audio src={staticFile('audio/bgm.wav')} volume={0.2} loop />

      <Sequence from={0} durationInFrames={SHORT_INTRO_FRAMES} name="Intro">
        <IntroScene totalQuestions={active.length} layout="portrait" />
      </Sequence>

      {active.map((q, i) => {
        const from = introEnd + i * SCENE_FRAMES;
        return (
          <Sequence
            key={q.id}
            from={from}
            durationInFrames={SCENE_FRAMES}
            name={`Q${i + 1}-${q.country}`}
          >
            <FlagScene
              question={q}
              questionIndex={i + 1}
              totalQuestions={active.length}
              startFrame={from}
              layout="portrait"
            />
          </Sequence>
        );
      })}

      <Sequence
        from={outroStart}
        durationInFrames={SHORT_OUTRO_FRAMES}
        name="Outro"
      >
        <OutroScene totalQuestions={active.length} layout="portrait" />
      </Sequence>
    </AbsoluteFill>
  );
};
