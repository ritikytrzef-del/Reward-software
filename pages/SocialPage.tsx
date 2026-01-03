
import React, { useEffect, useState } from 'react';
import { fetchSocials } from '../services/api';
import { SocialLink } from '../types';
import { telegram } from '../services/telegram';

const SocialPage: React.FC = () => {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocials().then((data) => {
      setSocials(data);
      setLoading(false);
    });
  }, []);

  const handleOpenLink = (link: string) => {
    telegram.hapticFeedback('heavy');
    if (link.includes('t.me/') || link.startsWith('tg://')) {
      telegram.openTelegramLink(link);
    } else {
      telegram.openLink(link);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">Community Hub</h2>
        <p className="text-gray-500 text-sm font-bold">Stay connected with Reward Software</p>
      </div>

      {/* Hero Community Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
            Official Group
          </div>
          <h3 className="text-2xl font-black leading-tight uppercase">Join 50K+ <br/>Members Today</h3>
          <p className="text-xs opacity-80 font-medium leading-relaxed max-w-[200px]">Get real-time updates, payout proofs, and exclusive bonus codes.</p>
          <button 
            onClick={() => handleOpenLink('https://t.me/RewardSoftware')}
            className="bg-white text-blue-700 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-lg active:scale-95 transition-all"
          >
            Open Community
          </button>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 opacity-20 transform translate-x-4 translate-y-4 scale-150">
           <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.39l-2.01 9.48c-.15.67-.55.83-1.11.51l-3.07-2.26-1.48 1.42c-.16.16-.3.3-.61.3l.22-3.13 5.7-5.15c.25-.22-.05-.34-.38-.12l-7.04 4.43-3.03-.95c-.66-.21-.67-.66.14-.97l11.83-4.56c.55-.2 1.03.14.83.95z"/></svg>
        </div>
      </div>

      {/* Social Links List */}
      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Official Channels</h4>
        <div className="grid gap-3">
          {loading ? (
             <div className="text-center py-10">
               <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
             </div>
          ) : (
            socials.map((social) => (
              <button
                key={social.id}
                onClick={() => handleOpenLink(social.link)}
                className="flex items-center gap-4 bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm transition-all active:scale-[0.98] group hover:border-blue-100"
              >
                <div className={`w-14 h-14 ${social.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-105 transition-transform overflow-hidden`}>
                   {social.icon.startsWith('http') ? (
                     <img src={social.icon} className="w-full h-full object-contain p-3" alt={social.name} />
                   ) : (
                     social.icon
                   )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{social.platform}</p>
                  <p className="text-[14px] font-black text-gray-900 uppercase tracking-tight">{social.name}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl">💬</div>
           <h4 className="font-black text-gray-900 uppercase tracking-tight">Need Assistance?</h4>
        </div>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">Our support team is active 24/7 to resolve your withdrawal or task issues.</p>
        <button 
          onClick={() => handleOpenLink('https://t.me/RewardSoftwareSupport')}
          className="w-full bg-gray-900 py-4 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-gray-100 active:scale-95 transition-all"
        >
          Contact Support
        </button>
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

export default SocialPage;
