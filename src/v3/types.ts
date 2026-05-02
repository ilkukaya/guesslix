/** Types for the v3 flag quiz format. */

export type FlagDifficulty = 'easy' | 'medium' | 'hard' | 'sadist';

export type Continent =
  | 'Africa'
  | 'Americas'
  | 'Asia'
  | 'Europe'
  | 'Oceania';

export interface FlagQuestion {
  id: number;
  country: string;
  countryCode: string;
  /** [stripe1, stripe2, stripe3] — used for the reveal stripe + accent gradients. */
  primaryColors: [string, string, string];
  difficulty: FlagDifficulty;
  continent: Continent;
  funFact: string;
}

export interface FlagsQuizData {
  quizId: string;
  category: 'guess_the_flag';
  questions: FlagQuestion[];
}

export interface FlagQuizV3Props {
  questions: FlagQuestion[];
  /** Number of questions to actually render (slice from the front). */
  maxQuestions: number;
}

/** Sweep direction is derived from continent — gives each flag a sense of place. */
export const SWEEP_DIRECTION: Record<Continent, 'left' | 'right' | 'top' | 'bottom'> = {
  Americas: 'left',
  Europe: 'right',
  Africa: 'bottom',
  Asia: 'right',
  Oceania: 'bottom',
};

/** Difficulty pip count (1-4). */
export const DIFFICULTY_PIPS: Record<FlagDifficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  sadist: 4,
};
