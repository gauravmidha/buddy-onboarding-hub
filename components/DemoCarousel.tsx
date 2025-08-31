'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const slides = [
  {
    image: '/demo/task-progress.png',
    title: 'Task Progress Tracking',
    description: 'Real-time progress bars and completion tracking for all onboarding tasks.',
  },
  {
    image: '/demo/ai-assistant.png',
    title: 'AI-Powered Assistant',
    description: 'Get instant help and guidance through our intelligent chatbot.',
  },
  {
    image: '/demo/hr-dashboard.png',
    title: 'HR Dashboard',
    description: 'Comprehensive oversight of employee progress and onboarding metrics.',
  },
];

export const DemoCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        <img
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {slides[currentSlide].title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {slides[currentSlide].description}
        </p>
      </div>
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-orange-600' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
