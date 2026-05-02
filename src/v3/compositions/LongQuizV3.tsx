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

export const INTRO_FRAMES_V3 = 90;
export const OUTRO_FRAMES_V3 = 150;

export const calcLongV3Duration = (questionCount: number): number =>
  INTRO_FRAMES_V3 + questionCount * SCENE_FRAMES + OUTRO_FRAMES_V3;

/**
 * v3 long-form composition (1920×1080, 30fps).
 * Editorial atlas-style flag quiz. Default 197 questions =
 * 90 + 197×180 + 150 = 35,700 frames ≈ 19m 50s.
 */
export const LongQuizV3: React.FC<FlagQuizV3Props> = ({
  questions,
  maxQuestions,
}) => {
  const active = questions.slice(0, maxQuestions);
  const introEnd = INTRO_FRAMES_V3;
  const outroStart = introEnd + active.length * SCENE_FRAMES;

  return (
    <AbsoluteFill>
      <AtlasBackground />
      <FilmGrain />

      <Audio src={staticFile('audio/bgm.wav')} volume={0.18} loop />

      <Sequence from={0} durationInFrames={INTRO_FRAMES_V3} name="Intro">
        <IntroScene totalQuestions={active.length} layout="landscape" />
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
              layout="landscape"
            />
          </Sequence>
        );
      })}

      <Sequence
        from={outroStart}
        durationInFrames={OUTRO_FRAMES_V3}
        name="Outro"
      >
        <OutroScene totalQuestions={active.length} layout="landscape" />
      </Sequence>
    </AbsoluteFill>
  );
};
