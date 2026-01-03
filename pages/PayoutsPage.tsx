
import React, { useRef } from 'react';
import { GlobalPayout } from '../types';

interface PayoutsPageProps {
  payouts: GlobalPayout[];
  totalProcessed: number;
}

const PayoutsPage: React.FC<PayoutsPageProps> = ({ payouts, totalProcessed }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight">Withdrawal Leaderboard</h2>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <p className="text-green-600 text-[10px] font-black uppercase tracking-[0.2em]">Live Processing Active</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Total Daily Volume</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black">{totalProcessed.toLocaleString()}</h3>
            <span className="text-sm font-bold opacity-70">TXNS</span>
          </div>
          <div className="mt-2 flex gap-3">
             <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-wider">
               USDT BEP20: ACTIVE
             </div>
             <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-wider">
               USDT TON: ACTIVE
             </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Payout Feed</h4>
          <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase animate-pulse">Scanning Blocks...</span>
        </div>

        <div className="space-y-3" ref={scrollContainerRef}>
          {payouts.map((p) => (
            <div 
              key={p.id}
              className={`bg-white p-5 rounded-[2rem] border transition-all duration-700 flex items-center justify-between shadow-sm ${
                p.status === 'Processing' 
                  ? 'border-blue-200 ring-2 ring-blue-50 scale-[1.02] bg-blue-50/20' 
                  : 'border-gray-100 opacity-90'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black border-2 ${
                  p.network.includes('BEP20') 
                    ? 'bg-yellow-50 text-yellow-600 border-yellow-100 shadow-[0_4px_10px_rgba(234,179,8,0.1)]' 
                    : 'bg-blue-50 text-blue-600 border-blue-100 shadow-[0_4px_10px_rgba(59,130,246,0.1)]'
                }`}>
                  {p.network.includes('BEP20') ? 'B20' : 'TON'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-black text-gray-900 leading-none">@{p.user}</p>
                    {p.status === 'Processing' && (
                       <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping"></span>
                    )}
                  </div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mt-1">{p.network} NETWORK</p>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end gap-1">
                <p className={`text-sm font-black tracking-tight ${p.status === 'Processing' ? 'text-blue-500' : 'text-green-600'}`}>
                  +${p.amount.toFixed(2)}
                </p>
                <div className="flex items-center gap-1.5">
                   <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase ${
                     p.status === 'Processing' ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-green-100 text-green-600'
                   }`}>
                     {p.status}
                   </span>
                   <span className="text-[7px] font-black text-gray-300 uppercase">{p.time}</span>
                </div>
              </div>
            </div>
          ))}
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

export default PayoutsPage;
