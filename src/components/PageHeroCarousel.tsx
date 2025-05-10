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
        src: "/images/team-members.webp",
        alt: "Our professional team",
        caption: "Our dedicated team of car care specialists"
      },
      {
        src: "/images/company-history.webp",
        alt: "Company history",
        caption: "Serving our community since our founding"
      },
      {
        src: "/images/training.webp",
        alt: "Staff training",
        caption: "Continuous training to maintain the highest standards"
      },
      {
        src: "/images/community-service.webp",
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
  const bgColor = pageType === 'services' ? 'bg-gradient-to-r from-blue-50 to-gray-50' : 'bg-gradient-to-r from-gray-50 to-blue-50';
  const titleText = pageType === 'services' 
    ? 'Experience Quality Car Care' 
    : 'Our Professional Team at Work';
  
  return (
    <section className={`py-10 bg-brand-lightBlue`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">{titleText}</h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          {pageType === 'services' 
            ? 'Professional mobile car wash services designed to keep your vehicle looking pristine — wherever you are.'
            : 'Dedicated professionals with a passion for making your vehicle shine.'
          }
        </p>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Main carousel */}
          <div className="overflow-hidden rounded-xl shadow-2xl bg-blue-50/70">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-[300px] md:h-[400px]"
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
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
                      <p className="text-lg font-medium">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="text-brand-blue" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="text-brand-blue" />
          </button>
          
          {/* Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-brand-blue' : 'bg-gray-300'
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