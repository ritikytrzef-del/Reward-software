
export const Auth = {
    getUser() {
        const tg = window.Telegram?.WebApp;
        if (tg?.initDataUnsafe?.user) {
            return {
                id: tg.initDataUnsafe.user.id,
                username: tg.initDataUnsafe.user.username || 'user',
                first_name: tg.initDataUnsafe.user.first_name,
                photo_url: tg.initDataUnsafe.user.photo_url || `https://ui-avatars.com/api/?name=${tg.initDataUnsafe.user.first_name}&background=3b82f6&color=fff`
            };
        }
        // Fallback for browser testing
        return {
            id: 12345678,
            username: 'reward_software',
            first_name: 'Reward Software',
            photo_url: 'https://ui-avatars.com/api/?name=Reward+Software&background=3b82f6&color=fff'
        };
    },

    initTelegram() {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            tg.headerColor = '#ffffff';
            tg.backgroundColor = '#ffffff';
        }
    }
};
