
export class NotificationService {
  private static chime = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

  static async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async notify(title: string, body: string) {
    if (Notification.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    // Play sound
    try {
      this.chime.currentTime = 0;
      await this.chime.play();
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }

    // Show notification
    const notification = new Notification(title, {
      body,
      icon: '/logo192.png', // Or any relevant icon
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}
