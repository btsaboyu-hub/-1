
import { Scene, ExhibitionHall, BookingSlot, MuseumEvent, MuseumActivity } from './types';

export const MUSEUM_SCENES: Record<string, Scene[]> = {
  '1F': [
    {
      id: 'intro_hall',
      title: '序厅 · 百年基石',
      thumbnail: 'https://images.unsplash.com/photo-1590483734724-38fa19744990?q=80&w=200&auto=format&fit=crop',
      texture: 'https://images.unsplash.com/photo-1590483734724-38fa19744990?q=80&w=2000&auto=format&fit=crop',
      description: '山西大学序厅，展示学校从1902年山西大学堂创立至今的辉煌历程。正中为“百年基石”大型浮雕。',
      hotspots: [
        {
          id: 'h1',
          position: { x: 450, y: 30, z: -150 },
          title: '山西大学堂圣旨碑',
          description: '清光绪二十八年（1902年）设立山西大学堂的奏折批复副本，标志着中国近代高等教育的重要开端。',
          images: ['https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1000&auto=format&fit=crop'],
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          type: 'info'
        },
        {
          id: 'h2',
          position: { x: -480, y: -20, z: 80 },
          title: '中西合璧：百年校训',
          description: '“中西合璧，求真至善”——由创办人岑春煊、李提摩太共同确立，体现了早期山大的国际化视野。',
          images: ['https://images.unsplash.com/photo-1577727103501-ad5712e52f52?q=80&w=1000&auto=format&fit=crop'],
          type: 'info'
        },
        {
          id: 'to_history',
          position: { x: 0, y: -40, z: -480 },
          title: '前往 · 溯源厅',
          description: '进入第一单元：1902-1937 溯源时期，探索早期校舍模型与文献。',
          images: [],
          type: 'portal',
          targetScene: 'history_hall'
        }
      ]
    },
    {
      id: 'history_hall',
      title: '一单元 · 溯源厅',
      thumbnail: 'https://images.unsplash.com/photo-1577727103501-ad5712e52f52?q=80&w=200&auto=format&fit=crop',
      texture: 'https://images.unsplash.com/photo-1577727103501-ad5712e52f52?q=80&w=2000&auto=format&fit=crop',
      description: '追溯山西大学堂创立初期的筚路蓝缕，展示“中西合璧”的办学理念。',
      hotspots: [
        {
          id: 'h3',
          position: { x: 300, y: 0, z: -400 },
          title: '西学专斋旧影',
          description: '复原了1902年西学专斋的教学场景，展示了早期的物理与化学实验器材。',
          images: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop'],
          type: 'info'
        }
      ]
    }
  ],
  '2F': [
    {
      id: 'result_hall',
      title: '二层 · 成果厅',
      thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=200&auto=format&fit=crop',
      texture: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop',
      description: '展现新时代背景下的教学与科研盛果，包括两院院士墙与国家重点实验室沙盘。',
      hotspots: []
    }
  ]
};

export const HALLS: ExhibitionHall[] = [
  {
    id: 'hall1',
    title: '溯源厅',
    subtitle: '1902 - 1937',
    image: 'https://images.unsplash.com/photo-1577727103501-ad5712e52f52?q=80&w=800&auto=format&fit=crop',
    description: '追溯山西大学堂创立之初的筚路蓝缕，展示“中西合璧”的办学理念。',
    stats: '陈列文物: 128件'
  },
  {
    id: 'hall2',
    title: '峥嵘厅',
    subtitle: '1937 - 1949',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop',
    description: '记录战争年代山大师生投笔从戎、弦歌不辍的壮阔史诗。',
    stats: '多媒体交互: 12组'
  },
  {
    id: 'hall3',
    title: '华章厅',
    subtitle: '1949 - 2002',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
    description: '展现新中国成立后，山西大学在全国学科调整中的贡献与繁荣。',
    stats: '珍贵影像: 45段'
  }
];

export const TIME_SLOTS: BookingSlot[] = [
  { time: '上午 09:00 - 11:30', available: 8, total: 50 },
  { time: '下午 14:00 - 17:00', available: 15, total: 50 }
];

export const EVENTS: MuseumEvent[] = [
  {
    id: 'e1',
    title: '百年校史珍品展',
    image: 'https://images.unsplash.com/photo-1554941068-a252680d25d9?q=80&w=800&auto=format&fit=crop',
    date: '常设数字展览',
    category: '特展',
    price: '免费预约'
  },
  {
    id: 'e2',
    title: '西学专斋专题讲座',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    date: '排期以馆方公告为准',
    category: '讲座',
    price: '活动信息示意'
  },
  {
    id: 'e3',
    title: '校园古建影像征集',
    image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=800&auto=format&fit=crop',
    date: '活动信息示意',
    category: '竞赛',
    price: '以馆方公告为准'
  }
];

export const NOTIFICATIONS = [
  { id: 1, type: '预约', title: '体验预约说明', content: '当前版本为数字产品原型，预约记录仅保存在本机。', time: '刚刚' },
  { id: 2, type: '活动', title: 'AI校史讲解员上线', content: '现在可以基于馆藏资料提问，并跳转至相关数字展厅。', time: '刚刚' }
];

export const SEARCH_SUGGESTIONS = [
  { category: '展厅', items: ['序厅', '溯源厅', '峥嵘厅', '成果厅'] },
  { category: '展品', items: ['圣旨碑', '西学专斋', '百年校歌'] }
];

// --- New Data ---

export const ACTIVITIES: MuseumActivity[] = [
  {
    id: 'a1',
    title: '“晋商与山大”特展',
    date: '数字展览',
    status: 'digital',
    description: '探索晋商文化如何资助并影响山西大学堂的早期建设，展出珍贵账本与书信。',
    locationLabel: '中厅展区',
    linkedHallId: 'hall-2'
  },
  {
    id: 'a2',
    title: '夜游校史馆：光影概念方案',
    date: '产品概念',
    status: 'concept',
    description: '以数字光影和全景游览重现西学专斋旧景的产品概念。',
    locationLabel: '校史馆入口',
    linkedHallId: 'hall-1'
  },
  {
    id: 'a3',
    title: '1977届校友返校纪念活动',
    date: '校史回顾',
    status: 'archive',
    description: '恢复高考后的第一届学子重返母校，捐赠当年课堂笔记与生活用品。',
    locationLabel: '内厅珍藏',
    linkedHallId: 'hall-3'
  }
];
