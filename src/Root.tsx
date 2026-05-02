import { Composition } from 'remotion';
import { LongQuiz } from './compositions/LongQuiz';
import { ShortQuiz, SHORT_TOTAL_FRAMES } from './compositions/ShortQuiz';
import { LongQuizV2, calcLongV2Duration } from './compositions/LongQuizV2';
import { ShortQuizV2, calcShortV2Duration } from './compositions/ShortQuizV2';
import { FlagQuizV2Props } from './types/flagQuiz';
import { FPS, calcLongDuration } from './types';
import sampleData from './data/active-quiz.json';
import flagsData from './data/flags-197.json';

const typedFlagsData = flagsData as unknown as { questions: FlagQuizV2Props['questions'] };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── v1 compositions (unchanged) ── */}
      <Composition
        id="LongQuiz"
        component={LongQuiz}
        durationInFrames={calcLongDuration(sampleData.questions as any)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ quizData: sampleData as any }}
      />
      <Composition
        id="ShortQuiz"
        component={ShortQuiz}
        durationInFrames={SHORT_TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ quizData: sampleData as any }}
      />

      {/* ── v2 Flag Premium compositions ── */}
      <Composition
        id="LongQuizV2"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={LongQuizV2 as React.ComponentType<any>}
        durationInFrames={calcLongV2Duration(197)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          questions: typedFlagsData.questions,
          maxQuestions: 197,
        }}
      />
      <Composition
        id="ShortQuizV2"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={ShortQuizV2 as React.ComponentType<any>}
        durationInFrames={calcShortV2Duration()}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          questions: typedFlagsData.questions,
          maxQuestions: 10,
        }}
      />
    </>
  );
};
