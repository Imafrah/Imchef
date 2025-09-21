import { useEffect, useRef } from 'react';

const restaurantLogos = [
  "/Restaurant_Images/Restaurant_1.png",
  "/Restaurant_Images/Restaurant_2.png",
  "/Restaurant_Images/Restaurant_3.png",
  "/Restaurant_Images/Restaurant_4.png",
  "/Restaurant_Images/Restaurant_5.png",
  "/Restaurant_Images/Restaurant_6.png",
  "/Restaurant_Images/Restaurant_7.png",
  "/Restaurant_Images/Restaurant_8.png",
];

export const LogoMarquee = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(scroll, 30);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative overflow-hidden w-full">
      <div
        ref={scrollRef}
        className="flex space-x-8 animate-scroll whitespace-nowrap"
        style={{
          width: '200%',
          display: 'flex',
          animation: 'scroll 40s linear infinite',
        }}
      >
        {/* First set of logos */}
        {restaurantLogos.map((logo, index) => (
          <div
            key={`logo-1-${index}`}
            className="flex-shrink-0 w-40 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center p-2"
          >
            <img
              src={logo}
              alt={`Restaurant logo ${index + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {restaurantLogos.map((logo, index) => (
          <div
            key={`logo-2-${index}`}
            className="flex-shrink-0 w-40 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center p-2"
          >
            <img
              src={logo}
              alt={`Restaurant logo ${index + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;