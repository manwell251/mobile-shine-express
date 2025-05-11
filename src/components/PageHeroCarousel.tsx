
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
}

interface PageHeroCarouselProps {
  pageType: 'services' | 'about';
  autoSlideInterval?: number; // in milliseconds
}

const PageHeroCarousel: React.FC<PageHeroCarouselProps> = ({ 
  pageType,
  autoSlideInterval = 5000 
}) => {
  // Internal image sets based on page type
  const imagesByType: Record<'services' | 'about', CarouselImage[]> = {
    services: [
      {
        src: "carafter1.png", 
        alt: "Professional car detailing",
        caption: "Expert detailing services for all vehicle types"
      },
      {
        src: "foamedup.webp",
        alt: "Exterior car washing",
        caption: "Premium exterior cleaning with eco-friendly products"
      },
      {
        src: "vacuumimg.webp",
        alt: "Interior cleaning service",
        caption: "Thorough interior sanitation and restoration"
      },
      {
        src: "car-seat-upholstery-cleaning-washing-d.webp",
        alt: "High-pressure cleaning",
        caption: "Advanced equipment for superior results"
      }
    ],
    about: [
      {
        src: "car2.avif",
        alt: "Our professional team",
        caption: "Our dedicated team of car care specialists"
      },
      {
        src: "car1.avif",
        alt: "Company history",
        caption: "Serving our community since our founding"
      },
      {
        src: "home.png",
        alt: "Staff training",
        caption: "Continuous training to maintain the highest standards"
      },
      {
        src: "carafter1.png",
        alt: "Community involvement",
        caption: "Giving back to our local community"
      }
    ]
  };

  // Select the appropriate images based on pageType
  const images = imagesByType[pageType];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [autoSlideInterval]);

  // Different themes based on page type
  const titleText = pageType === 'services' 
    ? 'Experience Quality Car Care' 
    : 'Our Professional Team at Work';
  
  return (
    <section className="relative py-16 bg-gradient-to-b from-brand-blue/90 to-brand-blue/70 text-white overflow-hidden">
      {/* Abstract shapes for background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{titleText}</h2>
        <p className="text-white/90 text-lg md:text-xl text-center mb-10 max-w-3xl mx-auto">
          {pageType === 'services' 
            ? 'Professional mobile car wash services designed to keep your vehicle looking pristine — wherever you are.'
            : 'Dedicated professionals with a passion for making your vehicle shine.'
          }
        </p>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Main carousel with glass effect */}
          <div className="overflow-hidden rounded-xl shadow-2xl backdrop-blur-sm bg-white/10 border border-white/20">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-[300px] md:h-[500px]"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="w-full flex-shrink-0 relative"
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-full object-cover"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 backdrop-blur-sm">
                      <p className="text-lg md:text-xl font-medium">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons with improved design */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white/40 transition-all border border-white/30"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white/40 transition-all border border-white/30"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
          
          {/* Indicators with improved design */}
          <div className="flex justify-center mt-6 space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white scale-110' 
                    : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHeroCarousel;
