import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { FlagQuizV2Props } from '../types/flagQuiz';
import { MeshBackground } from '../components/shared/MeshBackground';
import { GrainOverlay } from '../components/shared/GrainOverlay';
import { IntroSceneV2 } from '../components/shared/IntroSceneV2';
import { FlagQuestionScene } from '../components/shared/FlagQuestionScene';
import { OutroSceneV2 } from '../components/shared/OutroSceneV2';

loadAnton();
loadInter();

const INTRO_FRAMES = 90;   // 3s
const SCENE_FRAMES = 180;  // 6s per question
const OUTRO_FRAMES = 150;  // 5s
export const SHORT_V2_QUESTIONS = 10;

export const calcShortV2Duration = (): number =>
  INTRO_FRAMES + SHORT_V2_QUESTIONS * SCENE_FRAMES + OUTRO_FRAMES;

/** Portrait (1080×1920) Shorts flag quiz — 10 questions, ~68 seconds. */
export const ShortQuizV2: React.FC<FlagQuizV2Props> = ({
  questions,
}) => {
  // Pick a spread of difficulties: first pick easy, medium, hard, sadist evenly
  const easy = questions.filter((q) => q.difficulty === 'easy');
  const medium = questions.filter((q) => q.difficulty === 'medium');
  const hard = questions.filter((q) => q.difficulty === 'hard');
  const sadist = questions.filter((q) => q.difficulty === 'sadist');

  const selected = [
    ...easy.slice(0, 3),
    ...medium.slice(0, 3),
    ...hard.slice(0, 2),
    ...sadist.slice(0, 2),
  ].slice(0, SHORT_V2_QUESTIONS);

  return (
    <AbsoluteFill>
      <MeshBackground />
      <GrainOverlay />

      {/* Intro */}
      <Sequence from={0} durationInFrames={INTRO_FRAMES} name="Intro">
        <IntroSceneV2 totalQuestions={selected.length} layout="portrait" />
      </Sequence>

      {/* Questions */}
      {selected.map((question, i) => {
        const from = INTRO_FRAMES + i * SCENE_FRAMES;
        return (
          <Sequence
            key={question.id}
            from={from}
            durationInFrames={SCENE_FRAMES}
            name={`Q${i + 1} — ${question.country}`}
          >
            <FlagQuestionScene
              question={question}
              questionIndex={i + 1}
              totalQuestions={selected.length}
              startFrame={from}
              layout="portrait"
            />
          </Sequence>
        );
      })}

      {/* Outro */}
      <Sequence
        from={INTRO_FRAMES + selected.length * SCENE_FRAMES}
        durationInFrames={OUTRO_FRAMES}
        name="Outro"
      >
        <OutroSceneV2 layout="portrait" />
      </Sequence>
    </AbsoluteFill>
  );
};
