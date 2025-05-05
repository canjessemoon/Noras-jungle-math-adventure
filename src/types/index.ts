export type AvatarType = 'parrot' | 'monkey' | 'alligator' | 'peacock';

export type GameState = 'welcome' | 'playing' | 'finished';

export type MathOperation = 'addition' | 'subtraction' | 'multiplication';

export type QuestionType = 'math' | 'trivia';

export interface TriviaQuestion {
    type: 'trivia';
    question: string;
    options: string[];
    correctAnswer: string;
    funFact: string;
}

export interface MathQuestion {
    type: 'math';
    operation: MathOperation;
    num1: number;
    num2: number;
    answer: number;
}

export type Question = MathQuestion | TriviaQuestion;

export interface GameProgress {
    currentQuestion: number;
    mistakes: number;
    correctAnswers: number;
    totalQuestions: number;
}

export interface PlayerInfo {
    name: string;
    avatar: AvatarType;
}

export interface FeedbackState {
    visible: boolean;
    isCorrect: boolean;
    message: string;
    hint?: string;
    funFact?: string;
}