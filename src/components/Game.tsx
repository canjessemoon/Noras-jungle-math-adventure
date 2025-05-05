import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { GameState, PlayerInfo, Question, GameProgress, MathOperation, MathQuestion as MathQuestionType } from '../types';
import { jungleTrivia, avatarImages } from '../data/gameData';
import WelcomeScreen from './WelcomeScreen';
import MathQuestion from './MathQuestion';
import TriviaQuestion from './TriviaQuestion';
import ProgressBar from './ProgressBar';

const generateMathQuestion = (questionNumber: number, requiredOperation: MathOperation): Question => {
  let num1: number, num2: number;
  switch (requiredOperation) {
    case 'addition':
      num1 = Math.floor(Math.random() * 201);
      num2 = Math.floor(Math.random() * (201 - num1));
      return { type: 'math', operation: requiredOperation, num1, num2, answer: num1 + num2 };
    
    case 'subtraction':
      num1 = Math.floor(Math.random() * 150) + 1;
      num2 = Math.floor(Math.random() * num1);
      return { type: 'math', operation: requiredOperation, num1, num2, answer: num1 - num2 };
    
    case 'multiplication':
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      return { type: 'math', operation: requiredOperation, num1, num2, answer: num1 * num2 };
    
    default:
      return generateMathQuestion(questionNumber, 'addition');
  }
};

const getQuestionTypeForIndex = (index: number): { type: 'math' | 'trivia', operation?: MathOperation } => {
  const sequence: Array<{ type: 'math' | 'trivia', operation?: MathOperation }> = [
    { type: 'math', operation: 'addition' },
    { type: 'trivia' },
    { type: 'math', operation: 'subtraction' },
    { type: 'trivia' },
    { type: 'math', operation: 'addition' },
    { type: 'trivia' },
    { type: 'math', operation: 'subtraction' },
    { type: 'trivia' },
    { type: 'math', operation: 'multiplication' },
    { type: 'trivia' },
    { type: 'math', operation: 'multiplication' },
    { type: 'trivia' }
  ];
  return sequence[index] || sequence[0];
};

const Game = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(generateMathQuestion(0, 'addition'));
  const [progress, setProgress] = useState<GameProgress>({
    currentQuestion: 0,
    mistakes: 0,
    correctAnswers: 0,
    totalQuestions: 12
  });

  const [usedTriviaIndices, setUsedTriviaIndices] = useState<Set<number>>(new Set());
  const [usedMathQuestions, setUsedMathQuestions] = useState<Set<string>>(new Set());

  const getNextQuestion = useCallback(() => {
    const questionType = getQuestionTypeForIndex(progress.currentQuestion);
    
    if (questionType.type === 'trivia') {
      const availableIndices = Array.from(Array(jungleTrivia.length).keys())
        .filter(i => !usedTriviaIndices.has(i));
      
      if (availableIndices.length === 0) {
        setUsedTriviaIndices(new Set());
        return jungleTrivia[0];
      }

      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      setUsedTriviaIndices(prev => new Set([...prev, randomIndex]));
      return jungleTrivia[randomIndex];
    } else {
      let newQuestion = generateMathQuestion(progress.currentQuestion, questionType.operation!);
      
      // Updated type assertion
      const mathQuestion = newQuestion as MathQuestionType;
      const questionKey = `${mathQuestion.operation}-${mathQuestion.num1}-${mathQuestion.num2}`;
      
      let attempts = 0;
      while (usedMathQuestions.has(questionKey) && attempts < 5) {
        newQuestion = generateMathQuestion(progress.currentQuestion, questionType.operation!);
        attempts++;
      }

      setUsedMathQuestions(prev => new Set([...prev, questionKey]));
      return newQuestion;
    }
  }, [progress.currentQuestion, usedTriviaIndices, usedMathQuestions]);

  const handleGameStart = (info: PlayerInfo) => {
    setPlayerInfo(info);
    setGameState('playing');
    const initialQuestion = getNextQuestion();
    setCurrentQuestion(initialQuestion);
  };

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setProgress(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        currentQuestion: prev.currentQuestion + 1
      }));
      
      if (progress.correctAnswers + 1 === progress.totalQuestions) {
        setGameState('finished');
      } else {
        const nextQuestion = getNextQuestion();
        setCurrentQuestion(nextQuestion);
      }
    } else {
      setProgress(prev => ({
        ...prev,
        mistakes: prev.mistakes + 1
      }));
      
      if (progress.mistakes + 1 >= 2) {
        setGameState('finished');
      }
    }
  }, [progress.correctAnswers, progress.currentQuestion, progress.mistakes, progress.totalQuestions, getNextQuestion]);

  const handleRestart = () => {
    setGameState('welcome');
    setPlayerInfo(null);
    setProgress({
      currentQuestion: 0,
      mistakes: 0,
      correctAnswers: 0,
      totalQuestions: 12
    });
    setUsedTriviaIndices(new Set());
    setUsedMathQuestions(new Set());
    setCurrentQuestion(generateMathQuestion(0, 'addition'));
  };

  if (gameState === 'welcome') {
    return <WelcomeScreen onStart={handleGameStart} />;
  }

  if (!playerInfo) return null;

  return (
    <Container>
      <ProgressBar 
        progress={progress} 
        avatar={avatarImages[playerInfo.avatar]} 
      />
      
      {gameState === 'playing' && currentQuestion.type === 'math' && (
        <MathQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          playerAvatar={avatarImages[playerInfo.avatar]}
        />
      )}

      {gameState === 'playing' && currentQuestion.type === 'trivia' && (
        <TriviaQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          playerAvatar={avatarImages[playerInfo.avatar]}
        />
      )}

      {gameState === 'finished' && (
        <EndScreen>
          <h2>{progress.mistakes >= 2 ? 'Game Over!' : 'Congratulations!'}</h2>
          <p>
            {progress.mistakes >= 2
              ? `Don't worry ${playerInfo.name}, you can try again!`
              : `Great job ${playerInfo.name}! You completed all ${progress.totalQuestions} questions!`}
          </p>
          <p>Correct Answers: {progress.correctAnswers}</p>
          <p>Mistakes: {progress.mistakes}</p>
          <RestartButton onClick={handleRestart}>
            Start New Game
          </RestartButton>
        </EndScreen>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const EndScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #2c5530;

  h2 {
    font-size: 2rem;
    margin: 0;
  }
`;

const RestartButton = styled.button`
  padding: 1rem 2rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #45a049;
  }
`;

export default Game;