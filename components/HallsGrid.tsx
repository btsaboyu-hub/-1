import React from 'react';
import { HALLS } from '../constants';
import { ChevronRight, Layers } from 'lucide-react';

interface HallsGridProps {
  onHallSelect?: (id: string) => void;
}

const HallsGrid: React.FC<HallsGridProps> = ({ onHallSelect }) => {
  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom duration-700">
      {HALLS.map((hall, index) => (
        <div 
          key={hall.id} 
          onClick={() => {
            // Mapping UI Hall IDs to Scene Config IDs
            // Assumes hall1 -> hall-1, hall2 -> hall-2 convention based on scenesConfig.ts
            if (onHallSelect) {
                const sceneId = `hall-${index + 1}`;
                onHallSelect(sceneId);
            }
          }}
          className="group relative overflow-hidden rounded-[2rem] shadow-xl border border-jadeBlue/5 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="aspect-[21/9] w-full overflow-hidden">
             <img 
               src={hall.image} 
               alt={hall.title} 
               className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
             />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-jadeBlue/95 via-jadeBlue/40 to-transparent flex items-center p-8">
            <div className="text-white max-w-[60%]">
               <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70 mb-1 block">{hall.subtitle}</span>
               <h4 className="text-2xl font-serif font-bold mb-2">{hall.title}</h4>
               <p className="text-xs text-white/70 line-clamp-2 leading-relaxed mb-4">{hall.description}</p>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] bg-white/10 px-2 py-1 rounded-md">
                     <Layers size={12}/>
                     <span>{hall.stats}</span>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-bold hover:translate-x-1 transition-transform">
                    进入单元 <ChevronRight size={14}/>
                  </button>
               </div>
            </div>
          </div>
          {/* 装饰性中式边框 */}
          <div className="absolute top-4 right-4 w-12 h-12 opacity-10 pointer-events-none">
             <div className="w-full h-full border border-white rotate-45" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HallsGrid;