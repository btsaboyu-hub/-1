
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from './GlassCard';
import { TIME_SLOTS } from '../constants';

const BookingCalendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="text-xl font-serif text-jadeBlue font-bold">选择参观日期</h3>
        <div className="flex gap-2">
           <button className="p-1.5 rounded-full border border-jadeBlue/20 text-jadeBlue hover:bg-jadeBlue/5"><ChevronLeft size={16}/></button>
           <button className="p-1.5 rounded-full border border-jadeBlue/20 text-jadeBlue hover:bg-jadeBlue/5"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-1">
        {days.map((date) => {
          const dayNum = date.getDate();
          const dayName = date.toLocaleDateString('zh-CN', { weekday: 'short' });
          const isSelected = selectedDay === dayNum;

          return (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDay(dayNum)}
              className={`flex-shrink-0 w-16 h-24 rounded-[1.5rem] flex flex-col items-center justify-center transition-all ${
                isSelected 
                  ? 'bg-jadeBlue text-white shadow-xl scale-105 font-bold' 
                  : 'bg-white border border-jadeBlue/10 text-jadeBlue/60 hover:border-jadeBlue/40'
              }`}
            >
              <span className="text-[10px] opacity-70 mb-2">{dayName}</span>
              <span className="text-xl font-serif">{dayNum}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        <h3 className="text-xl font-serif text-jadeBlue font-bold mb-5 px-1">可用时段</h3>
        <div className="grid grid-cols-1 gap-4">
          {TIME_SLOTS.map((slot) => {
            const isFull = slot.available === 0;
            const isSelected = selectedSlot === slot.time;

            return (
              <button
                key={slot.time}
                disabled={isFull}
                onClick={() => setSelectedSlot(slot.time)}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                  isSelected 
                    ? 'bg-jadeBlue/5 border-jadeBlue shadow-inner' 
                    : isFull ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed grayscale' : 'bg-white border-jadeBlue/10'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-2xl transition-all ${isSelected ? 'bg-jadeBlue text-white shadow-lg' : 'bg-paperWhite text-jadeBlue'}`}>
                    <Clock size={22} />
                  </div>
                  <div className="text-left">
                    <p className={`font-serif text-lg font-bold ${isSelected ? 'text-jadeBlue' : 'text-inkBlack'}`}>{slot.time}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-inkBlack/50 font-bold mt-1">
                      <Users size={12} />
                      <span>{isFull ? '约满' : `剩余 ${slot.available} 名额`}</span>
                    </div>
                  </div>
                </div>
                {!isFull && (
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-jadeBlue' : 'border-jadeBlue/20'}`}>
                     {isSelected && <div className="w-3 h-3 rounded-full bg-jadeBlue animate-pulse" />}
                   </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-6">
        <button 
          disabled={!selectedSlot}
          className={`w-full py-5 rounded-3xl font-serif text-xl tracking-[0.2em] transition-all ${
            selectedSlot 
              ? 'bg-sxuRed text-white shadow-[0_15px_30px_-10px_rgba(178,34,34,0.4)] hover:translate-y-[-2px]' 
              : 'bg-jadeBlue/20 text-white cursor-not-allowed'
          }`}
        >
          {selectedSlot ? '立即确认预约' : '请先选择参观时段'}
        </button>
        <div className="mt-6 flex items-center justify-center gap-4 opacity-40 grayscale scale-90">
           <img src="https://img.icons8.com/ios-filled/50/126e82/verified-badge.png" className="w-6" alt="safe"/>
           <p className="text-[11px] font-serif text-jadeBlue text-center leading-relaxed">
            * 请持身份证件于入校口核验入场<br/>参观期间请爱护校园环境及古建筑
           </p>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
