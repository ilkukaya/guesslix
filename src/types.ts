/* ================================================================
   QUESTION TYPES — JSON "type" field determines visual + layout
   ================================================================ */

export type QuestionType =
  | "emoji_flag" // Flag quiz — emoji → flagcdn image
  | "image_guess" // Logo, food, animal, landmark — URL image
  | "emoji_decode" // 🎬🦁👑 = which movie? — big emoji string
  | "text_only" // GK, scrambled name — text question only
  | "zoomed" // Zoomed image — starts zoomed in, slowly reveals
  | "blurred" // Blurred image — starts blurry, slowly clears
  | "silhouette" // Silhouette — black shape, reveals on answer
  | "find_odd" // 3x3 grid, find the different one
  | "true_false" // True/False — 2 options
  | "comparison"; // A vs B — two items side by side

/* ================================================================
   QUIZ QUESTION — universal interface for all types
   ================================================================ */

export interface QuizQuestion {
  id: number;
  type: QuestionType;

  // Visual sources (used based on type)
  emoji?: string; // emoji_flag: 🇯🇵
  emojiClue?: string; // emoji_decode: 🎬🦁👑
  imageUrl?: string; // image_guess, zoomed, blurred, silhouette

  // Find the Odd
  gridItems?: string[]; // 9 emojis or image URLs
  oddIndex?: number; // index of the odd one

  // Comparison (A vs B)
  itemA?: { label: string; value?: string; imageUrl?: string };
  itemB?: { label: string; value?: string; imageUrl?: string };

  // Common fields
  questionText: string;
  options: string[]; // 4 options (normal) or 2 options (true_false, comparison)
  correctIndex: number;
  timerSeconds: number;
  difficulty: "easy" | "medium" | "hard" | "impossible";
  funFact?: string;
}

/* ================================================================
   QUIZ DATA — top-level structure
   ================================================================ */

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

/* ================================================================
   TIMING CONSTANTS
   ================================================================ */

export const FPS = 30;

export const PHASE = {
  enter: 15,
  timer: (sec: number) => sec * FPS,
  reveal: 60,
  funFact: 90,
  transition: 12,
};

export const INTRO_FRAMES = 240;
export const OUTRO_FRAMES = 360;
export const MINI_SPLASH_FRAMES = 24;

export const TRANSITION_FRAMES: Record<string, number> = {
  easy: 60,
  medium: 60,
  hard: 60,
  impossible: 90,
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

export function calcLongDuration(questions: QuizQuestion[]): number {
  let total = INTRO_FRAMES;
  let prevDifficulty = "";
  questions.forEach((q, i) => {
    const isNew = q.difficulty !== prevDifficulty;
    if (isNew) {
      total += TRANSITION_FRAMES[q.difficulty] || 60;
      prevDifficulty = q.difficulty;
    }
    if (i > 0 && i % 4 === 0 && !isNew) total += MINI_SPLASH_FRAMES;
    total += questionFrames(q, !!q.funFact);
  });
  total += OUTRO_FRAMES;
  return total;
}

/** Resolve effective type (backward compat: old emoji_decode with emoji field → emoji_flag) */
export function resolveType(q: QuizQuestion): QuestionType {
  if (q.type === "emoji_decode" && q.emoji && !q.emojiClue) return "emoji_flag";
  return q.type || "emoji_flag";
}
