import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SearchSection } from './components/SearchSection';
import { LiveFeed } from './components/LiveFeed';
import { initGoogleClient, handleAuthClick, handleSignOutClick } from './services/googleDrive';
import { User } from './types';
import { Search as SearchIcon } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Google Client
  useEffect(() => {
    initGoogleClient((googleUser) => {
      setUser(googleUser);
      setIsLoading(false);
    });

    // Fallback if auth takes too long or fails silently (optional, but good for UX)
    const timeout = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
        {/* Abstract Background Elements - Light Mode */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/40 rounded-full blur-[120px] animate-pulse mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-200/40 rounded-full blur-[120px] mix-blend-multiply"></div>

        <div className="z-10 flex flex-col items-center p-12 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl shadow-slate-200/50 max-w-md w-full mx-4 transition-all hover:scale-[1.01] hover:shadow-rose-100/50 group">
          <div className="mb-8 flex flex-col items-center">
            <h1 className="text-4xl font-extrabold mb-3 tracking-tighter drop-shadow-sm flex items-center gap-0.5">
              <span className="text-[#E10020]">Maya</span><span className="font-light text-slate-400">OS</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium tracking-widest uppercase opacity-80 mt-1">
              What matters, now
            </p>

          </div>

          <button
            onClick={() => handleAuthClick()}
            className="group/btn w-full flex items-center justify-center gap-3 bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-6 py-4 rounded-xl transition-all duration-300 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5 opacity-70 group-hover/btn:opacity-100 transition-opacity" />
            <span>Sign in with Google Workspace</span>
          </button>
        </div>

        {/* Footer Logos */}
        <div className="absolute bottom-12 flex items-end gap-12 opacity-80 hover:opacity-100 transition-opacity duration-500 saturate-0 hover:saturate-100">
          <img src="/logos/neukleos.png" alt="Neukleos" className="h-10 object-contain" />
          <div className="h-8 w-px bg-slate-200"></div>
          <img src="/logos/image_and_time.png" alt="Image & Time" className="h-8 object-contain" />
        </div>
      </div>
    );
  }

  return (
    <Layout user={user}>
      <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-4rem)]">
        {/* Main Content Area (Search + Results) */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 pt-8 lg:pt-16 pb-20">
          <SearchSection isGoogleAuth={user?.id === 'google-user'} />
        </main>

        {/* Live Feed Sidebar - Sticky on Desktop */}
        <aside className="lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/50 lg:bg-transparent p-6 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 overflow-y-auto scrollbar-hide">
          <LiveFeed />
        </aside>
      </div>
    </Layout>
  );
};

export default App;