import { API } from './api.js';
import { Auth } from './auth.js';
import { UI } from './ui.js';

class App {
    constructor() {
        this.state = {
            currentTab: 'home',
            balance: { total: 0, today: 0 },
            user: null,
            activity: [],
            taps: 0,
            energy: 100,
            history: []
        };
        
        this.init();
    }

    async init() {
        Auth.initTelegram();
        this.state.user = Auth.getUser();
        
        const [balance, activity, history] = await Promise.all([
            API.getBalance(),
            API.getActivityData(),
            API.getWithdrawalHistory()
        ]);
        
        this.state.balance = balance;
        this.state.activity = activity;
        this.state.history = history;

        this.bindEvents();
        this.render();

        // Energy recharge loop
        setInterval(() => {
            if (this.state.energy < 100) {
                this.state.energy = Math.min(100, this.state.energy + 1);
                const bar = document.getElementById('energy-bar');
                if (bar) bar.style.width = `${this.state.energy}%`;
            }
        }, 2000);
    }

    bindEvents() {
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.nav;
                this.navigate(tab);
            });
        });

        // Global click handler for dynamic elements
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'payout-form') {
                e.preventDefault();
                this.handleWithdrawal();
            }
        });
    }

    navigate(tab) {
        this.state.currentTab = tab;
        
        // Update Nav UI
        document.querySelectorAll('.nav-item').forEach(btn => {
            if (btn.dataset.nav === tab || (tab === 'task' && btn.dataset.nav === 'categories')) {
                btn.classList.add('text-blue-600');
                btn.classList.remove('text-gray-400');
            } else {
                btn.classList.add('text-gray-400');
                btn.classList.remove('text-blue-600');
            }
        });

        this.render();
    }

    startTask(id) {
        this.state.currentTab = 'task';
        this.state.activeTaskId = id;
        this.render();
        
        if (id === 'tap') {
            const btn = document.getElementById('tap-btn');
            btn.addEventListener('click', () => this.handleTap());
        } else if (id === 'ads') {
            const btn = document.getElementById('ad-btn');
            btn.addEventListener('click', () => this.handleAd());
        }
    }

    handleTap() {
        if (this.state.energy < 2) {
            UI.showToast("Out of energy!", "error");
            return;
        }

        this.state.taps++;
        this.state.energy -= 2;
        this.state.balance.total += 0.01;
        this.state.balance.today += 0.01;

        // Visual updates without full re-render for performance
        const btn = document.getElementById('tap-btn');
        const countDisplay = btn.nextElementSibling.firstElementChild;
        const earnDisplay = btn.nextElementSibling.lastElementChild;
        const energyBar = document.getElementById('energy-bar');

        countDisplay.textContent = this.state.taps;
        earnDisplay.textContent = `Earnings: $${(this.state.taps * 0.01).toFixed(2)}`;
        energyBar.style.width = `${this.state.energy}%`;

        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    }

    async handleAd() {
        const btn = document.getElementById('ad-btn');
        btn.disabled = true;
        btn.textContent = "Loading Ad...";
        
        await new Promise(r => setTimeout(r, 2000));
        
        this.state.balance.total += 2.50;
        this.state.balance.today += 2.50;
        UI.showToast("Success! $2.50 added.");
        this.navigate('home');
    }

    async handleWithdrawal() {
        const amountInput = document.getElementById('payout-amount');
        const methodInput = document.getElementById('payout-method');
        const amount = parseFloat(amountInput.value);
        
        if (isNaN(amount) || amount < 10) {
            UI.showToast("Minimum withdrawal is $10", "error");
            return;
        }

        const btn = document.querySelector('#payout-form button');
        btn.disabled = true;
        btn.textContent = "Processing...";

        try {
            await API.requestWithdrawal(amount, methodInput.value);
            UI.showToast("Withdrawal request sent!");
            this.state.balance.total -= amount;
            this.state.history.unshift({
                id: Date.now().toString(),
                amount: amount,
                status: 'Pending',
                date: new Date().toISOString().split('T')[0],
                method: methodInput.value
            });
            this.navigate('withdrawal');
        } catch (err) {
            UI.showToast(err.message, "error");
        } finally {
            btn.disabled = false;
            btn.textContent = "Request Withdrawal";
        }
    }

    render() {
        const main = document.getElementById('main-content');
        switch (this.state.currentTab) {
            case 'home':
                main.innerHTML = UI.renderHome(this.state, this.state.user, this.state.activity);
                break;
            case 'categories':
                main.innerHTML = UI.renderCategories();
                break;
            case 'task':
                main.innerHTML = UI.renderTask(this.state.activeTaskId, this.state);
                break;
            case 'withdrawal':
                main.innerHTML = UI.renderWithdrawal(this.state.history);
                break;
        }
    }
}

// Global hook for events
window.app = new App();