export const SCENES = {
  'hall-1': { 
    name: '校史馆入口', 
    // GitHub Raw 直链 - 对应你仓库里的 hall_1.jpg
    image: 'https://raw.githubusercontent.com/btsaboyu-hub/photo/main/hall_1.jpg', 
    hotspots: [{ id: 'to-2', position: [10, -2, -5], target: 'hall-2', label: '前往下一站' }] 
  },
  'hall-2': { 
    name: '序厅中庭', 
    image: 'https://raw.githubusercontent.com/btsaboyu-hub/photo/main/hall_2.jpg', 
    hotspots: [{ id: 'to-3', position: [10, -2, -5], target: 'hall-3', label: '深入展区' }] 
  },
  'hall-3': { 
    name: '序厅后段', 
    image: 'https://raw.githubusercontent.com/btsaboyu-hub/photo/main/hall_3.jpg', 
    hotspots: [{ id: 'to-1', position: [-10, -2, 5], target: 'hall-1', label: '回到起点' }] 
  }
};