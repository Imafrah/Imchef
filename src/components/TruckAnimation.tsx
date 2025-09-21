import React from 'react';

type TruckAnimationProps = {
  message?: string;
  durationMs?: number;
};

const TruckAnimation: React.FC<TruckAnimationProps> = ({ message = 'Your order is on its way!', durationMs = 4000 }) => {
  return (
    <div className="relative w-full h-24 overflow-hidden my-6" aria-label="Delivery truck animation">
      <div
        className="absolute left-[-30%] top-1/2 -translate-y-1/2 animate-truck flex items-center space-x-3"
        style={{ animationDuration: `${durationMs}ms` }}
      >
        <div className="bg-primary text-primary-foreground text-xs md:text-sm px-3 py-1 rounded-full shadow">
          {message}
        </div>
        <div className="truck-svg w-16 h-10 md:w-20 md:h-12">
          <svg viewBox="0 0 128 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="truck">
            <g fill="currentColor">
              <rect x="4" y="22" width="64" height="26" rx="4" className="text-primary" />
              <rect x="68" y="28" width="40" height="20" rx="3" className="text-primary/80" />
              <rect x="74" y="18" width="18" height="14" rx="2" className="text-primary/60" />
              <circle cx="28" cy="52" r="8" className="text-foreground" />
              <circle cx="28" cy="52" r="4" className="text-background" />
              <circle cx="92" cy="52" r="8" className="text-foreground" />
              <circle cx="92" cy="52" r="4" className="text-background" />
            </g>
          </svg>
        </div>
        <div className="w-14 h-[2px] bg-primary/40 rounded-full animate-bounce-x" />
      </div>
    </div>
  );
};

export default TruckAnimation;


