import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, Wand2, CalendarDays, UserPlus } from 'lucide-react';
import { SearchResult } from '../types';
import { mockSearch } from '../services/mockApi';
import { searchDrive } from '../services/googleDrive';
import { SearchResultItem } from './SearchResultItem';
import { BigRevolutionSlider } from './BigRevolutionSlider';

interface Props {
  isGoogleAuth?: boolean;
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'decks', label: 'Decks' },
  { id: 'docs', label: 'Docs' },
  { id: 'sheets', label: 'Sheets' },
  { id: 'people', label: 'People' },
];

export const SearchSection: React.FC<Props> = ({ isGoogleAuth }) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const handler = setTimeout(() => {
      performSearch(query, activeFilter);
    }, 400); // 400ms debounce

    return () => clearTimeout(handler);
  }, [query, activeFilter]);

  const performSearch = async (q: string, filter: string) => {
    setIsSearching(true);
    try {
      let data: SearchResult[] = [];
      if (isGoogleAuth) {
        data = await searchDrive(q, filter);
      }

      if (data.length === 0) {
        data = await mockSearch(q, filter);
      }

      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
      if (q.length > 0) setHasSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch(query, activeFilter);
      // Blur input on mobile to hide keyboard
      (e.target as HTMLInputElement).blur();
    }
  };

  const isAskMode = query.trim().startsWith('?');

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col items-center">
      {/* Search Input Container */}
      <div className="w-full relative group z-10">
        <BigRevolutionSlider />
        <div className={`absolute bottom-3 sm:bottom-4 left-4 sm:left-5 flex items-center pointer-events-none transition-colors duration-200 ${isAskMode ? 'text-rose-600' : 'text-slate-400'}`}>
          {isAskMode ? <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" /> : <Search className="w-5 h-5 sm:w-6 sm:h-6" />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search docs, decks..."
          className={`w-full h-12 sm:h-16 pl-12 sm:pl-14 pr-4 rounded-full border bg-white/80 backdrop-blur-xl shadow-sm text-base sm:text-lg outline-none transition-all duration-300 text-slate-800 tracking-wide font-light appearance-none
            ${isAskMode
              ? 'border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 placeholder:text-rose-400/50'
              : 'border-white focus:border-white focus:ring-4 focus:ring-white/50 placeholder:text-slate-400 shadow-slate-200/50'
            }
          `}
        />
        {isSearching && (
          <div className="absolute bottom-3 sm:bottom-3.5 right-4 flex items-center">
            <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
          </div>
        )}
      </div>

      {/* Filters - Touch Optimized */}
      <div className="flex gap-2 mt-4 overflow-x-auto w-screen sm:w-full px-4 sm:px-0 justify-start sm:justify-center pb-2 no-scrollbar scroll-smooth">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border backdrop-blur-md active:scale-95 flex-shrink-0
              ${activeFilter === f.id
                ? 'bg-rose-100 border-rose-200 text-rose-900 shadow-sm transform scale-105'
                : 'bg-white/60 border-white/40 text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Feature Cards */}
      {!hasSearched && (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 mb-2 sm:mb-4 px-1">
          <FeatureCard
            icon={<Wand2 className="w-5 h-5 text-purple-400" />}
            title="AI Proposal Generator"
            comingSoon={true}
          />
          <FeatureCard
            icon={<CalendarDays className="w-5 h-5 text-blue-400" />}
            title="Submit Leave Requests"
            comingSoon={true}
          />
          <FeatureCard
            icon={<UserPlus className="w-5 h-5 text-emerald-400" />}
            title="Submit A Lead for BM"
            comingSoon={true}
          />
        </div>
      )}

      {/* Results Area */}
      <div className="w-full mt-8 sm:mt-12 space-y-3 pb-safe">
        {results.length === 0 && !isSearching && hasSearched ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No results found for "{query}"</p>
            {isAskMode && <p className="text-sm text-rose-500 mt-2">AI Ask Mode is currently in beta.</p>}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {results.map((result) => (
              <SearchResultItem key={result.id} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, comingSoon }: { icon: React.ReactNode, title: string, comingSoon?: boolean }) => (
  <div className="group relative overflow-hidden bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl p-4 sm:p-6 hover:border-yellow-200/60 hover:bg-white/80 transition-all duration-500 cursor-default shadow-sm hover:shadow-yellow-100/50 hover:-translate-y-1 active:scale-[0.98]">
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:border-yellow-200 group-hover:scale-110 transition-all duration-500 shadow-sm">
        {icon}
      </div>
      <h4 className="font-semibold text-slate-600 text-sm group-hover:text-slate-900 transition-colors tracking-wide">
        {title}
      </h4>
    </div>
    {comingSoon && (
      <span className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[9px] sm:text-[10px] font-bold tracking-widest text-slate-400 uppercase border border-slate-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-white/50 backdrop-blur-md group-hover:text-yellow-600 group-hover:border-yellow-200/50 transition-colors">
        Soon
      </span>
    )}
  </div>
);
