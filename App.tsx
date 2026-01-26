
import React, { useState, useEffect } from 'react';
import { AppRoute } from './types';
import PanoramaViewer from './components/PanoramaViewer';
import ARExhibit from './components/ARExhibit';
import BookingCalendar from './components/BookingCalendar';
import HallsGrid from './components/HallsGrid';
import GlassCard from './components/GlassCard';
import { NOTIFICATIONS, SEARCH_SUGGESTIONS } from './constants';
import { Home, Compass, Camera, Calendar, User, Bell, Search, Menu, ChevronRight, Info, X, Clock, MessageSquare, ShieldAlert, BookOpen, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.HOME);
  const [loading, setLoading] = useState(true);
  const [showFeatureModal, setShowFeatureModal] = useState<'search' | 'notifications' | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const NavItem: React.FC<{ route: AppRoute; icon: React.ReactNode; label: string }> = ({ route, icon, label }) => (
    <button 
      onClick={() => setCurrentRoute(route)}
      className={`flex flex-col items-center justify-center transition-all ${
        currentRoute === route ? 'text-jadeBlue scale-110 font-bold' : 'text-jadeBlue/40'
      }`}
    >
      <div className={`p-2 rounded-xl transition-all ${currentRoute === route ? 'bg-jadeBlue/5 shadow-sm' : ''}`}>
        {icon}
      </div>
      <span className="text-[11px] font-serif mt-1 tracking-wider">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-paperWhite flex flex-col items-center justify-center z-[100]">
        <div className="relative w-28 h-28 mb-8">
          <div className="absolute inset-0 border-[1px] border-jadeBlue/20 rounded-full animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-0 border-t-2 border-sxuRed rounded-full animate-[spin_2s_ease-in-out_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-jadeBlue rounded-full flex items-center justify-center text-white font-serif font-bold text-2xl shadow-2xl">
              校史
            </div>
          </div>
        </div>
        <h2 className="text-jadeBlue font-serif tracking-[0.5em] text-xl font-bold animate-pulse">山西大学校史馆</h2>
        <p className="text-[10px] text-jadeBlue/40 mt-4 uppercase font-sans tracking-[0.3em]">沉浸式数字展厅</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paperWhite text-inkBlack font-sans flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-jadeBlue/5">
      
      {/* 顶部状态栏 */}
      <header className={`px-6 pt-12 pb-4 z-40 transition-all duration-500 ${currentRoute === AppRoute.PANORAMA || currentRoute === AppRoute.AR ? 'absolute top-0 w-full text-white' : 'text-jadeBlue'}`}>
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-jadeBlue rounded-full flex items-center justify-center text-white shadow-lg border border-white/20">
               <span className="font-serif font-bold text-xs">SXU</span>
             </div>
             <div>
                <h1 className={`font-serif text-lg leading-tight font-bold ${currentRoute === AppRoute.PANORAMA || currentRoute === AppRoute.AR ? 'drop-shadow-md' : ''}`}>
                  校史馆交互系统
                </h1>
                <p className="text-[9px] tracking-[0.2em] uppercase opacity-60 font-medium">History Museum Interactive</p>
             </div>
           </div>
           <div className="flex gap-3">
              <button 
                onClick={() => setShowFeatureModal('search')}
                className="p-2.5 rounded-full glass-morphism border-white/20 text-inherit hover:scale-110 active:scale-95 transition-all"
              >
                <Search size={18} />
              </button>
              <button 
                onClick={() => setShowFeatureModal('notifications')}
                className="p-2.5 rounded-full glass-morphism border-white/20 text-inherit hover:scale-110 active:scale-95 transition-all relative"
              >
                <Bell size={18} />
                <div className="absolute top-2 right-2 w-2 h-2 bg-sxuRed rounded-full border border-white" />
              </button>
           </div>
        </div>
      </header>

      {/* 搜索弹出层 (优化内容) */}
      {showFeatureModal === 'search' && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-paperWhite/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="px-6 pt-16 pb-6 overflow-y-auto no-scrollbar">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-serif text-jadeBlue font-bold">馆内检索</h3>
                  <p className="text-[10px] text-jadeBlue/40 font-bold uppercase tracking-widest">Search Exhibition, Artifacts, Events</p>
                </div>
                <button onClick={() => setShowFeatureModal(null)} className="p-2 rounded-full bg-jadeBlue/5"><X size={20}/></button>
             </div>
             <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-jadeBlue/40" size={20} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="搜索展厅、展品或校史活动..." 
                  className="w-full bg-jadeBlue/5 border border-jadeBlue/10 rounded-2xl py-4 pl-12 pr-4 font-serif text-lg focus:outline-none focus:ring-2 focus:ring-jadeBlue/20 transition-all shadow-inner"
                />
             </div>
             <div className="space-y-8 pb-12">
                {SEARCH_SUGGESTIONS.map((section) => (
                  <div key={section.category}>
                    <h4 className="text-xs font-bold text-jadeBlue/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                       {section.category === '展厅' && <MapPin size={14} />}
                       {section.category === '展品' && <BookOpen size={14} />}
                       {section.category === '活动' && <Calendar size={14} />}
                       {section.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {section.items.map((item) => (
                         <button key={item} className="px-4 py-2 bg-white border border-jadeBlue/10 rounded-xl text-sm font-serif text-jadeBlue hover:bg-jadeBlue hover:text-white hover:border-jadeBlue transition-all shadow-sm">
                           {item}
                         </button>
                       ))}
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      )}

      {/* 通知弹出层 (优化内容) */}
      {showFeatureModal === 'notifications' && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-paperWhite/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
           <div className="px-6 pt-16 pb-6 flex-1 overflow-y-auto no-scrollbar">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-serif text-jadeBlue font-bold">馆内通知</h3>
                  <p className="text-[10px] text-jadeBlue/40 font-bold uppercase tracking-widest">Booking & Official Updates</p>
                </div>
                <button onClick={() => setShowFeatureModal(null)} className="p-2 rounded-full bg-jadeBlue/5"><X size={20}/></button>
             </div>
             <div className="space-y-4">
                {NOTIFICATIONS.map((note) => (
                  <GlassCard key={note.id} className="p-4 border-none shadow-sm flex gap-4 items-start active:scale-[0.98] transition-all bg-white/60">
                    <div className={`p-3 rounded-2xl flex-shrink-0 ${
                      note.type === '预约' ? 'bg-jadeBlue/10 text-jadeBlue' :
                      note.type === '活动' ? 'bg-harvestGreen/10 text-harvestGreen' : 'bg-sxuRed/10 text-sxuRed'
                    }`}>
                      {note.type === '预约' ? <Calendar size={20}/> : 
                       note.type === '活动' ? <MessageSquare size={20}/> : <ShieldAlert size={20}/>}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            note.type === '预约' ? 'bg-jadeBlue/10 text-jadeBlue' :
                            note.type === '活动' ? 'bg-harvestGreen/10 text-harvestGreen' : 'bg-sxuRed/10 text-sxuRed'
                          }`}>{note.type}</span>
                          <span className="text-[10px] text-inkBlack/30 flex items-center gap-1 font-bold">
                            <Clock size={10}/> {note.time}
                          </span>
                       </div>
                       <h4 className="font-serif font-bold text-jadeBlue mb-1">{note.title}</h4>
                       <p className="text-sm text-inkBlack/60 leading-relaxed line-clamp-2">{note.content}</p>
                    </div>
                  </GlassCard>
                ))}
             </div>
           </div>
           <div className="p-6 bg-white/80 border-t border-jadeBlue/5">
              <button className="w-full py-4 bg-jadeBlue text-white rounded-2xl font-serif font-bold shadow-lg shadow-jadeBlue/20 active:scale-95 transition-all">
                全部标记为已读
              </button>
           </div>
        </div>
      )}

      {/* 主内容区域 */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative pb-32">
        {currentRoute === AppRoute.HOME && (
          <div className="px-6 space-y-10 pt-6">
            <div className="relative h-72 rounded-[2.5rem] overflow-hidden shadow-2xl group transition-page">
              <img src="https://images.unsplash.com/photo-1590483734724-38fa19744990?q=80&w=2000&auto=format&fit=crop" alt="校史馆外景" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-jadeBlue/95 via-jadeBlue/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className="text-[10px] text-white/80 uppercase tracking-widest font-sans mb-2 block border-l-2 border-sxuRed pl-3">数字馆藏</span>
                <h2 className="text-3xl font-serif font-bold mb-5 leading-snug">追寻山大根脉：<br/>虚拟校史馆巡礼</h2>
                <button 
                   onClick={() => setCurrentRoute(AppRoute.PANORAMA)}
                   className="bg-sxuRed text-white px-8 py-2.5 rounded-full font-serif text-sm shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2"
                >
                  <Compass size={16} /> 开启全景漫游
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 transition-page" style={{ animationDelay: '0.2s' }}>
              {[
                { icon: <Compass size={22}/>, label: '展厅巡游', route: AppRoute.PANORAMA },
                { icon: <Camera size={22}/>, label: '灵境寻古', route: AppRoute.AR },
                { icon: <Calendar size={22}/>, label: '团队预约', route: AppRoute.BOOKING },
                { icon: <User size={22}/>, label: '我的主页', route: AppRoute.PROFILE }
              ].map((item, idx) => (
                <button key={idx} onClick={() => setCurrentRoute(item.route)} className="flex flex-col items-center gap-2">
                   <div className="w-16 h-16 glass-morphism rounded-3xl flex items-center justify-center text-jadeBlue border border-jadeBlue/10 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                      {item.icon}
                   </div>
                   <span className="text-[11px] font-bold text-jadeBlue/70 font-serif tracking-tighter">{item.label}</span>
                </button>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif text-jadeBlue font-bold flex items-center gap-2">
                   <span className="w-1.5 h-6 bg-sxuRed rounded-full" />
                   展厅导览
                </h3>
                <span className="text-[11px] font-bold text-jadeBlue/30 uppercase tracking-[0.2em]">4大核心单元</span>
              </div>
              <HallsGrid />
            </div>
          </div>
        )}

        {currentRoute === AppRoute.PANORAMA && <div className="h-full w-full absolute inset-0"><PanoramaViewer /></div>}
        {currentRoute === AppRoute.AR && <div className="h-full w-full absolute inset-0"><ARExhibit /></div>}
        {currentRoute === AppRoute.BOOKING && <div className="px-6 py-12"><BookingCalendar /></div>}
        {currentRoute === AppRoute.PROFILE && (
          <div className="px-6 py-12 transition-page">
            <div className="text-center mb-10">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-jadeBlue/5 mx-auto flex items-center justify-center border-2 border-jadeBlue/10 mb-4 overflow-hidden shadow-inner">
                   <User size={56} className="text-jadeBlue/40" />
                </div>
                <div className="absolute bottom-4 right-0 w-8 h-8 bg-sxuRed text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                   <ShieldAlert size={16} />
                </div>
              </div>
              <h2 className="text-2xl font-serif text-jadeBlue font-bold">校史研究员 #1902</h2>
              <p className="text-xs text-inkBlack/40 mt-1 uppercase tracking-widest font-bold">学术访客身份认证</p>
            </div>
            
            <div className="space-y-4 pb-12">
               {[
                 { label: '预约历史', icon: <Calendar size={18}/>, value: '3次' },
                 { label: '云游足迹', icon: <Compass size={18}/>, value: '12处' },
                 { label: '馆藏收藏', icon: <BookOpen size={18}/>, value: '5件' },
                 { label: '系统通知', icon: <Bell size={18}/> },
                 { label: '关于校史馆', icon: <Info size={18}/> }
               ].map((item, idx) => (
                 <GlassCard key={idx} className="py-4 px-6 flex justify-between items-center group active:scale-[0.98] transition-all bg-white/60">
                    <div className="flex items-center gap-4">
                       <div className="text-jadeBlue/40 group-hover:text-jadeBlue transition-colors">{item.icon}</div>
                       <span className="font-serif text-lg text-jadeBlue">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       {item.value && <span className="text-xs bg-jadeBlue text-white px-2 py-0.5 rounded-full font-bold">{item.value}</span>}
                       <ChevronRight size={18} className="text-jadeBlue/20" />
                    </div>
                 </GlassCard>
               ))}
            </div>
          </div>
        )}
      </main>

      {/* 底部导航 - 修改 label 回 "我的" */}
      <footer className="absolute bottom-8 inset-x-6 z-50">
        <GlassCard className="py-4 px-8 rounded-[2rem] flex justify-between items-center shadow-[0_20px_40px_-15px_rgba(18,110,130,0.3)] border-white/60">
           <NavItem route={AppRoute.HOME} icon={<Home size={22}/>} label="首页" />
           <NavItem route={AppRoute.PANORAMA} icon={<Compass size={22}/>} label="云游" />
           <div className="relative -top-12 flex flex-col items-center">
             <button 
               onClick={() => setCurrentRoute(AppRoute.AR)}
               className={`w-18 h-18 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transition-all ${
                 currentRoute === AppRoute.AR ? 'bg-jadeBlue text-white scale-110' : 'bg-sxuRed text-white hover:bg-sxuRed/90'
               }`}
               style={{ width: '4.5rem', height: '4.5rem' }}
             >
                <Camera size={32} />
             </button>
             <span className={`text-[11px] font-bold mt-2 font-serif ${currentRoute === AppRoute.AR ? 'text-jadeBlue' : 'text-jadeBlue/60'}`}>灵境</span>
           </div>
           <NavItem route={AppRoute.BOOKING} icon={<Calendar size={22}/>} label="预约" />
           <NavItem route={AppRoute.PROFILE} icon={<User size={22}/>} label="我的" />
        </GlassCard>
      </footer>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default App;
