import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TriviaQuestion as TriviaQuestionType, FeedbackState } from '../types';

interface TriviaQuestionProps {
  question: TriviaQuestionType;
  onAnswer: (isCorrect: boolean) => void;
  playerAvatar: string;
}

const TriviaQuestion = ({ question, onAnswer, playerAvatar }: TriviaQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({
    visible: false,
    isCorrect: false,
    message: '',
    funFact: ''
  });

  const handleAnswerClick = (answer: string) => {
    const isCorrect = answer === question.correctAnswer;
    setSelectedAnswer(answer);
    setFeedback({
      visible: true,
      isCorrect,
      message: isCorrect ? "Great job!" : "Let's learn something new!",
      funFact: question.funFact
    });
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setFeedback(prev => ({ ...prev, visible: false }));
    onAnswer(true);
  };

  return (
    <Container>
      <QuestionContainer>
        <QuestionText>{question.question}</QuestionText>
        <OptionsGrid>
          {question.options.map((option) => (
            <OptionButton
              key={option}
              onClick={() => !selectedAnswer && handleAnswerClick(option)}
              $selected={option === selectedAnswer}
              $correct={!!selectedAnswer && option === question.correctAnswer}
              disabled={!!selectedAnswer}
            >
              {option}
            </OptionButton>
          ))}
        </OptionsGrid>
      </QuestionContainer>

      <AvatarAndFeedback>
        <AvatarImage src={playerAvatar} alt="Player avatar" />
        {feedback.visible && (
          <FeedbackContainer
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
          >
            <FeedbackMessage correct={feedback.isCorrect}>
              {feedback.message}
            </FeedbackMessage>
            <FunFactText>
              <strong>Fun Fact:</strong> {feedback.funFact}
            </FunFactText>
            <ActionButton onClick={handleNextQuestion}>
              Next Question
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
  gap: 2rem;
`;

const QuestionText = styled.div`
  font-size: 1.5rem;
  color: #2c5530;
  font-weight: bold;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const OptionButton = styled.button<{
  $selected?: boolean;
  $correct?: boolean;
}>`
  padding: 1rem;
  border: 2px solid #2c5530;
  border-radius: 0.5rem;
  background: ${props => {
    if (props.$selected && props.$correct) return '#4caf50';
    if (props.$selected && !props.$correct) return '#f44336';
    if (props.$correct) return '#4caf50';
    return 'white';
  }};
  color: ${props => {
    if (props.$selected || (props.$correct && props.disabled)) return 'white';
    return '#2c5530';
  }};
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.disabled ? '' : '#e8f5e9'};
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
  max-width: 300px;
`;

const FeedbackMessage = styled.div<{ correct: boolean }>`
  color: ${props => props.correct ? '#4caf50' : '#2c5530'};
  font-size: 1.2rem;
  font-weight: bold;
`;

const FunFactText = styled.div`
  font-size: 1rem;
  color: #666;
  text-align: center;
  line-height: 1.4;

  strong {
    color: #2c5530;
  }
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

export default TriviaQuestion;