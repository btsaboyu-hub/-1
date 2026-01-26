
import React from 'react';
import { EVENTS } from '../constants';
import { Calendar, Tag, ChevronRight } from 'lucide-react';

const EventsWaterfall: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom duration-700">
      {EVENTS.map((event) => (
        <div key={event.id} className="group cursor-pointer">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-lg">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            <div className="absolute top-4 left-4">
               <div className="bg-harvestGreen text-white text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-widest">
                 {event.category}
               </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-2 text-[10px] text-white/70 uppercase tracking-widest mb-1 font-sans">
                <Calendar size={12} />
                <span>{event.date}</span>
              </div>
              <h4 className="text-xl font-serif font-bold leading-tight line-clamp-2">{event.title}</h4>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2 text-jadeBlue/60">
              <Tag size={14} />
              <span className="text-sm font-serif font-bold text-jadeBlue">{event.price}</span>
            </div>
            <button className="p-2 rounded-full border border-jadeBlue/10 hover:bg-jadeBlue hover:text-white transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsWaterfall;
