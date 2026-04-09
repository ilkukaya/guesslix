import { Composition } from "remotion";
import { LongQuiz } from "./compositions/LongQuiz";
import { ShortQuiz } from "./compositions/ShortQuiz";
import {
  FPS,
  questionFrames,
  INTRO_FRAMES,
  OUTRO_FRAMES,
  TRANSITION_FRAMES,
} from "./types";
import sampleData from "./data/sample-flags.json";

/** Calculate total frames for the long quiz including transitions */
const calcLongTotal = (questions: any[]) => {
  let total = INTRO_FRAMES;
  let prevDifficulty = "";

  for (const q of questions) {
    if (q.difficulty !== prevDifficulty) {
      total += TRANSITION_FRAMES[q.difficulty] || 60;
      prevDifficulty = q.difficulty;
    }
    total += questionFrames(q, !!q.funFact);
  }

  total += OUTRO_FRAMES;
  return total;
};

/** Calculate total frames for short quiz (no transitions) */
const calcShortTotal = (questions: any[]) => {
  const qs = questions.slice(0, 5);
  const qFrames = qs.reduce(
    (sum: number, q: any) => sum + questionFrames(q, false),
    0
  );
  return qFrames + 90; // + 3s outro
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LongQuiz"
        component={LongQuiz}
        durationInFrames={calcLongTotal(sampleData.questions)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ quizData: sampleData as any }}
      />
      <Composition
        id="ShortQuiz"
        component={ShortQuiz}
        durationInFrames={calcShortTotal(sampleData.questions)}
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
