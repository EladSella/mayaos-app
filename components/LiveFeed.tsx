import React, { useEffect, useState } from 'react';
import { FeedEvent } from '../types';
import { EVENT_ICONS, EVENT_COLORS } from '../constants';
import { mockFeed } from '../services/mockApi';

export const LiveFeed: React.FC = () => {
  const [events, setEvents] = useState<FeedEvent[]>([]);

  useEffect(() => {
    mockFeed().then(setEvents);
  }, []);

  const todayEvents = events.filter(e => e.timestamp.startsWith('Today'));
  const olderEvents = events.filter(e => !e.timestamp.startsWith('Today'));

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 sm:mb-6 pl-1">Happening Today</h3>
        <div className="space-y-3 sm:space-y-4">
          {todayEvents.length > 0 ? (
            todayEvents.map(event => <EventCard key={event.id} event={event} />)
          ) : (
            <p className="text-sm text-slate-500 font-light italic pl-1">No events today.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 sm:mb-6 pl-1">Recent Updates</h3>
        <div className="space-y-4 sm:space-y-5 relative">
          <div className="absolute left-4 top-2 bottom-4 w-px border-l border-dashed border-slate-200 -z-10"></div>
          {olderEvents.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      </div>



      {/* Agency Logos */}
      <div className="flex items-end justify-center gap-6 sm:gap-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 pt-6 sm:pt-8 border-t border-slate-200 mt-auto saturate-0 hover:saturate-100 pb-safe">
        <img src="/logos/neukleos.png" alt="Neukleos" className="h-6 sm:h-8 object-contain" />
        <div className="h-5 sm:h-6 w-px bg-slate-200"></div>
        <img src="/logos/image_and_time.png" alt="Image & Time" className="h-5 sm:h-6 object-contain" />
      </div>
    </div>
  );
};

const EventCard: React.FC<{ event: FeedEvent }> = ({ event }) => {
  return (
    <div className="flex gap-3 sm:gap-4 group">
      <div className={`
          w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 bg-white/60 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 shadow-sm
          ${EVENT_COLORS[event.type].replace('bg-', 'text-').replace('text-white', '')}
        `}>
        {EVENT_ICONS[event.type]}
      </div>
      <div className="pb-3 border-b border-slate-100 last:border-0 w-full group-hover:pl-1 transition-all">
        <h4 className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors tracking-tight">{event.title}</h4>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-light line-clamp-2 sm:line-clamp-none">{event.body}</p>
        <span className="text-[10px] font-bold text-slate-400 mt-1.5 block tracking-widest uppercase opacity-70">{event.timestamp}</span>
      </div>
    </div>
  );
};