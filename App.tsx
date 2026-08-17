
import React, { useState, useEffect } from 'react';
import { AppRoute } from './types';
import BookingCalendar from './components/BookingCalendar';
import HallsGrid from './components/HallsGrid';
import GlassCard from './components/GlassCard';
import ActivitiesDrawer from './components/ActivitiesDrawer';
import AIGuide from './components/AIGuide';
import { NOTIFICATIONS, SEARCH_SUGGESTIONS } from './constants';
import { Home, Compass, Camera, Calendar, User, Bell, Search, X, Clock, MessageSquare, ShieldAlert, BookOpen, MapPin, ChevronRight, Info, ScrollText, Bot, Sparkles } from 'lucide-react';

const PanoramaViewer = React.lazy(() => import('./components/PanoramaViewer'));
const ARExhibit = React.lazy(() => import('./components/ARExhibit'));

const FeatureLoading = () => (
  <div className="fixed inset-0 z-[100] bg-[#071b20] text-white flex items-center justify-center font-serif tracking-widest">正在加载体验...</div>
);

const getStoredCount = (key: string) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value.length : 0;
  } catch {
    return 0;
  }
};

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.HOME);
  const [activeHall, setActiveHall] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeatureModal, setShowFeatureModal] = useState<'search' | 'notifications' | 'activities' | 'ai' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentRoute === AppRoute.PROFILE) {
      setBookingCount(getStoredCount('heritage360-bookings'));
    }
  }, [currentRoute]);

  const handleSearchItem = (item: string) => {
    const hallMap: Record<string, string> = {
      '序厅': 'hall-1', '溯源厅': 'hall-2', '峥嵘厅': 'hall-2', '成果厅': 'hall-3',
      '圣旨碑': 'hall-1', '西学专斋': 'hall-2', '百年校歌': 'hall-3',
    };
    setShowFeatureModal(null);
    setSearchQuery('');
    if (hallMap[item]) setActiveHall(hallMap[item]);
  };

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

  // High Priority Render: If a Hall is active, render full screen Panorama
  if (activeHall) {
    return (
      <React.Suspense fallback={<FeatureLoading/>}>
        <PanoramaViewer
          initialSceneId={activeHall}
          onExit={() => setActiveHall(null)}
        />
      </React.Suspense>
    );
  }

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
                aria-label="打开馆内搜索"
                onClick={() => setShowFeatureModal('search')}
                className="p-2.5 rounded-full glass-morphism border-white/20 text-inherit hover:scale-110 active:scale-95 transition-all"
              >
                <Search size={18} />
              </button>
              <button 
                aria-label="打开馆内通知"
                onClick={() => setShowFeatureModal('notifications')}
                className="p-2.5 rounded-full glass-morphism border-white/20 text-inherit hover:scale-110 active:scale-95 transition-all relative"
              >
                <Bell size={18} />
                {!notificationsRead && <div className="absolute top-2 right-2 w-2 h-2 bg-sxuRed rounded-full border border-white" />}
              </button>
           </div>
        </div>
      </header>

      {/* 搜索弹出层 */}
      {showFeatureModal === 'search' && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-paperWhite/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="px-6 pt-16 pb-6 overflow-y-auto no-scrollbar">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-serif text-jadeBlue font-bold">馆内检索</h3>
                  <p className="text-[10px] text-jadeBlue/40 font-bold uppercase tracking-widest">Search Exhibition, Artifacts, Events</p>
                </div>
                <button aria-label="关闭搜索" onClick={() => { setShowFeatureModal(null); setSearchQuery(''); }} className="p-2 rounded-full bg-jadeBlue/5"><X size={20}/></button>
             </div>
             <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-jadeBlue/40" size={20} />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="搜索展厅、展品或校史活动..." 
                  className="w-full bg-jadeBlue/5 border border-jadeBlue/10 rounded-2xl py-4 pl-12 pr-4 font-serif text-lg focus:outline-none focus:ring-2 focus:ring-jadeBlue/20 transition-all shadow-inner"
                />
             </div>
             <div className="space-y-8 pb-12">
                {SEARCH_SUGGESTIONS.map((section) => ({
                  ...section,
                  items: section.items.filter((item) => item.toLowerCase().includes(searchQuery.trim().toLowerCase())),
                })).filter((section) => section.items.length > 0).map((section) => (
                  <div key={section.category}>
                    <h4 className="text-xs font-bold text-jadeBlue/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                       {section.category === '展厅' && <MapPin size={14} />}
                       {section.category === '展品' && <BookOpen size={14} />}
                       {section.category === '活动' && <Calendar size={14} />}
                       {section.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {section.items.map((item) => (
                         <button onClick={() => handleSearchItem(item)} key={item} className="px-4 py-2 bg-white border border-jadeBlue/10 rounded-xl text-sm font-serif text-jadeBlue hover:bg-jadeBlue hover:text-white hover:border-jadeBlue transition-all shadow-sm">
                           {item}
                         </button>
                       ))}
                    </div>
                  </div>
                ))}
               {searchQuery && !SEARCH_SUGGESTIONS.some((section) => section.items.some((item) => item.toLowerCase().includes(searchQuery.trim().toLowerCase()))) && (
                 <div className="text-center py-10 text-jadeBlue/45">
                   <Search className="mx-auto mb-3 opacity-40" size={28}/>
                   <p className="font-serif">暂未找到相关馆藏</p>
                   <button onClick={() => { setShowFeatureModal('ai'); }} className="mt-4 text-sm font-bold text-sxuRed">转问 AI 讲解员</button>
                 </div>
               )}
             </div>
           </div>
        </div>
      )}

      {/* 通知弹出层 */}
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
              <button onClick={() => { setNotificationsRead(true); setShowFeatureModal(null); }} className="w-full py-4 bg-jadeBlue text-white rounded-2xl font-serif font-bold shadow-lg shadow-jadeBlue/20 active:scale-95 transition-all">
                {notificationsRead ? '已全部读取' : '全部标记为已读'}
              </button>
           </div>
        </div>
      )}

      {/* Activities Drawer (New Feature) */}
      <ActivitiesDrawer 
         isOpen={showFeatureModal === 'activities'} 
         onClose={() => setShowFeatureModal(null)}
         onNavigateToHall={(hallId) => setActiveHall(hallId)}
      />

      <AIGuide
        isOpen={showFeatureModal === 'ai'}
        onClose={() => setShowFeatureModal(null)}
        onNavigateToHall={(hallId) => { setShowFeatureModal(null); setActiveHall(hallId); }}
      />

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
                   onClick={() => setActiveHall('hall-1')}
                   className="bg-sxuRed text-white px-8 py-2.5 rounded-full font-serif text-sm shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2"
                >
                  <Compass size={16} /> 开启全景漫游
                </button>
              </div>
            </div>

            <button onClick={() => setShowFeatureModal('ai')} className="w-full text-left p-5 rounded-[2rem] bg-gradient-to-br from-jadeBlue to-[#0b4350] text-white shadow-xl transition-page overflow-hidden relative group">
              <Sparkles className="absolute -right-4 -top-4 text-white/10 group-hover:scale-110 transition-transform" size={96}/>
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center"><Bot size={24}/></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><h3 className="font-serif text-lg font-bold">问问 AI 校史讲解员</h3><span className="text-[9px] bg-harvestGreen px-2 py-0.5 rounded-full font-bold">NEW</span></div>
                  <p className="text-xs text-white/65 mt-1">基于馆藏资料回答，并推荐相关展厅</p>
                </div>
                <ChevronRight size={20}/>
              </div>
            </button>

            {/* Changed Grid: 4th Item is now Activities */}
            <div className="grid grid-cols-4 gap-4 transition-page" style={{ animationDelay: '0.2s' }}>
              {[
                { icon: <Compass size={22}/>, label: '展厅巡游', action: () => setActiveHall('hall-1') },
                { icon: <Camera size={22}/>, label: '虚拟展品', action: () => setCurrentRoute(AppRoute.AR) },
                { icon: <Calendar size={22}/>, label: '团队预约', action: () => setCurrentRoute(AppRoute.BOOKING) },
                { icon: <ScrollText size={22}/>, label: '校史活动', action: () => setShowFeatureModal('activities') }
              ].map((item, idx) => (
                <button key={idx} onClick={item.action} className="flex flex-col items-center gap-2">
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
                <span className="text-[11px] font-bold text-jadeBlue/30 uppercase tracking-[0.2em]">3个数字场景</span>
              </div>
              <HallsGrid onHallSelect={(id) => setActiveHall(id)} />
            </div>
          </div>
        )}

        {currentRoute === AppRoute.PANORAMA && (
           /* Fallback to hall-1 if Panorama tab is clicked directly */
           <div className="flex items-center justify-center h-full">
             <button onClick={() => setActiveHall('hall-1')} className="bg-jadeBlue text-white px-6 py-3 rounded-full">进入全景大厅</button>
           </div>
        )}
        
        {currentRoute === AppRoute.AR && <div className="h-full w-full absolute inset-0"><React.Suspense fallback={<FeatureLoading/>}><ARExhibit /></React.Suspense></div>}
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
                 { label: '本机预约', icon: <Calendar size={18}/>, value: `${bookingCount}次` },
                 { label: '可游场景', icon: <Compass size={18}/>, value: '3处' },
                 { label: 'AI讲解反馈', icon: <BookOpen size={18}/>, value: `${getStoredCount('heritage360-ai-feedback')}条` },
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

      {/* 底部导航 */}
      <footer className="absolute bottom-8 inset-x-6 z-50">
        <GlassCard className="py-4 px-8 rounded-[2rem] flex justify-between items-center shadow-[0_20px_40px_-15px_rgba(18,110,130,0.3)] border-white/60">
           <NavItem route={AppRoute.HOME} icon={<Home size={22}/>} label="首页" />
           <NavItem route={AppRoute.PANORAMA} icon={<Compass size={22}/>} label="云游" />
           <div className="relative -top-12 flex flex-col items-center">
             <button 
               aria-label="打开虚拟展品体验"
               onClick={() => setCurrentRoute(AppRoute.AR)}
               className={`w-18 h-18 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transition-all ${
                 currentRoute === AppRoute.AR ? 'bg-jadeBlue text-white scale-110' : 'bg-sxuRed text-white hover:bg-sxuRed/90'
               }`}
               style={{ width: '4.5rem', height: '4.5rem' }}
             >
                <Camera size={32} />
             </button>
             <span className={`text-[11px] font-bold mt-2 font-serif ${currentRoute === AppRoute.AR ? 'text-jadeBlue' : 'text-jadeBlue/60'}`}>展品</span>
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
