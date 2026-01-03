
import React, { useEffect, useState } from 'react';
import { telegram } from '../services/telegram';
import { fetchEarningBots, fetchSocials, fetchAppLogo } from '../services/api';
import { EarningBot, TaskCategory, SocialLink } from '../types';

interface HomeProps {
  onAdminClick: () => void;
}

const ADMIN_ID = 6601027952;

const Home: React.FC<HomeProps> = ({ onAdminClick }) => {
  const [user] = useState(() => telegram.getUser());
  const [bots, setBots] = useState<EarningBot[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [logo, setLogo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>(TaskCategory.ALL);

  const isAdmin = user?.id === ADMIN_ID;

  useEffect(() => {
    fetchEarningBots().then(setBots);
    fetchSocials().then(setSocials);
    fetchAppLogo().then(setLogo);
  }, []);

  const handleOpenLink = (link: string) => {
    telegram.hapticFeedback('heavy');
    if (link.includes('t.me/') || link.startsWith('tg://')) {
      telegram.openTelegramLink(link);
    } else {
      telegram.openLink(link);
    }
  };

  const filteredBots = bots.filter(bot => 
    selectedCategory === TaskCategory.ALL || bot.category === selectedCategory
  );

  const categories = [
    TaskCategory.ALL,
    ...Object.values(TaskCategory).filter(cat => cat !== TaskCategory.ALL)
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
              <img 
                src={user?.photo_url || `https://ui-avatars.com/api/?name=${user?.first_name}`} 
                className="w-12 h-12 rounded-full border-2 border-blue-100 object-cover shadow-sm" 
                alt="avatar" 
              />
              {logo && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-gray-50 flex items-center justify-center p-1 shadow-sm">
                      <img src={logo} className="w-full h-full object-contain" alt="App Logo" />
                  </div>
              )}
          </div>
          <div 
            onClick={isAdmin ? onAdminClick : undefined} 
            className={isAdmin ? "cursor-pointer active:scale-95 transition-transform" : ""}
          >
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-tight">{user?.first_name}</h1>
              {isAdmin && (
                <span className="text-blue-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zM10 13a1 1 0 100-2 1 1 0 000 2zm1-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest">
              {isAdmin ? "Master Admin Console" : "Official Partner Hub"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-black text-[9px] uppercase tracking-widest animate-pulse">
                FaucetPay Ready
            </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-gray-900 text-[11px] uppercase tracking-[0.2em] text-purple-700">Join our Community</h3>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Official Links</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar">
          {socials.map((social) => (
            <button
              key={social.id}
              onClick={() => handleOpenLink(social.link)}
              className="flex items-center gap-3 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:border-blue-100 active:scale-95 shrink-0 min-w-[160px] relative overflow-hidden group"
            >
              <div className={`w-12 h-12 ${social.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transition-transform group-hover:scale-110 overflow-hidden`}>
                {social.icon.startsWith('http') ? (
                  <img src={social.icon} className="w-full h-full object-contain p-2.5" alt={social.name} />
                ) : (
                  social.icon
                )}
              </div>
              <div className="text-left pr-2 relative z-10">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-tight">{social.platform}</p>
                <p className="text-[12px] font-black text-gray-900 uppercase tracking-tight whitespace-nowrap">{social.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Intro Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-6 text-white shadow-xl shadow-blue-100 overflow-hidden relative">
          <div className="relative z-10">
              <h2 className="text-xl font-black uppercase leading-tight">Bot Hub Center</h2>
              <p className="text-sm opacity-90 mt-1 font-bold">All partner bots listed below support instant withdrawals to <span className="font-black text-white underline underline-offset-2">FaucetPay USDT</span>.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="font-black text-gray-900 text-[11px] uppercase tracking-[0.2em] px-1 text-blue-700">Browse Earning Models</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                telegram.hapticFeedback('light');
              }}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                selectedCategory === cat
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'bg-white border-gray-100 text-gray-500 hover:border-blue-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bots List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">
            {selectedCategory === TaskCategory.ALL ? 'Verified Bots' : `${selectedCategory}`}
          </h3>
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
            {filteredBots.length} Active
          </span>
        </div>
        
        <div className="flex flex-col gap-5">
          {filteredBots.length > 0 ? (
            filteredBots.map(bot => (
              <div 
                key={bot.id} 
                onClick={() => handleOpenLink(bot.link)}
                className={`group p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm space-y-5 transition-all hover:border-blue-200 active:scale-[0.98] cursor-pointer relative overflow-hidden ${bot.isPremium ? 'ring-2 ring-purple-100' : ''}`}
              >
                {bot.isPremium && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[9px] font-black uppercase px-5 py-2 rounded-bl-3xl shadow-lg">
                      Recommended
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="text-4xl bg-blue-50 w-20 h-20 rounded-[1.8rem] flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-100 transition-colors shadow-inner overflow-hidden">
                    {bot.icon.startsWith('http') ? (
                        <img src={bot.icon} className="w-full h-full object-contain p-3" alt={bot.name} />
                    ) : (
                        bot.icon
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-gray-900 truncate text-lg uppercase tracking-tight">{bot.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md uppercase tracking-widest">
                        {bot.category}
                      </span>
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                         <span className="text-[9px] font-black text-green-700 uppercase">FaucetPay USDT</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 font-bold leading-relaxed px-1">
                  {bot.description}
                </p>
                
                <div className="pt-2">
                  <div 
                    className="w-full h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-[0_10px_25px_-5px_rgba(59,130,246,0.4)] flex items-center justify-center gap-3 transition-all group-hover:from-blue-500 group-hover:to-blue-700 active:scale-[0.97]"
                  >
                    <span className="text-white text-base font-black uppercase tracking-[0.1em] pointer-events-none">
                      START EARN
                    </span>
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm pointer-events-none">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
              <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No bots in this category</p>
            </div>
          )}
        </div>
      </div>

      <footer className="flex justify-center pt-8 pb-12">
        <div className="px-10 py-5 rounded-[2.5rem] bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-50 transform transition-all active:scale-95">
          <p className="text-[16px] font-black uppercase tracking-[0.15em] text-center flex flex-wrap justify-center gap-x-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-600 to-black">
              Powered by
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 via-purple-500 to-indigo-600">
              Reward Software
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
