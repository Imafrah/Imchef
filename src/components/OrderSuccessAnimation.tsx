import React, { useEffect, useState } from 'react';

type OrderSuccessAnimationProps = {
  size?: number;
  onComplete?: () => void;
  totalDurationMs?: number;
};

// A compact sequence:
// 1) Cart inside red circle
// 2) Outer ring progress sweep
// 3) Cart dashes to the right (motion trails)
// 4) Green check scales in
const OrderSuccessAnimation: React.FC<OrderSuccessAnimationProps> = ({ size = 220, onComplete, totalDurationMs = 2200 }) => {
  const [stage, setStage] = useState<'cart' | 'ring' | 'dash' | 'check'>('cart');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('ring'), 400);
    const t2 = setTimeout(() => setStage('dash'), 1200);
    const t3 = setTimeout(() => setStage('check'), 1700);
    const t4 = setTimeout(() => onComplete?.(), totalDurationMs);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete, totalDurationMs]);

  const px = `${size}px`;

  return (
    <div className="mx-auto my-6 flex items-center justify-center select-none" style={{ width: px, height: px }}>
      <div className="relative" style={{ width: px, height: px }}>
        {/* Base red disc */}
        <div className="absolute inset-0 rounded-full bg-[hsl(0,74%,50%)]/85 shadow" />

        {/* Outer ring that sweeps */}
        <div className={`absolute inset-0 rounded-full border-[18px] border-[hsl(0,70%,40%)]/55 ${stage==='ring' ? 'animate-ring-sweep' : stage==='check' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />

        {/* Cart icon centered, then dashes out */}
        <div className={`absolute inset-0 flex items-center justify-center ${stage==='dash' ? 'animate-cart-dash' : stage==='check' ? 'opacity-0' : 'opacity-100'} transition-all`}> 
          {/* Cart - simplified SVG to match screenshots */}
          <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white drop-shadow">
            <path d="M7 6h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 6l2.2 8h7.4l2.4-5.2-12.4.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="18" r="1.6" fill="currentColor"/>
            <circle cx="17" cy="18" r="1.6" fill="currentColor"/>
          </svg>
          {/* Motion trails that appear only during dash */}
          {stage === 'dash' && (
            <div className="absolute right-[22%] top-1/2 -translate-y-1/2 space-y-2 opacity-70">
              <div className="h-1 w-16 bg-white/70 rounded-full blur-[0.2px]" />
              <div className="h-1 w-10 bg-white/60 rounded-full" />
              <div className="h-1 w-24 bg-white/50 rounded-full" />
            </div>
          )}
        </div>

        {/* Green check - scales in */}
        <div className={`absolute inset-0 flex items-center justify-center ${stage==='check' ? 'animate-check-pop' : 'opacity-0'}`}>
          <div className="absolute inset-[12%] rounded-full bg-[#2ecc71]" />
          <svg viewBox="0 0 24 24" width={size * 0.42} height={size * 0.42} className="text-white relative" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessAnimation;


