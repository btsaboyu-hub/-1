
import { Hotspot, ExhibitionHall, BookingSlot, MuseumEvent } from './types';

export const HOTSPOTS: Record<string, Hotspot[]> = {
  '1F': [
    {
      id: 'h1',
      position: { x: 400, y: 100, z: -300 },
      title: '序厅 · 百年基石',
      description: '展示山西大学堂成立之初的珍贵石刻与校训墙，是进入校史馆的第一站。',
      images: ['https://images.unsplash.com/photo-1590483734724-38fa19744990?q=80&w=1000&auto=format&fit=crop']
    },
    {
      id: 'h2',
      position: { x: -450, y: -50, z: 100 },
      title: '西学专斋模拟场景',
      description: '通过数字孪生技术还原清末民初山西大学堂西学专斋的教学场景。',
      images: ['https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1000&auto=format&fit=crop']
    }
  ],
  '2F': [
    {
      id: 'h3',
      position: { x: 200, y: 50, z: 400 },
      title: '华章厅 · 成果展',
      description: '二层核心展区，集中展示建国以来学校在重大科研项目上的辉煌成就。',
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop']
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
  },
  {
    id: 'hall4',
    title: '成果厅',
    subtitle: '2002 - 至今',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    description: '步入双一流建设新时代，展示近年来的重大科研突破与育人成果。',
    stats: '科技实物: 89件'
  }
];

export const TIME_SLOTS: BookingSlot[] = [
  { time: '上午 09:00 - 11:30', available: 8, total: 50 },
  { time: '下午 14:00 - 17:00', available: 15, total: 50 }
];

export const EVENTS: MuseumEvent[] = [
  {
    id: 'e1',
    title: '校史专题讲座：从山西大学堂到现代大学',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    date: '2024-05-20',
    category: '学术讲座',
    price: '免费预约'
  },
  {
    id: 'e2',
    title: '建校122周年珍贵文献特展',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop',
    date: '2024-06-01',
    category: '临时特展',
    price: '持证入场'
  }
];

export const NOTIFICATIONS = [
  { id: 1, type: '预约', title: '预约成功提醒', content: '您预约的2024-05-20 上午场次已审核通过。', time: '10分钟前' },
  { id: 2, type: '活动', title: '新活动上线', content: '《百年校史珍品展》即将开启，欢迎点击详情预约。', time: '2小时前' },
  { id: 3, type: '官方', title: '闭馆公告', content: '校史馆将于下周一进行例行设备维护，届时闭馆一天。', time: '昨天' }
];

export const SEARCH_SUGGESTIONS = [
  { category: '展厅', items: ['溯源厅', '峥嵘厅', '华章厅', '成果厅'] },
  { category: '展品', items: ['西学专斋碑刻', '1902年开学典礼影像', '校友捐赠奖章'] },
  { category: '活动', items: ['校史讲座', '志愿者招募', '文献特展'] }
];
