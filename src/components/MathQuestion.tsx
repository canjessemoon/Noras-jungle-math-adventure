import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MathQuestion as MathQuestionType, FeedbackState } from '../types';

interface MathQuestionProps {
  question: MathQuestionType;
  onAnswer: (isCorrect: boolean) => void;
  playerAvatar: string;
}

const MathQuestion = ({ question, onAnswer, playerAvatar }: MathQuestionProps) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>({
    visible: false,
    isCorrect: false,
    message: '',
    hint: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userAnswer = parseInt(answer, 10);
    const correct = userAnswer === question.answer;
    
    setFeedback({
      visible: true,
      isCorrect: correct,
      message: correct ? 'Congratulations!' : 'Try again!',
      hint: correct ? undefined : getHint()
    });

    // Immediately notify parent of the result
    onAnswer(correct);

    if (correct) {
      setTimeout(() => {
        setAnswer('');
      }, 1000);
    }
  };

  const getOperationSymbol = (operation: string) => {
    switch (operation) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      default: return '+';
    }
  };

  const getHint = () => {
    switch (question.operation) {
      case 'addition':
        return 'Try counting up from the larger number!';
      case 'subtraction':
        return 'Try counting down from the first number!';
      case 'multiplication':
        return 'Try adding the number multiple times!';
      default:
        return 'Take your time and try again!';
    }
  };

  const handleNextQuestion = () => {
    setAnswer('');
    setFeedback(prev => ({ ...prev, visible: false }));
    onAnswer(true);
  };

  const handleTryAgain = () => {
    setAnswer('');
  };

  return (
    <Container>
      <QuestionContainer>
        <VerticalMathProblem>
          <NumberRow>{question.num1}</NumberRow>
          <OperationRow>
            {getOperationSymbol(question.operation)}
            <span>{question.num2}</span>
          </OperationRow>
          <HorizontalLine />
        </VerticalMathProblem>

        <Form onSubmit={handleSubmit}>
          <Input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
            required
          />
          <SubmitButton type="submit" disabled={!answer}>
            Check Answer
          </SubmitButton>
        </Form>
      </QuestionContainer>

      <AvatarAndFeedback>
        <AvatarImage src={playerAvatar} alt="Player's avatar" />
        {feedback.visible && (
          <FeedbackContainer
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
          >
            <FeedbackMessage correct={feedback.isCorrect}>
              {feedback.message}
            </FeedbackMessage>
            {feedback.hint && <HintText>{feedback.hint}</HintText>}
            <ActionButton
              onClick={feedback.isCorrect ? handleNextQuestion : handleTryAgain}
            >
              {feedback.isCorrect ? 'Next Question' : 'Try Again'}
            </ActionButton>
          </FeedbackContainer>
        )}
      </AvatarAndFeedback>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const VerticalMathProblem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c5530;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NumberRow = styled.div`
  padding: 0.25rem 0;
`;

const OperationRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 0.25rem 0;
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 3px;
  background-color: #2c5530;
  margin: 0.5rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
`;

const Input = styled.input`
  padding: 1rem;
  font-size: 1.5rem;
  border: 2px solid #2c5530;
  border-radius: 0.5rem;
  text-align: center;
`;

const SubmitButton = styled.button`
  padding: 1rem;
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

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const AvatarAndFeedback = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const AvatarImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #2c5530;
`;

const FeedbackContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FeedbackMessage = styled.div<{ correct: boolean }>`
  color: ${props => props.correct ? '#4caf50' : '#f44336'};
  font-size: 1.2rem;
  font-weight: bold;
`;

const HintText = styled.div`
  font-size: 1rem;
  color: #666;
  font-style: italic;
  text-align: center;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: #2c5530;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1e3c21;
  }
`;

export default MathQuestion;