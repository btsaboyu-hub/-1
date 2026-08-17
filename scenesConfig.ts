export const SCENES = {
  'hall-1': { 
    name: '校史馆入口', 
    image: '/assets/panos/hall_1.jpg',
    hotspots: [{ id: 'to-2', position: [10, -2, -5], target: 'hall-2', label: '前往下一站' }] 
  },
  'hall-2': { 
    name: '序厅中庭', 
    image: '/assets/panos/hall_2.jpg',
    hotspots: [{ id: 'to-3', position: [10, -2, -5], target: 'hall-3', label: '深入展区' }] 
  },
  'hall-3': { 
    name: '序厅后段', 
    image: '/assets/panos/hall_3.jpg',
    hotspots: [{ id: 'to-1', position: [-10, -2, 5], target: 'hall-1', label: '回到起点' }] 
  }
};
