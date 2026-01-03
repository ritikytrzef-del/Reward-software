
import React, { useState, useEffect } from 'react';
import { fetchWithdrawalHistory, requestWithdrawal } from '../services/api';
import { WithdrawalRecord } from '../types';
import { telegram } from '../services/telegram';

const Withdrawal: React.FC = () => {
  const [history, setHistory] = useState<WithdrawalRecord[]>([]);
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');
  const [method, setMethod] = useState('Litecoin (LTC)');
  const [loading, setLoading] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);

  useEffect(() => {
    fetchWithdrawalHistory().then(setHistory);
    
    // Daily limit tracking
    const today = new Date().toDateString();
    const stats = localStorage.getItem('payout_stats');
    if (stats) {
      try {
        const parsed = JSON.parse(stats);
        if (parsed.date === today) {
          setDailyCount(parsed.count);
        } else {
          localStorage.setItem('payout_stats', JSON.stringify({ date: today, count: 0 }));
        }
      } catch (e) {
        localStorage.setItem('payout_stats', JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      localStorage.setItem('payout_stats', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    
    if (dailyCount >= 2) {
      telegram.showAlert("Daily limit of 2 withdrawals reached.");
      return;
    }

    if (!wallet) {
      telegram.showAlert("Please enter your FaucetPay Email/Address.");
      return;
    }

    if (isNaN(val) || val < 0.01) {
      telegram.showAlert("Minimum withdrawal is $0.01");
      return;
    }
    
    if (val > 10) {
      telegram.showAlert("Maximum withdrawal is $10.00 per transaction");
      return;
    }

    setLoading(true);
    try {
      await requestWithdrawal(val, method);
      
      const newCount = dailyCount + 1;
      setDailyCount(newCount);
      localStorage.setItem('payout_stats', JSON.stringify({ 
        date: new Date().toDateString(), 
        count: newCount 
      }));

      telegram.showAlert("Request submitted! FaucetPay transfers are processed within 12-24h.");
      setAmount('');
      const newHistory = await fetchWithdrawalHistory();
      setHistory(newHistory);
    } catch (err: any) {
      telegram.showAlert(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight">Withdrawal Hub</h2>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <p className="text-blue-700 text-[11px] font-black uppercase tracking-[0.2em]">Exclusively FaucetPay</p>
        </div>
      </div>

      <div className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-50">
        <div className="flex items-center gap-3 mb-8 bg-blue-50/50 p-4 rounded-3xl border border-blue-100/50">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">
            🏦
          </div>
          <div>
            <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm">FaucetPay Wallet</h3>
            <p className="text-[11px] text-blue-700 font-black uppercase tracking-widest">Instant-Micro Payouts</p>
          </div>
        </div>
        
        <form onSubmit={handleWithdraw} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1 block">Currency Selection</label>
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black focus:bg-white focus:border-blue-100 outline-none transition-all"
            >
              <option>Litecoin (LTC)</option>
              <option>Bitcoin (BTC)</option>
              <option>Dogecoin (DOGE)</option>
              <option>Tether (USDT)</option>
              <option>Solana (SOL)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1 block">FaucetPay Email/Address</label>
            <input 
              type="text" 
              placeholder="example@faucetpay.com"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black focus:bg-white focus:border-blue-100 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1 block">Amount ($ USD)</label>
            <input 
              type="number" 
              placeholder="Min $0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm font-black focus:bg-white focus:border-blue-100 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Fee</p>
               <p className="text-sm font-black text-green-700">0.00%</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Daily Limit</p>
               <p className="text-sm font-black text-gray-900">{dailyCount}/2 used</p>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || dailyCount >= 2}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "COMMITTING..." : dailyCount >= 2 ? "LIMIT REACHED" : "WITHDRAW NOW"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Withdrawal Log</h4>
          <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">History</span>
        </div>
        
        {history.length === 0 ? (
           <div className="text-center py-10 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
               <p className="text-sm text-gray-500 font-black uppercase tracking-widest">Empty Log</p>
           </div>
        ) : (
          <div className="space-y-3">
            {history.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center justify-between transition-all hover:border-blue-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-blue-500 text-lg">
                    💰
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">${item.amount.toFixed(2)}</p>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{item.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                    item.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                    item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.status}
                  </span>
                  <p className="text-[8px] text-gray-400 font-black mt-1 uppercase">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default Withdrawal;
