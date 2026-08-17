
export interface Hotspot {
  id: string;
  position: { x: number; y: number; z: number };
  title: string;
  description: string;
  images: string[];
  audioUrl?: string;
  type: 'info' | 'portal';
  targetScene?: string;
}

export interface Scene {
  id: string;
  title: string;
  thumbnail: string;
  texture: string;
  description: string;
  hotspots: Hotspot[];
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

/* --- New Added Types --- */

export type ActivityStatus = 'digital' | 'concept' | 'archive';

export interface MuseumActivity {
  id: string;
  title: string;
  date: string;
  status: ActivityStatus;
  description: string;
  locationLabel: string;
  linkedHallId?: string; // If present, clicking navigates to this Panorama scene
}

export enum AppRoute {
  HOME = 'home',
  PANORAMA = 'panorama',
  AR = 'ar',
  BOOKING = 'booking',
  PROFILE = 'profile'
}
