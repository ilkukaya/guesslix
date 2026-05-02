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

export const calcLongV2Duration = (questionCount: number): number =>
  INTRO_FRAMES + questionCount * SCENE_FRAMES + OUTRO_FRAMES;

/** Landscape (1920×1080) full-length flag quiz — 197 questions. */
export const LongQuizV2: React.FC<FlagQuizV2Props> = ({
  questions,
  maxQuestions,
}) => {
  const activeQuestions = questions.slice(0, maxQuestions);

  return (
    <AbsoluteFill>
      <MeshBackground />
      <GrainOverlay />

      {/* Intro */}
      <Sequence from={0} durationInFrames={INTRO_FRAMES} name="Intro">
        <IntroSceneV2 totalQuestions={activeQuestions.length} layout="landscape" />
      </Sequence>

      {/* Questions */}
      {activeQuestions.map((question, i) => {
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
              totalQuestions={activeQuestions.length}
              startFrame={from}
              layout="landscape"
            />
          </Sequence>
        );
      })}

      {/* Outro */}
      <Sequence
        from={INTRO_FRAMES + activeQuestions.length * SCENE_FRAMES}
        durationInFrames={OUTRO_FRAMES}
        name="Outro"
      >
        <OutroSceneV2 layout="landscape" />
      </Sequence>
    </AbsoluteFill>
  );
};
