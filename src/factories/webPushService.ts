import webpush from 'web-push';

export class WebPush {
  constructor() {
    webpush.setVapidDetails(
      `mailto:${process.env.VAPID_EMAIL || 'admin@bookswap.com'}`,
      process.env.VAPID_PUBLIC_KEY || 'fake-public-key',
      process.env.VAPID_PRIVATE_KEY || 'fake-private-key'
    );
  }

  async sendNotification(subscription: any, payload: string): Promise<any> {
    try {
      return await webpush.sendNotification(subscription, payload);
    } catch (error: any) {
      console.error('Erro ao enviar push notification:', error);
      throw error;
    }
  }
}