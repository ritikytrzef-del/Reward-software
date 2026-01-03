export const API = {
    async getBalance() {
        return { total: 1250.50, today: 45.20 };
    },

    async getWithdrawalHistory() {
        return [
            { id: '1', amount: 50.00, status: 'Completed', date: '2023-10-25', method: 'USDT' },
            { id: '2', amount: 100.00, status: 'Pending', date: '2023-10-27', method: 'TON' },
            { id: '3', amount: 25.00, status: 'Rejected', date: '2023-10-20', method: 'PayPal' },
        ];
    },

    async requestWithdrawal(amount, method) {
        await new Promise(r => setTimeout(r, 1500));
        if (amount < 10) throw new Error("Minimum withdrawal is $10.00");
        return { success: true };
    },

    async getActivityData() {
        return [
            { day: 'M', value: 30 },
            { day: 'T', value: 45 },
            { day: 'W', value: 25 },
            { day: 'T', value: 60 },
            { day: 'F', value: 40 },
            { day: 'S', value: 80 },
            { day: 'S', value: 55 }
        ];
    }
};