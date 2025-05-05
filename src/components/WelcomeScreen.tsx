import { useState } from 'react';
import styled from 'styled-components';
import { AvatarType, PlayerInfo } from '../types';
import { avatarImages } from '../data/gameData';

interface WelcomeScreenProps {
  onStart: (playerInfo: PlayerInfo) => void;
}

const avatars: AvatarType[] = ['parrot', 'monkey', 'alligator', 'peacock'];

const avatarEmojis: Record<AvatarType, string> = {
  parrot: '🦜',
  monkey: '🐒',
  alligator: '🐊',
  peacock: '🦚'
};

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>('parrot');
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart({ name: name.trim(), avatar: selectedAvatar });
    }
  };

  const handleImageError = (avatar: AvatarType) => {
    setImageError((prev) => ({ ...prev, [avatar]: true }));
  };

  return (
    <Container>
      <Title>Welcome to Nora's Jungle Math Adventure!</Title>
      <Form onSubmit={handleSubmit}>
        <Label>
          Enter your name:
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Label>
        <AvatarSection>
          <Label>Choose your avatar:</Label>
          <AvatarGrid>
            {avatars.map((avatar) => (
              <AvatarButton
                key={avatar}
                type="button"
                selected={avatar === selectedAvatar}
                onClick={() => setSelectedAvatar(avatar)}
              >
                {imageError[avatar] ? (
                  <AvatarImage 
                    as="div" 
                    className="fallback"
                  >
                    {avatarEmojis[avatar]}
                  </AvatarImage>
                ) : (
                  <AvatarImage
                    src={avatarImages[avatar]}
                    alt={avatar}
                    onError={() => handleImageError(avatar)}
                  />
                )}
                <AvatarName selected={avatar === selectedAvatar}>
                  {avatar.charAt(0).toUpperCase() + avatar.slice(1)}
                </AvatarName>
              </AvatarButton>
            ))}
          </AvatarGrid>
        </AvatarSection>
        <StartButton type="submit" disabled={!name.trim()}>
          Start Adventure!
        </StartButton>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c5530;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: bold;
  color: #2c5530;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 2px solid #2c5530;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const AvatarButton = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #2c5530;
  border-radius: 0.5rem;
  background: ${(props) => (props.selected ? '#2c5530' : 'white')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.selected ? '#2c5530' : '#e8f5e9')};
  }
`;

const AvatarImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid #2c5530;
  background: white;
  
  &.fallback {
    background-color: #4caf50;
    padding: 8px;
    color: white;
    font-size: 32px;
  }
`;

const AvatarName = styled.span<{ selected?: boolean }>`
  color: ${(props) => (props.selected ? 'white' : '#2c5530')};
  font-weight: bold;
`;

const StartButton = styled.button`
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

export default WelcomeScreen;