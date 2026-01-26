
export interface Hotspot {
  id: string;
  position: { x: number; y: number; z: number };
  title: string;
  description: string;
  images: string[];
}

export interface ExhibitionHall {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  stats: string;
}

export interface BookingSlot {
  time: string;
  available: number;
  total: number;
}

export interface MuseumEvent {
  id: string;
  title: string;
  image: string;
  date: string;
  category: string;
  price: string;
}

export enum AppRoute {
  HOME = 'home',
  PANORAMA = 'panorama',
  AR = 'ar',
  BOOKING = 'booking',
  PROFILE = 'profile'
}
