import React, { useMemo, useState } from 'react';
import { ArrowRight, Bot, BookOpen, LoaderCircle, Send, ShieldCheck, Sparkles, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { KNOWLEDGE_BASE } from '../knowledge';
import { askGuide, GuideAnswer } from '../services/aiGuide';

interface AIGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToHall: (hallId: string) => void;
}

const SUGGESTED_QUESTIONS = [
  '山西大学的办学历史从什么时候开始？',
  '“中西合璧”体现了怎样的办学理念？',
  '第一次参观应该从哪个展厅开始？',
];

const AIGuide: React.FC<AIGuideProps> = ({ isOpen, onClose, onNavigateToHall }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<GuideAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const sources = useMemo(
    () => KNOWLEDGE_BASE.filter((item) => answer?.sourceIds.includes(item.id)),
    [answer],
  );

  if (!isOpen) return null;

  const submit = async (value = question) => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    setQuestion(trimmed);
    setLoading(true);
    setAnswer(null);
    setFeedback(null);
    const result = await askGuide(trimmed);
    setAnswer(result);
    setLoading(false);
  };

  const recordFeedback = (value: 'up' | 'down') => {
    setFeedback(value);
    const records = JSON.parse(localStorage.getItem('heritage360-ai-feedback') || '[]');
    localStorage.setItem('heritage360-ai-feedback', JSON.stringify([...records, { question, value, createdAt: new Date().toISOString() }]));
  };

  return (
    <div className="fixed inset-0 z-[80] bg-paperWhite/98 backdrop-blur-2xl flex flex-col max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <header className="px-6 pt-12 pb-5 border-b border-jadeBlue/10 bg-white/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-jadeBlue to-[#0b4350] text-white flex items-center justify-center shadow-lg">
              <Bot size={23} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-jadeBlue">AI 校史讲解员</h2>
              <p className="text-[10px] tracking-widest text-jadeBlue/50 font-bold uppercase">Grounded Museum Guide</p>
            </div>
          </div>
          <button aria-label="关闭AI讲解员" onClick={onClose} className="p-2.5 rounded-full bg-jadeBlue/5 text-jadeBlue"><X size={19}/></button>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-jadeBlue/60 bg-jadeBlue/5 px-3 py-2 rounded-xl">
          <ShieldCheck size={14} />
          仅依据馆藏资料回答，并展示参考来源
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-5 pb-36 no-scrollbar">
        {!answer && !loading && (
          <div>
            <div className="py-6 text-center">
              <Sparkles className="mx-auto text-harvestGreen mb-4" size={34}/>
              <h3 className="font-serif text-xl font-bold text-jadeBlue mb-2">想了解哪段山大历史？</h3>
              <p className="text-sm text-inkBlack/50 leading-relaxed">可以询问建校历史、办学理念、重要时期，或让讲解员推荐参观路线。</p>
            </div>
            <div className="space-y-3">
              {SUGGESTED_QUESTIONS.map((item) => (
                <button key={item} onClick={() => submit(item)} className="w-full text-left p-4 rounded-2xl bg-white border border-jadeBlue/10 text-sm text-jadeBlue font-serif shadow-sm flex justify-between items-center gap-4">
                  {item}<ArrowRight size={15} className="shrink-0 text-sxuRed"/>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="h-full min-h-64 flex flex-col items-center justify-center text-jadeBlue">
            <LoaderCircle className="animate-spin mb-4" size={34}/>
            <p className="font-serif font-bold">正在检索馆藏资料...</p>
            <p className="text-xs text-jadeBlue/40 mt-2">生成回答并核对来源</p>
          </div>
        )}

        {answer && !loading && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3">
            <div className="text-xs text-jadeBlue/50 font-bold">你的问题</div>
            <div className="p-4 rounded-2xl rounded-tr-sm bg-jadeBlue text-white font-serif leading-relaxed">{question}</div>
            <div className="flex items-center gap-2 text-xs font-bold text-jadeBlue">
              <Bot size={16}/> AI讲解
              <span className="ml-auto px-2 py-1 rounded-full bg-harvestGreen/10 text-harvestGreen text-[10px]">
                {answer.mode === 'deepseek' ? 'DeepSeek 已连接' : '资料检索模式'}
              </span>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-jadeBlue/10 shadow-sm text-[15px] leading-7 text-inkBlack/75 font-serif">
              {answer.answer}
            </div>

            {sources.length > 0 && (
              <div>
                <h4 className="text-xs text-jadeBlue/50 font-bold mb-3 flex items-center gap-2"><BookOpen size={14}/> 参考馆藏资料</h4>
                <div className="space-y-2">
                  {sources.map((source) => (
                    <div key={source.id} className="p-3 rounded-2xl bg-jadeBlue/5 border border-jadeBlue/5">
                      <div className="flex justify-between gap-3 text-sm font-serif font-bold text-jadeBlue"><span>{source.title}</span><span className="text-[10px] opacity-50">{source.period}</span></div>
                      <p className="text-[11px] text-inkBlack/45 mt-1">{source.source}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <button aria-label="回答有帮助" onClick={() => recordFeedback('up')} className={`p-2.5 rounded-full ${feedback === 'up' ? 'bg-jadeBlue text-white' : 'bg-jadeBlue/5 text-jadeBlue'}`}><ThumbsUp size={16}/></button>
                <button aria-label="回答需改进" onClick={() => recordFeedback('down')} className={`p-2.5 rounded-full ${feedback === 'down' ? 'bg-sxuRed text-white' : 'bg-jadeBlue/5 text-jadeBlue'}`}><ThumbsDown size={16}/></button>
              </div>
              {answer.suggestedHallId && (
                <button onClick={() => onNavigateToHall(answer.suggestedHallId!)} className="px-4 py-2.5 rounded-full bg-sxuRed text-white text-xs font-bold flex items-center gap-2 shadow-lg">
                  前往相关展厅 <ArrowRight size={14}/>
                </button>
              )}
            </div>
            <button onClick={() => { setAnswer(null); setQuestion(''); }} className="w-full py-3 text-sm font-bold text-jadeBlue/60">继续提问</button>
          </div>
        )}
      </main>

      <div className="absolute bottom-0 inset-x-0 p-5 pb-8 bg-white/90 backdrop-blur-xl border-t border-jadeBlue/10">
        <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex gap-2">
          <input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={120} placeholder="输入你的校史问题..." aria-label="向AI讲解员提问" className="flex-1 min-w-0 bg-paperWhite border border-jadeBlue/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jadeBlue/20"/>
          <button aria-label="发送问题" disabled={!question.trim() || loading} className="w-12 rounded-2xl bg-jadeBlue text-white flex items-center justify-center disabled:opacity-30"><Send size={18}/></button>
        </form>
      </div>
    </div>
  );
};

export default AIGuide;
