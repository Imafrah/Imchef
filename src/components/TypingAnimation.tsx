import { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
  cursorBlinkSpeed?: number;
  loop?: boolean;
  pauseTime?: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 100,
  delay = 0,
  className = '',
  showCursor = true,
  cursorBlinkSpeed = 500,
  loop = false,
  pauseTime = 2000
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
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
          setIsPaused(false);
        }, pauseTime);
        
        return () => clearTimeout(pauseTimeout);
      }
    }
  }, [currentIndex, text, speed, delay, loop, pauseTime]);

  return (
    <span className={className}>
      {displayedText}
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

export default TypingAnimation;
