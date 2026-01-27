
import React from 'react';
import { X, MapPin, Calendar, ArrowRight, Activity, Clock } from 'lucide-react';
import { ACTIVITIES, HALL_STATUSES } from '../constants';

interface ActivitiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToHall: (hallId: string) => void;
}

const ActivitiesDrawer: React.FC<ActivitiesDrawerProps> = ({ isOpen, onClose, onNavigateToHall }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-inkBlack/40 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-md h-full bg-paperWhite/95 backdrop-blur-2xl shadow-[-20px_0_40px_rgba(0,0,0,0.2)] flex flex-col animate-in slide-in-from-right duration-500 border-l border-white/20">
        
        {/* Header */}
        <div className="px-6 py-8 flex justify-between items-end border-b border-jadeBlue/5 bg-gradient-to-b from-white/40 to-transparent">
          <div>
            <h2 className="text-2xl font-serif font-bold text-jadeBlue flex items-center gap-2">
              <Activity size={20} className="text-sxuRed" />
              校史动态
            </h2>
            <p className="text-[10px] text-jadeBlue/50 uppercase tracking-[0.2em] mt-1 font-bold">Museum Events & Status</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-jadeBlue/5 text-jadeBlue hover:bg-jadeBlue hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-6">
          
          {/* Section 1: Hall Status */}
          <div className="mb-10 pl-6">
             <h3 className="text-sm font-bold text-inkBlack/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-jadeBlue" />
                实时馆况
             </h3>
             <div className="flex gap-3 overflow-x-auto pr-6 no-scrollbar pb-2">
                {HALL_STATUSES.map((status) => (
                  <div key={status.id} className="flex-shrink-0 w-32 p-3 rounded-2xl bg-white border border-jadeBlue/5 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`w-2 h-2 rounded-full ${
                         status.status === 'open' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
                         status.status === 'busy' ? 'bg-orange-500' : 'bg-gray-300'
                       }`} />
                       <span className="text-[10px] font-bold text-inkBlack/30 uppercase">
                         {status.status === 'open' ? '正常' : status.status === 'busy' ? '拥挤' : '维护'}
                       </span>
                    </div>
                    <h4 className="font-serif font-bold text-jadeBlue mb-1">{status.name}</h4>
                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-jadeBlue/30" 
                         style={{ width: `${status.occupancy}%` }} 
                       />
                    </div>
                    <p className="text-[9px] text-right mt-1 text-jadeBlue/40">{status.occupancy}% 热度</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Section 2: Activities Timeline */}
          <div className="px-6">
            <h3 className="text-sm font-bold text-inkBlack/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sxuRed" />
                近期活动
             </h3>
             
             <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-[1px] before:bg-jadeBlue/10">
                {ACTIVITIES.map((activity, index) => (
                  <div key={activity.id} className={`relative pl-10 group ${activity.status === 'ended' ? 'opacity-60 grayscale-[0.8]' : ''}`}>
                     {/* Timeline Dot */}
                     <div className={`absolute left-4 -translate-x-1/2 top-1 w-3 h-3 rounded-full border-2 border-white shadow-md z-10 ${
                        activity.status === 'ongoing' ? 'bg-sxuRed animate-pulse' : 
                        activity.status === 'upcoming' ? 'bg-jadeBlue' : 'bg-gray-300'
                     }`} />
                     
                     {/* Card */}
                     <div 
                        onClick={() => {
                           if (activity.linkedHallId && activity.status !== 'ended') {
                              onNavigateToHall(activity.linkedHallId);
                              onClose();
                           }
                        }}
                        className={`bg-white/60 p-4 rounded-2xl border border-white shadow-sm transition-all ${
                           activity.linkedHallId && activity.status !== 'ended' ? 'hover:bg-white hover:scale-[1.02] cursor-pointer hover:shadow-md' : ''
                        }`}
                     >
                        <div className="flex justify-between items-start mb-2">
                           <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              activity.status === 'ongoing' ? 'bg-sxuRed/10 text-sxuRed' :
                              activity.status === 'upcoming' ? 'bg-jadeBlue/10 text-jadeBlue' : 'bg-gray-100 text-gray-500'
                           }`}>
                              {activity.status === 'ongoing' ? '进行中' : activity.status === 'upcoming' ? '预告' : '已结束'}
                           </span>
                           <span className="text-[10px] text-inkBlack/40 font-mono flex items-center gap-1">
                              <Calendar size={10} /> {activity.date}
                           </span>
                        </div>
                        
                        <h4 className="font-serif font-bold text-lg text-jadeBlue mb-2 leading-tight">{activity.title}</h4>
                        <p className="text-xs text-inkBlack/60 leading-relaxed mb-3 line-clamp-2">
                           {activity.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-jadeBlue/5">
                           <div className="flex items-center gap-1.5 text-[10px] text-jadeBlue/50 font-bold">
                              <MapPin size={12} />
                              {activity.locationLabel}
                           </div>
                           
                           {activity.linkedHallId && activity.status !== 'ended' && (
                              <button className="flex items-center gap-1 text-[10px] font-bold text-sxuRed group-hover:translate-x-1 transition-transform">
                                 前往现场 <ArrowRight size={12} />
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
        
        {/* Footer Decoration */}
        <div className="p-4 text-center opacity-20 pointer-events-none">
           <div className="text-[40px] font-serif font-bold text-jadeBlue leading-none">SXU</div>
           <div className="text-[9px] tracking-[1em] uppercase">Since 1902</div>
        </div>

      </div>
    </div>
  );
};

export default ActivitiesDrawer;
