import { useState, useEffect } from 'react';
import { ChefHat } from 'lucide-react';

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo Animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <img 
              src="/chef-logo.png" 
              alt="Imchef Logo" 
              className="w-full h-full rounded-lg object-cover animate-pulse"
            />
            <div className="absolute inset-0 rounded-lg bg-primary/20 animate-ping" />
          </div>
          <ChefHat className="w-8 h-8 text-primary mx-auto animate-bounce" />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">
          Imchef
        </h1>
        
        {/* Loading Text */}
        <p className="text-muted-foreground animate-pulse">
          Preparing delicious experiences...
        </p>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-muted rounded-full mx-auto mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-food-warm rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
