import { Composition } from "remotion";
import { LongQuiz } from "./compositions/LongQuiz";
import { ShortQuiz } from "./compositions/ShortQuiz";
import { FPS, questionFrames } from "./types";
import sampleData from "./data/sample-flags.json";

const calcTotal = (questions: any[], isLong: boolean) => {
  const intro = isLong ? 20 : 0;
  const outro = isLong ? 300 : 90;
  const qs = isLong ? questions : questions.slice(0, 5);
  const qFrames = qs.reduce(
    (sum: number, q: any) => sum + questionFrames(q, isLong && !!q.funFact),
    0
  );
  return intro + qFrames + outro;
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LongQuiz"
        component={LongQuiz}
        durationInFrames={calcTotal(sampleData.questions, true)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ quizData: sampleData as any }}
      />
      <Composition
        id="ShortQuiz"
        component={ShortQuiz}
        durationInFrames={calcTotal(sampleData.questions, false)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          quizData: {
            ...sampleData,
            videoType: "short",
            questions: sampleData.questions.slice(0, 5),
          } as any,
        }}
      />
    </>
  );
};
