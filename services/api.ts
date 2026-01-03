
import { ActivityData, EarningBot, VideoContent, SocialLink, WithdrawalRecord } from '../types';

let appLogo: string = 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/gem.svg';

let mockBots: EarningBot[] = [
  {
    id: '1',
    name: 'Reward Pro Bot',
    category: 'Mining Earn',
    description: 'Official Reward Software high-yield bot. Features instant FaucetPay USDT withdrawals.',
    link: 'https://t.me/RewardProBot',
    icon: '🤖',
    rewardRate: 'High',
    isPremium: true
  },
  {
    id: '2',
    name: 'CryptoTap App',
    category: 'Tap2Earn',
    description: 'Tap and earn crypto instantly. Supports FaucetPay to USDT payments.',
    link: 'https://t.me/CryptoTapBot',
    icon: '💎',
    rewardRate: 'Medium'
  }
];

let mockVideos: VideoContent[] = [
  {
    id: 'guide-1',
    title: 'OFFICIAL: How to Start Earning with Reward Software',
    topic: 'Official Guide',
    link: 'https://www.youtube.com/@RewardSoftware', 
    reward: 0
  },
  {
    id: 'guide-2',
    title: 'WITHDRAWAL GUIDE: How to withdraw to FaucetPay USDT',
    topic: 'Official Tutorial',
    link: 'https://www.youtube.com/@RewardSoftware', 
    reward: 0
  }
];

let mockSocials: SocialLink[] = [
  {
    id: 's1',
    platform: 'Telegram',
    name: 'Official Channel',
    link: 'https://t.me/RewardSoftware',
    icon: '✈️',
    color: 'bg-[#24A1DE]'
  },
  {
    id: 's2',
    platform: 'YouTube',
    name: 'Official YouTube',
    link: 'https://youtube.com/@RewardSoftware',
    icon: '📺',
    color: 'bg-[#FF0000]'
  }
];

let mockWithdrawalHistory: WithdrawalRecord[] = [
  { id: '1', amount: 5.00, status: 'Completed', date: '2023-10-25', method: 'Litecoin (LTC)' },
  { id: '2', amount: 1.50, status: 'Pending', date: '2023-10-27', method: 'Tether (USDT)' },
];

export const fetchEarningBots = async (): Promise<EarningBot[]> => {
  return [...mockBots];
};

export const fetchSocials = async (): Promise<SocialLink[]> => {
  return [...mockSocials];
};

export const addSocialLink = async (social: Omit<SocialLink, 'id'>) => {
  const newSocial = { ...social, id: Math.random().toString(36).substr(2, 9) };
  mockSocials.push(newSocial);
  return newSocial;
};

export const deleteSocialLink = async (id: string) => {
  mockSocials = mockSocials.filter(s => s.id !== id);
};

export const fetchAppLogo = async () => {
    return appLogo;
};

export const updateAppLogo = async (url: string) => {
    appLogo = url;
    return appLogo;
};

export const addEarningBot = async (bot: Omit<EarningBot, 'id'>) => {
  const newBot = { ...bot, id: Math.random().toString(36).substr(2, 9) };
  mockBots.push(newBot);
  return newBot;
};

export const deleteEarningBot = async (id: string) => {
  mockBots = mockBots.filter(b => b.id !== id);
};

export const fetchVideos = async (): Promise<VideoContent[]> => {
  return [...mockVideos];
};

export const addVideo = async (video: Omit<VideoContent, 'id'>) => {
  const newVideo = { ...video, id: Math.random().toString(36).substr(2, 9) };
  mockVideos.push(newVideo);
  return newVideo;
};

export const deleteVideo = async (id: string) => {
  mockVideos = mockVideos.filter(v => v.id !== id);
};

export const fetchActivityData = async (): Promise<ActivityData[]> => {
  return [
    { day: 'Mon', earnings: 120 },
    { day: 'Tue', earnings: 180 },
    { day: 'Wed', earnings: 155 },
    { day: 'Thu', earnings: 250 },
    { day: 'Fri', earnings: 220 },
    { day: 'Sat', earnings: 305 },
    { day: 'Sun', earnings: 280 },
  ];
};

export const fetchWithdrawalHistory = async (): Promise<WithdrawalRecord[]> => {
  return [...mockWithdrawalHistory];
};

export const requestWithdrawal = async (amount: number, method: string) => {
  await new Promise(r => setTimeout(r, 1500));
  const newRecord: WithdrawalRecord = {
    id: Math.random().toString(36).substr(2, 9),
    amount,
    status: 'Pending',
    date: new Date().toLocaleDateString(),
    method
  };
  mockWithdrawalHistory.unshift(newRecord);
  return newRecord;
};
