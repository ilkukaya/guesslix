import { Composition } from "remotion";
import { LongQuiz } from "./compositions/LongQuiz";
import { ShortQuiz, SHORT_TOTAL_FRAMES } from "./compositions/ShortQuiz";
import { FPS, calcLongDuration } from "./types";
import sampleData from "./data/active-quiz.json";

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
    </>
  );
};
