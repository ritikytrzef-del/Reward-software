export const UI = {
    renderHome(state, user, activity) {
        const maxActivity = Math.max(...activity.map(a => a.value));
        const chartHtml = activity.map(a => `
            <div class="flex flex-col items-center gap-2 flex-1">
                <div class="w-full bg-blue-50 rounded-full h-24 relative flex items-end">
                    <div class="w-full blue-gradient rounded-full transition-all duration-700" style="height: ${(a.value / maxActivity) * 100}%"></div>
                </div>
                <span class="text-[10px] font-bold text-gray-400">${a.day}</span>
            </div>
        `).join('');

        return `
            <div class="space-y-6 animate-fadeIn">
                <!-- Header -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <img src="${user.photo_url}" class="w-12 h-12 rounded-full border-2 border-blue-100 object-cover" alt="avatar">
                        <div>
                            <h1 class="text-lg font-bold">Hi, ${user.first_name}!</h1>
                            <p class="text-xs text-gray-500">@${user.username}</p>
                        </div>
                    </div>
                    <div class="p-2 bg-blue-50 rounded-xl text-blue-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                    </div>
                </div>

                <!-- Balance Card -->
                <div class="accent-gradient rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                    <div class="relative z-10">
                        <p class="text-sm opacity-80 mb-1">Total Balance</p>
                        <div class="text-4xl font-black mb-4">$${state.balance.total.toFixed(2)}</div>
                        <div class="flex justify-between items-end">
                            <div>
                                <p class="text-[10px] opacity-70 uppercase tracking-wider">Today's Earnings</p>
                                <p class="font-bold text-lg">+$${state.balance.today.toFixed(2)}</p>
                            </div>
                            <button class="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold transition-all">
                                Refresh
                            </button>
                        </div>
                    </div>
                    <div class="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
                        <div class="w-10 h-10 blue-gradient rounded-full flex items-center justify-center text-white">⚡</div>
                        <p class="text-xs font-bold">Quick Earning</p>
                    </div>
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
                        <div class="w-10 h-10 accent-gradient rounded-full flex items-center justify-center text-white">🎁</div>
                        <p class="text-xs font-bold">Daily Gift</p>
                    </div>
                </div>

                <!-- Activity Graph -->
                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 class="text-sm font-bold mb-6">Weekly Performance</h3>
                    <div class="flex items-end justify-between gap-2 px-2">
                        ${chartHtml}
                    </div>
                </div>

                <footer class="text-center py-4 text-gray-300 text-[10px] font-bold tracking-widest uppercase">
                    Powered by Reward Software
                </footer>
            </div>
        `;
    },

    renderCategories() {
        const cats = [
            { id: 'tap', title: 'Tap2Earn', icon: '⚡', color: 'bg-yellow-50 text-yellow-600', desc: 'Tap to mine rewards' },
            { id: 'ads', title: 'Watch Ads', icon: '📺', color: 'bg-blue-50 text-blue-600', desc: 'Watch videos, get paid' },
            { id: 'quiz', title: 'Quiz Earn', icon: '📝', color: 'bg-purple-50 text-purple-600', desc: 'Knowledge is money' },
            { id: 'game', title: 'Game Earn', icon: '🎮', color: 'bg-pink-50 text-pink-600', desc: 'Play and win tokens' },
            { id: 'download', title: 'Download & Earn', icon: '📥', color: 'bg-green-50 text-green-600', desc: 'Try new apps today' }
        ];

        return `
            <div class="space-y-6 animate-fadeIn">
                <div class="text-center">
                    <h2 class="text-2xl font-black">Earning Hub</h2>
                    <p class="text-gray-500 text-sm">Pick your path to profit</p>
                </div>
                <div class="space-y-4">
                    ${cats.map(c => `
                        <button onclick="window.app.startTask('${c.id}')" class="w-full flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-all text-left">
                            <div class="w-14 h-14 ${c.color} rounded-2xl flex items-center justify-center text-2xl">${c.icon}</div>
                            <div class="flex-1">
                                <h4 class="font-bold text-gray-800">${c.title}</h4>
                                <p class="text-xs text-gray-400">${c.desc}</p>
                            </div>
                            <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderTask(id, state) {
        if (id === 'tap') {
            return `
                <div class="space-y-8 animate-fadeIn text-center">
                    <div class="flex items-center">
                        <button onclick="window.app.navigate('categories')" class="p-2 bg-gray-100 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg></button>
                        <h2 class="flex-1 text-lg font-bold mr-9 uppercase tracking-tighter">Tap2Earn</h2>
                    </div>
                    <div class="relative inline-block mt-8">
                        <button id="tap-btn" class="w-56 h-56 rounded-full blue-gradient shadow-2xl flex items-center justify-center text-white text-7xl active:scale-90 transition-transform border-[12px] border-blue-50">💰</button>
                        <div class="mt-8">
                            <p class="text-4xl font-black tabular-nums">${state.taps}</p>
                            <p class="text-gray-400 text-xs mt-1 uppercase font-bold">Earnings: $${(state.taps * 0.01).toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="bg-gray-100 rounded-full h-4 w-full relative overflow-hidden">
                            <div id="energy-bar" class="absolute top-0 left-0 h-full accent-gradient transition-all duration-300" style="width: ${state.energy}%"></div>
                        </div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Energy: ${state.energy}/100</p>
                    </div>
                </div>
            `;
        }
        if (id === 'ads') {
            return `
                <div class="space-y-8 animate-fadeIn text-center">
                    <div class="flex items-center">
                        <button onclick="window.app.navigate('categories')" class="p-2 bg-gray-100 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg></button>
                        <h2 class="flex-1 text-lg font-bold mr-9 uppercase tracking-tighter">Watch Ads</h2>
                    </div>
                    <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div class="text-6xl">🎥</div>
                        <h3 class="text-xl font-bold">Video Offer</h3>
                        <p class="text-gray-400 text-sm">Watch a short sponsor video and earn $2.50 instantly.</p>
                        <button id="ad-btn" class="w-full blue-gradient py-4 rounded-2xl text-white font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">Watch Now</button>
                    </div>
                </div>
            `;
        }
        return `<div class="p-12 text-center text-gray-400">Task coming soon...</div>`;
    },

    renderWithdrawal(history) {
        return `
            <div class="space-y-6 animate-fadeIn">
                <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 class="text-xl font-black mb-4">Request Payout</h3>
                    <form id="payout-form" class="space-y-4">
                        <div>
                            <label class="text-[10px] font-black text-gray-400 uppercase mb-1 block">Method</label>
                            <select id="payout-method" class="w-full bg-gray-100 border-none rounded-xl py-3 px-4 text-sm font-bold outline-none">
                                <option>USDT (TRC20)</option>
                                <option>TON Wallet</option>
                                <option>Binance Pay</option>
                                <option>PayPal</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-[10px] font-black text-gray-400 uppercase mb-1 block">Amount ($)</label>
                            <input id="payout-amount" type="number" step="0.01" placeholder="10.00" class="w-full bg-gray-100 border-none rounded-xl py-3 px-4 text-sm font-bold outline-none">
                        </div>
                        <button type="submit" class="w-full blue-gradient py-4 rounded-2xl text-white font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">Request Withdrawal</button>
                    </form>
                </div>

                <div class="space-y-3">
                    <h4 class="text-[10px] font-black text-gray-400 uppercase px-1">Recent Activity</h4>
                    ${history.map(h => `
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p class="text-sm font-bold">$${h.amount.toFixed(2)}</p>
                                <p class="text-[10px] text-gray-400">${h.date} • ${h.method}</p>
                            </div>
                            <span class="text-[9px] font-black px-3 py-1 rounded-full uppercase ${h.status === 'Completed' ? 'bg-green-100 text-green-600' : h.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}">
                                ${h.status}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `p-4 rounded-2xl shadow-2xl text-white text-xs font-bold transition-all transform translate-y-4 opacity-0 ${type === 'success' ? 'blue-gradient' : 'bg-red-500'}`;
        toast.textContent = message;
        container.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        setTimeout(() => {
            toast.style.transform = 'translateY(-10px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};