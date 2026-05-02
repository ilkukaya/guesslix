/** Types for the v2 flag quiz format. */

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

export interface FlagQuizV2Props {
  questions: FlagQuestion[];
  maxQuestions: number;
}
