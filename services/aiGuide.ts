import { retrieveKnowledge } from '../knowledge';

export interface GuideAnswer {
  answer: string;
  sourceIds: string[];
  suggestedHallId?: 'hall-1' | 'hall-2' | 'hall-3';
  mode: 'deepseek' | 'local';
}

const localAnswer = (question: string): GuideAnswer => {
  const sources = retrieveKnowledge(question);
  return {
    answer: `根据当前馆藏资料：${sources.map((item) => item.content).join('')}你可以继续进入“${sources[0].title}”相关展区查看。`,
    sourceIds: sources.map((item) => item.id),
    suggestedHallId: sources[0].hallId,
    mode: 'local',
  };
};

export const askGuide = async (question: string): Promise<GuideAnswer> => {
  try {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) throw new Error('AI service unavailable');
    const data = await response.json();
    return { ...data, mode: 'deepseek' } as GuideAnswer;
  } catch {
    return localAnswer(question);
  }
};
