
import React, { useState, useEffect, useCallback } from 'react';
import { TaskCategory } from '../types';
import { telegram } from '../services/telegram';

interface TaskPageProps {
  category: TaskCategory;
  onBack: () => void;
  updateBalance: (amt: number) => void;
}

const TaskPage: React.FC<TaskPageProps> = ({ category, onBack, updateBalance }) => {
  const [loading, setLoading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [miningRate, setMiningRate] = useState(0);
  const [message, setMessage] = useState('');

  // Mining logic
  useEffect(() => {
    if (category === TaskCategory.MINING) {
      const interval = setInterval(() => {
        const reward = 0.005;
        setMiningRate(prev => prev + reward);
        updateBalance(reward);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [category, updateBalance]);

  // Anti-tap protection & logic
  const handleTap = useCallback(() => {
    if (energy <= 0) {
      setMessage("Out of energy! Wait a bit.");
      return;
    }
    setTapCount(prev => prev + 1);
    setEnergy(prev => Math.max(0, prev - 2));
    telegram.hapticFeedback('light');
    updateBalance(0.01);
  }, [energy, updateBalance]);

  const handleWatchAd = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateBalance(2.50);
      telegram.showAlert("Ad watched successfully! $2.50 added to balance.");
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-center pb-10">
      <div className="flex items-center">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="flex-1 text-lg font-black uppercase tracking-widest">{category}</h2>
      </div>

      {category === TaskCategory.TAP && (
        <div className="space-y-12">
          <div className="relative inline-block mt-8">
            <button 
              onClick={handleTap}
              disabled={energy <= 0}
              className={`w-60 h-60 rounded-full blue-gradient shadow-[0_0_50px_rgba(59,130,246,0.3)] flex items-center justify-center text-white text-7xl transition-all active:scale-90 border-[15px] border-blue-50 ${energy <= 0 ? 'grayscale opacity-50' : ''}`}
            >
              💰
            </button>
            <div className="mt-8">
              <p className="text-4xl font-black tracking-tighter tabular-nums">{tapCount}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Sessions Taps Collected</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-100 rounded-full h-4 w-full relative overflow-hidden p-1 border border-white">
              <div 
                className="absolute top-0 left-0 h-full accent-gradient transition-all duration-300 rounded-full" 
                style={{ width: `${energy}%` }}
              />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Energy Tank: {energy}/100</p>
          </div>
          {message && <p className="text-red-500 text-xs font-bold animate-pulse">{message}</p>}
        </div>
      )}

      {category === TaskCategory.MINING && (
        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="text-6xl animate-bounce">⛏️</div>
                <h3 className="text-2xl font-black">Mining Active</h3>
                <div className="bg-gray-50 py-4 px-6 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Mined in this session</p>
                  <p className="text-3xl font-black tabular-nums text-orange-500">${miningRate.toFixed(3)}</p>
                </div>
                <p className="text-xs text-gray-500 font-medium italic">Our cloud infrastructure is mining rewards for you automatically.</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 animate-[loading_2s_linear_infinite]"></div>
           </div>
        </div>
      )}

      {category === TaskCategory.ADS && (
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
          <div className="text-6xl">🎬</div>
          <h3 className="text-xl font-black uppercase tracking-tight">Premium Video Ad</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Watch a short sponsor video to earn <span className="text-blue-600 font-bold">$2.50</span> added directly to your balance.</p>
          <button
            onClick={handleWatchAd}
            disabled={loading}
            className="w-full blue-gradient py-5 rounded-3xl text-white font-black uppercase tracking-widest shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95 transition-all"
          >
            {loading ? "Buffering Ad..." : "Watch & Earn $2.50"}
          </button>
        </div>
      )}

      {(category === TaskCategory.QUIZ || category === TaskCategory.GAME) && (
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 flex flex-col items-center gap-6">
          <div className="text-6xl grayscale opacity-30">🚧</div>
          <div className="space-y-2">
            <h3 className="font-black text-xl uppercase tracking-tight">Server Update</h3>
            <p className="text-xs text-gray-400 font-medium px-4">We are currently integrating new partners for {category}. Expect high-yield rewards shortly!</p>
          </div>
          <button onClick={onBack} className="text-[10px] font-black text-blue-600 uppercase tracking-widest underline decoration-2 underline-offset-4">Return to Lobby</button>
        </div>
      )}
    </div>
  );
};

export default TaskPage;
