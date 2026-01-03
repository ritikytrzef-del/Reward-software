
export interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface EarningBot {
  id: string;
  name: string;
  category: string;
  description: string;
  link: string;
  icon: string;
  rewardRate: string;
  isPremium?: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  name: string;
  link: string;
  icon: string;
  color: string;
}

export interface VideoContent {
  id: string;
  title: string;
  topic: string;
  link: string;
  reward: number;
}

export enum TaskCategory {
  TAP = 'Tap2Earn',
  ADS = 'Watch Ads',
  QUIZ = 'Quiz Earn',
  GAME = 'Game Earn',
  MINING = 'Mining Earn',
  SOCIAL = 'Social Earn',
  ALL = 'All'
}

export interface ActivityData {
  day: string;
  earnings: number;
}

// Fixed missing WithdrawalRecord interface
export interface WithdrawalRecord {
  id: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Rejected';
  date: string;
  method: string;
}

// Fixed missing GlobalPayout interface
export interface GlobalPayout {
  id: string;
  user: string;
  amount: number;
  network: string;
  status: 'Processing' | 'Completed';
  time: string;
}
