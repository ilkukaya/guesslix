export interface QuizQuestion {
  id: number;
  type: "emoji_decode" | "image_guess" | "text_guess";
  emoji?: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  timerSeconds: number;
  difficulty: "easy" | "medium" | "hard" | "impossible";
  funFact?: string;
}

export interface QuizData {
  quizId: string;
  category: string;
  format: string;
  videoType: "short" | "long";
  language: string;
  totalQuestions: number;
  style: { theme: string; colorAccent: string; musicProfile: string };
  questions: QuizQuestion[];
}

export const FPS = 30;

// Timing for each question phase (in frames)
export const PHASE = {
  enter: 15,
  timer: (sec: number) => sec * FPS,
  reveal: 60,
  funFact: 90,
  transition: 12,
};

// Composition-level timing (in frames)
export const INTRO_FRAMES = 240; // 8 seconds
export const OUTRO_FRAMES = 360; // 12 seconds

export const TRANSITION_FRAMES: Record<string, number> = {
  easy: 60, // 2s
  medium: 60, // 2s
  hard: 60, // 2s
  impossible: 90, // 3s
};

export function questionFrames(q: QuizQuestion, showFact: boolean) {
  return (
    PHASE.enter +
    PHASE.timer(q.timerSeconds) +
    PHASE.reveal +
    (showFact && q.funFact ? PHASE.funFact : 0) +
    PHASE.transition
  );
}
