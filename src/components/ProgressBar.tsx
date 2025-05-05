import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GameProgress } from '../types';
import { useState } from 'react';

interface ProgressBarProps {
  progress: GameProgress;
  avatar: string;
}

const ProgressBar = ({ progress, avatar }: ProgressBarProps) => {
  const percentComplete = (progress.correctAnswers / progress.totalQuestions) * 100;
  const [imageError, setImageError] = useState(false);

  const getEmoji = (url: string): string => {
    if (url.includes('parrot')) return '🦜';
    if (url.includes('monkey')) return '🐒';
    if (url.includes('alligator')) return '🐊';
    if (url.includes('peacock')) return '🦚';
    return '🐒';  // default to monkey
  };

  return (
    <Container>
      <StatsContainer>
        <Stat>Question: {progress.currentQuestion + 1}/{progress.totalQuestions}</Stat>
        <Stat>Mistakes: {progress.mistakes}/2</Stat>
      </StatsContainer>
      <BarContainer>
        <Bar>
          <BarFill
            initial={{ width: 0 }}
            animate={{ width: `${percentComplete}%` }}
            transition={{ duration: 0.5 }}
          />
          <Avatar
            initial={{ x: 0 }}
            animate={{ x: `${percentComplete}%` }}
            transition={{ duration: 0.5 }}
          >
            {imageError ? (
              <AvatarFallback>{getEmoji(avatar)}</AvatarFallback>
            ) : (
              <AvatarImage 
                src={avatar} 
                alt="Player avatar" 
                onError={() => setImageError(true)}
              />
            )}
          </Avatar>
        </Bar>
      </BarContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 1rem auto;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const Stat = styled.div`
  color: #2c5530;
  font-weight: bold;
`;

const BarContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Bar = styled.div`
  position: relative;
  height: 3rem;
  background: #e8f5e9;
  border-radius: 1.5rem;
  overflow: visible;
`;

const BarFill = styled(motion.div)`
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #2c5530);
  border-radius: 1.5rem;
`;

const Avatar = styled(motion.div)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 4rem;
  height: 4rem;
  margin-left: -2rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #2c5530;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #2c5530;
  background: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export default ProgressBar;