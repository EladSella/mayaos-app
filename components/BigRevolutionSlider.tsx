import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
    id: number;
    image: string;
    title: string;
    description: string;
}

const SLIDES: Slide[] = [
    {
        id: 1,
        image: '/slider/slide1.png',
        title: 'Welcome to Maya OS',
        description: 'Your central hub for productivity, collaboration, and innovation.'
    },
    {
        id: 2,
        image: '/slider/slide2.png',
        title: 'Q3 Goals Achieved',
        description: 'Celebrating our team\'s incredible performance this quarter. Keep it up!'
    }
];

export const BigRevolutionSlider: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

    return (
        <div className="w-full relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl mb-8 group">
            {/* Slides */}
            {SLIDES.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}
          `}
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-[10s]"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {slide.title}
                        </h2>
                        <p className="text-lg text-slate-200 max-w-2xl drop-shadow-md animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
                            {slide.description}
                        </p>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows (Visible on Hover) */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 right-8 z-20 flex gap-2">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-lg
              ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}
            `}
                    />
                ))}
            </div>
        </div>
    );
};
