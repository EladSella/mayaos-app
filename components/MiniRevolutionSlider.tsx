import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Calendar, TrendingUp } from 'lucide-react';

const ITEMS = [
    {
        id: 1,
        icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
        text: "Trending: Q3 Financial Overview has 15 new comments",
        color: "from-emerald-50 to-emerald-100 border-emerald-200"
    },
    {
        id: 2,
        icon: <Zap className="w-4 h-4 text-amber-600" />,
        text: "Tip: Start your search with '?' to ask AI specific questions",
        color: "from-amber-50 to-amber-100 border-amber-200"
    },
    {
        id: 3,
        icon: <Calendar className="w-4 h-4 text-blue-600" />,
        text: "Event: Town Hall starts in 30 minutes in Main Conf Room",
        color: "from-blue-50 to-blue-100 border-blue-200"
    },
    {
        id: 4,
        icon: <Sparkles className="w-4 h-4 text-purple-600" />,
        text: "New: AI Proposal Generator is now available in beta!",
        color: "from-purple-50 to-purple-100 border-purple-200"
    }
];

export const MiniRevolutionSlider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % ITEMS.length);
                setIsVisible(true);
            }, 500); // Wait for fade out
        }, 5000); // 5 seconds per item

        return () => clearInterval(interval);
    }, []);

    const currentItem = ITEMS[currentIndex];

    return (
        <div className="w-full max-w-lg mx-auto mb-6 h-10 relative overflow-hidden">
            <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 transform
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        `}
            >
                <div className={`
          flex items-center gap-3 px-4 py-1.5 rounded-full border shadow-sm backdrop-blur-sm
          bg-gradient-to-r ${currentItem.color}
        `}>
                    <div className="bg-white/50 p-1 rounded-full">
                        {currentItem.icon}
                    </div>
                    <span className="text-xs font-medium text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px]">
                        {currentItem.text}
                    </span>
                </div>
            </div>
        </div>
    );
};
