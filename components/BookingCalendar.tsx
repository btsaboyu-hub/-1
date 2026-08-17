import React, { useState } from 'react';
import { CalendarCheck, CheckCircle2, Clock, Users } from 'lucide-react';
import { TIME_SLOTS } from '../constants';

interface BookingRecord {
  id: string;
  date: string;
  slot: string;
  createdAt: string;
}

const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const BookingCalendar: React.FC = () => {
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });
  const [selectedDate, setSelectedDate] = useState(toLocalDateKey(days[0]));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingRecord | null>(null);

  const confirmBooking = () => {
    if (!selectedSlot) return;
    const record: BookingRecord = {
      id: `SXU-${Date.now().toString().slice(-6)}`,
      date: selectedDate,
      slot: selectedSlot,
      createdAt: new Date().toISOString(),
    };
    const records = JSON.parse(localStorage.getItem('heritage360-bookings') || '[]');
    localStorage.setItem('heritage360-bookings', JSON.stringify([...records, record]));
    setBooking(record);
  };

  if (booking) {
    return (
      <div className="min-h-[620px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 rounded-full bg-harvestGreen/10 text-harvestGreen flex items-center justify-center mb-6"><CheckCircle2 size={50}/></div>
        <p className="text-xs text-jadeBlue/45 tracking-[0.25em] font-bold mb-2">BOOKING CONFIRMED</p>
        <h2 className="text-3xl font-serif text-jadeBlue font-bold mb-3">预约成功</h2>
        <p className="text-sm text-inkBlack/55 mb-8">预约记录已保存至本机，可在“我的”中查看。</p>
        <div className="w-full p-6 rounded-3xl bg-white border border-jadeBlue/10 shadow-sm text-left space-y-4">
          <div className="flex justify-between"><span className="text-inkBlack/45">预约编号</span><strong className="text-jadeBlue">{booking.id}</strong></div>
          <div className="flex justify-between"><span className="text-inkBlack/45">参观日期</span><strong>{booking.date}</strong></div>
          <div className="flex justify-between gap-4"><span className="text-inkBlack/45">参观时段</span><strong className="text-right">{booking.slot}</strong></div>
        </div>
        <button onClick={() => { setBooking(null); setSelectedSlot(null); }} className="mt-8 w-full py-4 rounded-2xl bg-jadeBlue text-white font-serif font-bold">继续预约</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-8">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-jadeBlue/5 text-jadeBlue"><CalendarCheck size={22}/></div>
        <div><h3 className="text-xl font-serif text-jadeBlue font-bold">选择参观日期</h3><p className="text-xs text-inkBlack/40 mt-1">开放未来14天的体验预约</p></div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-1">
        {days.map((date) => {
          const isoDate = toLocalDateKey(date);
          const isSelected = selectedDate === isoDate;
          return (
            <button key={isoDate} onClick={() => { setSelectedDate(isoDate); setSelectedSlot(null); }} aria-label={`选择${isoDate}`} className={`flex-shrink-0 w-16 h-24 rounded-[1.5rem] flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-jadeBlue text-white shadow-xl scale-105 font-bold' : 'bg-white border border-jadeBlue/10 text-jadeBlue/60'}`}>
              <span className="text-[10px] opacity-70 mb-2">{date.toLocaleDateString('zh-CN', { weekday: 'short' })}</span>
              <span className="text-xl font-serif">{date.getDate()}</span>
              <span className="text-[9px] opacity-55 mt-1">{date.getMonth() + 1}月</span>
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
              <button key={slot.time} disabled={isFull} onClick={() => setSelectedSlot(slot.time)} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${isSelected ? 'bg-jadeBlue/5 border-jadeBlue shadow-inner' : isFull ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed' : 'bg-white border-jadeBlue/10'}`}>
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-2xl ${isSelected ? 'bg-jadeBlue text-white shadow-lg' : 'bg-paperWhite text-jadeBlue'}`}><Clock size={22}/></div>
                  <div className="text-left"><p className={`font-serif text-lg font-bold ${isSelected ? 'text-jadeBlue' : 'text-inkBlack'}`}>{slot.time}</p><div className="flex items-center gap-1.5 text-[11px] text-inkBlack/50 font-bold mt-1"><Users size={12}/><span>{isFull ? '约满' : `体验名额剩余 ${slot.available}`}</span></div></div>
                </div>
                {!isFull && <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-jadeBlue' : 'border-jadeBlue/20'}`}>{isSelected && <div className="w-3 h-3 rounded-full bg-jadeBlue"/>}</div>}
              </button>
            );
          })}
        </div>
      </div>

      <button disabled={!selectedSlot} onClick={confirmBooking} className={`w-full py-5 rounded-3xl font-serif text-lg tracking-[0.15em] transition-all ${selectedSlot ? 'bg-sxuRed text-white shadow-[0_15px_30px_-10px_rgba(178,34,34,0.4)]' : 'bg-jadeBlue/15 text-white cursor-not-allowed'}`}>{selectedSlot ? '确认体验预约' : '请先选择参观时段'}</button>
      <p className="text-[11px] text-center leading-relaxed text-jadeBlue/40">本项目为数字产品原型，预约数据仅保存在当前设备，不代表校史馆官方预约。</p>
    </div>
  );
};

export default BookingCalendar;
