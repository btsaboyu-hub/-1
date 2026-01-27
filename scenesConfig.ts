export const SCENES = {
  'hall-1': { 
    name: '校史馆入口', 
    // 使用 GitHub 直链资源
    image: 'https://raw.githubusercontent.com/btsaboyu-hub/photo/refs/heads/main/hall_1.jpg', 
    hotspots: [{ id: 'to-2', position: [10, -2, -5], target: 'hall-2', label: '前往下一站' }] 
  },
  'hall-2': { 
    name: '中厅展区', 
    image: 'https://raw.githubusercontent.com/btsaboyu-hub/photo/refs/heads/main/hall_2.jpg', 
    hotspots: [{ id: 'to-3', position: [10, -2, -5], target: 'hall-3', label: '深入展区' }] 
  },
  'hall-3': { 
    name: '内厅珍藏', 
    image: 'https://raw.githubusercontent.com/btsaboyu-hub/photo/refs/heads/main/hall_3.jpg', 
    hotspots: [{ id: 'to-1', position: [-10, -2, 5], target: 'hall-1', label: '回到起点' }] 
  }
};