import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type LottieOrderAnimationProps = {
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
};

const LottieOrderAnimation: React.FC<LottieOrderAnimationProps> = ({ 
  width = 300, 
  height = 300, 
  loop = true, 
  autoplay = true 
}) => {
  return (
    <div className="flex justify-center items-center my-6">
      <DotLottieReact
        src="https://lottie.host/0182cb19-d819-45f1-96f7-d932dfe6fe6a/lREY0troF6.lottie"
        loop={loop}
        autoplay={autoplay}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
        }}
      />
    </div>
  );
};

export default LottieOrderAnimation;
