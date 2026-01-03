
import { User } from '../types';

declare global {
  interface Window {
    Telegram: any;
  }
}

class TelegramService {
  private tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;

  constructor() {
    if (this.tg) {
      try {
        this.tg.ready();
        this.tg.expand();
      } catch (e) {
        console.error("Telegram WebApp initialization error:", e);
      }
    }
  }

  private isVersionAtLeast(version: string): boolean {
    try {
      if (!this.tg || !this.tg.version) return false;
      return this.tg.isVersionAtLeast(version);
    } catch (e) {
      return false;
    }
  }

  getUser(): User | null {
    if (this.tg?.initDataUnsafe?.user) {
      return this.tg.initDataUnsafe.user;
    }
    // Mock user for development
    return {
      id: 12345,
      first_name: 'Reward Software',
      username: 'GuestUser',
      photo_url: 'https://ui-avatars.com/api/?name=Reward+Software&background=3b82f6&color=fff'
    };
  }

  showAlert(message: string) {
    if (this.tg && this.isVersionAtLeast('6.2')) {
      try {
        this.tg.showAlert(message);
        return;
      } catch (e) {
        console.warn("Telegram showAlert failed, falling back to alert:", e);
      }
    }
    alert(message);
  }

  /**
   * Used for internal Telegram links (e.g., https://t.me/...)
   */
  openTelegramLink(url: string) {
    if (this.tg && this.tg.openTelegramLink) {
      try {
        this.tg.openTelegramLink(url);
      } catch (e) {
        console.error("Error calling openTelegramLink:", e);
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  }

  /**
   * Used for external links (e.g., https://youtube.com/...)
   */
  openLink(url: string, options?: { try_instant_view?: boolean }) {
    if (this.tg && this.tg.openLink) {
      try {
        this.tg.openLink(url, options);
      } catch (e) {
        console.error("Error calling openLink:", e);
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  }

  hapticFeedback(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') {
    if (this.tg && this.isVersionAtLeast('6.1')) {
      try {
        this.tg.HapticFeedback?.impactOccurred(style);
      } catch (e) {
        console.warn("Telegram HapticFeedback failed:", e);
      }
    }
  }

  closeApp() {
    if (this.tg) {
      this.tg.close();
    }
  }
}

export const telegram = new TelegramService();
