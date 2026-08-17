export interface KnowledgeEntry {
  id: string;
  title: string;
  period: string;
  content: string;
  source: string;
  hallId: 'hall-1' | 'hall-2' | 'hall-3';
  keywords: string[];
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: 'kb-1902',
    title: '山西大学堂创立',
    period: '1902年',
    content: '山西大学的办学历史可追溯至1902年创办的山西大学堂，是中国近代高等教育早期实践的重要组成部分。',
    source: '校史馆·序厅「百年基石」资料卡',
    hallId: 'hall-1',
    keywords: ['创立', '建校', '1902', '山西大学堂', '历史', '起源'],
  },
  {
    id: 'kb-mission',
    title: '中西合璧的办学探索',
    period: '建校初期',
    content: '建校初期的办学实践重视中国传统学问与近代西方学科的结合，体现了探索现代大学制度的开放视野。',
    source: '校史馆·序厅「中西合璧」资料卡',
    hallId: 'hall-1',
    keywords: ['中西合璧', '办学理念', '西学', '传统', '开放'],
  },
  {
    id: 'kb-western',
    title: '西学专斋',
    period: '20世纪初',
    content: '西学专斋承担外语与近代学科教育，是早期山西大学堂吸收现代教育内容的重要载体。',
    source: '校史馆·溯源单元「西学专斋」资料卡',
    hallId: 'hall-2',
    keywords: ['西学专斋', '外语', '近代学科', '教育', '课程'],
  },
  {
    id: 'kb-spirit',
    title: '求真至善的精神追求',
    period: '百年传承',
    content: '求真强调尊重知识与事实，至善强调责任与价值追求；二者共同构成校史叙事中的精神线索。',
    source: '校史馆·精神文化资料卡',
    hallId: 'hall-1',
    keywords: ['求真至善', '校训', '精神', '价值', '责任'],
  },
  {
    id: 'kb-war',
    title: '战火中的弦歌不辍',
    period: '1937—1949年',
    content: '在民族危难时期，学校师生在艰苦环境中延续教学与学术活动，形成了弦歌不辍、教育报国的集体记忆。',
    source: '校史馆·峥嵘单元资料卡',
    hallId: 'hall-2',
    keywords: ['抗战', '1937', '1949', '弦歌不辍', '报国', '迁徙'],
  },
  {
    id: 'kb-rebuild',
    title: '新中国成立后的建设',
    period: '1949年以后',
    content: '新中国成立后，学校围绕人才培养、学科建设与科研工作持续发展，并在不同历史阶段调整办学布局。',
    source: '校史馆·华章单元资料卡',
    hallId: 'hall-3',
    keywords: ['新中国', '1949', '学科', '建设', '科研', '人才培养'],
  },
  {
    id: 'kb-campus',
    title: '校园建筑与集体记忆',
    period: '历史沿革',
    content: '校舍、牌匾、碑刻与影像不仅记录空间变化，也承载不同代际师生的学习经历和共同记忆。',
    source: '校史馆·校园记忆资料卡',
    hallId: 'hall-3',
    keywords: ['建筑', '校舍', '碑刻', '影像', '记忆', '校园'],
  },
  {
    id: 'kb-visit',
    title: '参观建议',
    period: '数字导览',
    content: '首次参观可从序厅了解时间主线，再进入溯源单元和华章单元；线上导览支持三个场景间切换。',
    source: 'Heritage360数字导览说明',
    hallId: 'hall-1',
    keywords: ['参观', '路线', '先看', '导览', '展厅', '推荐'],
  },
];

const normalize = (value: string) => value.toLowerCase().replace(/[，。！？、\s]/g, '');

export const retrieveKnowledge = (question: string, limit = 3): KnowledgeEntry[] => {
  const normalizedQuestion = normalize(question);
  const scored = KNOWLEDGE_BASE.map((entry) => {
    const fields = [entry.title, entry.period, entry.content, ...entry.keywords].map(normalize);
    const score = fields.reduce((total, field) => {
      if (normalizedQuestion.includes(field) || field.includes(normalizedQuestion)) return total + 5;
      return total + entry.keywords.filter((keyword) => normalizedQuestion.includes(normalize(keyword))).length * 2;
    }, 0);
    return { entry, score };
  }).sort((a, b) => b.score - a.score);

  const relevant = scored.filter((item) => item.score > 0).slice(0, limit).map((item) => item.entry);
  return relevant.length > 0 ? relevant : [KNOWLEDGE_BASE[0], KNOWLEDGE_BASE[7]];
};
