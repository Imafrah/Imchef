import { useState, useEffect } from 'react';

interface StyledText {
  text: string;
  className?: string;
}

interface StyledTypingAnimationProps {
  textParts: StyledText[];
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  cursorBlinkSpeed?: number;
  loop?: boolean;
  pauseTime?: number;
}

const StyledTypingAnimation: React.FC<StyledTypingAnimationProps> = ({
  textParts,
  speed = 100,
  delay = 0,
  showCursor = true,
  cursorBlinkSpeed = 500,
  loop = false,
  pauseTime = 2000
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);

  // Combine all text parts into one string for typing
  const fullText = textParts.map(part => part.text).join('');

  useEffect(() => {
    if (currentIndex < fullText.length) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, currentIndex === 0 ? delay : speed);
      
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      if (loop) {
        setIsPaused(true);
        const pauseTimeout = setTimeout(() => {
          setDisplayedText('');
          setCurrentIndex(0);
          setCurrentPartIndex(0);
          setIsPaused(false);
        }, pauseTime);
        
        return () => clearTimeout(pauseTimeout);
      }
    }
  }, [currentIndex, fullText, speed, delay, loop, pauseTime]);

  // Render the text with appropriate styling
  const renderStyledText = () => {
    let currentCharIndex = 0;
    const elements: JSX.Element[] = [];

    textParts.forEach((part, partIndex) => {
      const partText = part.text;
      const partStartIndex = currentCharIndex;
      const partEndIndex = currentCharIndex + partText.length;
      
      if (currentIndex > partStartIndex) {
        const visibleLength = Math.min(currentIndex - partStartIndex, partText.length);
        const visibleText = partText.substring(0, visibleLength);
        
        if (visibleText) {
          elements.push(
            <span key={partIndex} className={part.className || ''}>
              {visibleText}
            </span>
          );
        }
      }
      
      currentCharIndex = partEndIndex;
    });

    return elements;
  };

  return (
    <span>
      {renderStyledText()}
      {showCursor && !isPaused && (
        <span 
          className="inline-block w-0.5 h-[1em] bg-current ml-1 animate-typing-cursor"
          style={{
            animationDuration: `${cursorBlinkSpeed}ms`
          }}
        />
      )}
    </span>
  );
};

export default StyledTypingAnimation;
