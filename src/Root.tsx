import { Composition } from "remotion";
import { LongQuiz } from "./compositions/LongQuiz";
import { ShortQuiz, SHORT_TOTAL_FRAMES } from "./compositions/ShortQuiz";
import { FPS, calcLongDuration } from "./types";
import sampleData from "./data/active-quiz.json";

import { LongQuizV3, calcLongV3Duration } from "./v3/compositions/LongQuizV3";
import { ShortQuizV3, calcShortV3Duration } from "./v3/compositions/ShortQuizV3";
import flagsV3 from "./data/flags-197.json";
import type { FlagsQuizData } from "./v3/types";

const flagsData = flagsV3 as FlagsQuizData;

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
      <Composition
        id="LongQuizV3"
        component={LongQuizV3 as React.FC}
        durationInFrames={calcLongV3Duration(flagsData.questions.length)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          questions: flagsData.questions,
          maxQuestions: flagsData.questions.length,
        }}
      />
      <Composition
        id="ShortQuizV3"
        component={ShortQuizV3 as React.FC}
        durationInFrames={calcShortV3Duration(10)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          questions: flagsData.questions,
          maxQuestions: 10,
        }}
      />
    </>
  );
};
