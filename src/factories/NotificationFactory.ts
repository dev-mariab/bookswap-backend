import nodemailer from 'nodemailer';
import { WebPush } from './webPushService'; 
import { Notification as NotificationModel } from '../models/Notification'; 

export interface Notification {
  send(userId: string, message: string, metadata?: any): Promise<NotificationResult>;
}

export interface NotificationResult {
  success: boolean;
  notificationId?: string;
  error?: string;
  sentAt: Date;
}

export interface NotificationMetadata {
  bookId?: string;
  listingType?: 'venda' | 'troca' | 'doacao';
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
}


export class EmailNotification implements Notification {
  private transporter: any;
  
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  
  async send(userId: string, message: string, metadata?: NotificationMetadata): Promise<NotificationResult> {
    try {
      console.log(`Preparando email para usuário ${userId}: ${message.substring(0, 50)}...`);
      
      const userEmail = await this.getUserEmail(userId);
      
      if (!userEmail) {
        return {
          success: false,
          error: 'Email do usuário não encontrado',
          sentAt: new Date()
        };
      }
      
      const mailOptions = {
        from: `"BookSwap Academy" <${process.env.EMAIL_FROM || 'noreply@bookswap.com'}>`,
        to: userEmail,
        subject: this.generateSubject(metadata),
        html: this.generateEmailTemplate(message, metadata),
        text: message
      };
      
      const info = await this.transporter.sendMail(mailOptions);
      
      console.log(`Email enviado para ${userEmail}: ${info.messageId}`);
      
      return {
        success: true,
        notificationId: info.messageId,
        sentAt: new Date()
      };
      
    } catch (error: any) {
      console.error(`Erro ao enviar email para ${userId}:`, error.message);
      return {
        success: false,
        error: error.message,
        sentAt: new Date()
      };
    }
  }
  
  private async getUserEmail(userId: string): Promise<string | null> {
     return `${userId}@example.com`; 
  }
  
  private generateSubject(metadata?: NotificationMetadata): string {
    if (metadata?.listingType === 'venda') {
      return 'Seu livro foi anunciado para venda no BookSwap!';
    } else if (metadata?.listingType === 'troca') {
      return 'Anúncio de troca publicado no BookSwap';
    } else if (metadata?.listingType === 'doacao') {
      return 'Obrigado por doar um livro no BookSwap!';
    }
    return 'Notificação do BookSwap Academy';
  }
  
  private generateEmailTemplate(message: string, metadata?: NotificationMetadata): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2C3E50; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #27AE60; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>BookSwap Academy</h1>
          </div>
          <div class="content">
            <p>${message}</p>
            ${metadata?.actionUrl ? `<a href="${metadata.actionUrl}" class="button">Ver Detalhes</a>` : ''}
            ${metadata?.bookId ? `<p><small>ID do livro: ${metadata.bookId}</small></p>` : ''}
          </div>
          <div class="footer">
            <p>Esta é uma mensagem automática do BookSwap Academy.</p>
            <p>© ${new Date().getFullYear()} BookSwap - Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export class PushNotification implements Notification {
  private webPushService: WebPush;
  
  constructor() {
    this.webPushService = new WebPush();
  }
  
  async send(userId: string, message: string, metadata?: NotificationMetadata): Promise<NotificationResult> {
    try {
      console.log(`Preparando push notification para usuário ${userId}`);
      
      const subscription = await this.getUserPushSubscription(userId);
      
      if (!subscription) {
        return {
          success: false,
          error: 'Dispositivo do usuário não registrado para push notifications',
          sentAt: new Date()
        };
      }
      
      const payload = JSON.stringify({
        title: 'BookSwap Notification',
        body: message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        data: {
          url: metadata?.actionUrl || '/',
          bookId: metadata?.bookId,
          userId: userId,
          timestamp: new Date().toISOString()
        },
        actions: [
          {
            action: 'view',
            title: 'Ver'
          },
          {
            action: 'dismiss',
            title: 'Fechar'
          }
        ]
      });
      
      const result = await this.webPushService.sendNotification(subscription, payload);
      
      console.log(`Push notification enviado para ${userId}`);
      
      return {
        success: true,
        notificationId: result.messageId,
        sentAt: new Date()
      };
      
    } catch (error: any) {
      console.error(`Erro ao enviar push notification para ${userId}:`, error.message);
      return {
        success: false,
        error: error.message,
        sentAt: new Date()
      };
    }
  }
  
  private async getUserPushSubscription(userId: string): Promise<any | null> {
  
    return {
      endpoint: 'https://fcm.googleapis.com/fcm/send/fake-token',
      keys: {
        p256dh: 'fake-p256dh-key',
        auth: 'fake-auth-key'
      }
    }; 
  }
}

export class InAppNotification implements Notification {
  async send(userId: string, message: string, metadata?: NotificationMetadata): Promise<NotificationResult> {
    try {
      console.log(`🔔 Criando notificação in-app para usuário ${userId}: ${message}`);
      
      const notification = await NotificationModel.create({
        userId,
        message,
        type: 'in_app',
        metadata: metadata || {},
        read: false,
        createdAt: new Date()
      });
      
      console.log(`Notificação in-app salva no banco: ID ${notification.id}`);
      
      this.emitWebSocketEvent(userId, notification);
      
      return {
        success: true,
        notificationId: notification.id.toString(),
        sentAt: new Date()
      };
      
    } catch (error: any) {
      console.error(`Erro ao salvar notificação in-app para ${userId}:`, error.message);
      return {
        success: false,
        error: error.message,
        sentAt: new Date()
      };
    }
  }
  
  private emitWebSocketEvent(userId: string, notification: any): void {
    console.log(`Evento WebSocket emitido para usuário ${userId}`);
  }
}

export abstract class NotificationFactory {
  abstract createNotification(): Notification;
  
  async notifyUser(
    userId: string, 
    message: string, 
    metadata?: NotificationMetadata
  ): Promise<NotificationResult> {
    const notification = this.createNotification();
    return await notification.send(userId, message, metadata);
  }
  
  async notifyUsers(
    userIds: string[], 
    message: string, 
    metadata?: NotificationMetadata
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];
    
    for (const userId of userIds) {
      const result = await this.notifyUser(userId, message, metadata);
      results.push(result);
    }
    
    return results;
  }
}

export class EmailNotificationFactory extends NotificationFactory {
  createNotification(): Notification {
    return new EmailNotification();
  }
}

export class PushNotificationFactory extends NotificationFactory {
  createNotification(): Notification {
    return new PushNotification();
  }
}

export class InAppNotificationFactory extends NotificationFactory {
  createNotification(): Notification {
    return new InAppNotification();
  }
}

export class NotificationFactoryProducer {
  static getFactory(type: 'email' | 'push' | 'inapp' | 'all'): NotificationFactory | CompositeNotificationFactory {
    switch(type.toLowerCase()) {
      case 'email':
        return new EmailNotificationFactory();
      case 'push':
        return new PushNotificationFactory();
      case 'inapp':
        return new InAppNotificationFactory();
      case 'all':
        return new CompositeNotificationFactory([
          new EmailNotificationFactory(),
          new InAppNotificationFactory(),
          new PushNotificationFactory()
        ]);
      default:
        console.warn(`⚠️ Tipo de notificação "${type}" não reconhecido, usando in-app como padrão`);
        return new InAppNotificationFactory();
    }
  }
  
  static getFactoryForUser(userPreferences: any): NotificationFactory[] {
    const factories: NotificationFactory[] = [];
    
    if (userPreferences.notifyByEmail) {
      factories.push(new EmailNotificationFactory());
    }
    
    if (userPreferences.notifyByPush) {
      factories.push(new PushNotificationFactory());
    }
    
    if (userPreferences.notifyInApp) {
      factories.push(new InAppNotificationFactory());
    }
    
    if (factories.length === 0) {
      factories.push(new InAppNotificationFactory());
    }
    
    return factories;
  }
}

export class CompositeNotificationFactory {
  private factories: NotificationFactory[];
  
  constructor(factories: NotificationFactory[]) {
    this.factories = factories;
  }
  
  async notifyUser(
    userId: string, 
    message: string, 
    metadata?: NotificationMetadata
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];
    
    for (const factory of this.factories) {
      try {
        const result = await factory.notifyUser(userId, message, metadata);
        results.push(result);
      } catch (error: any) {
        results.push({
          success: false,
          error: `Erro na factory ${factory.constructor.name}: ${error.message}`,
          sentAt: new Date()
        });
      }
    }
    
    return results;
  }
  
  async notifyUsers(
    userIds: string[], 
    message: string, 
    metadata?: NotificationMetadata
  ): Promise<NotificationResult[]> {
    const allResults: NotificationResult[] = [];
    
    for (const userId of userIds) {
      const userResults = await this.notifyUser(userId, message, metadata);
      allResults.push(...userResults);
    }
    
    return allResults;
  }
  
  addFactory(factory: NotificationFactory): void {
    this.factories.push(factory);
  }
  
  removeFactory(factory: NotificationFactory): void {
    const index = this.factories.indexOf(factory);
    if (index > -1) {
      this.factories.splice(index, 1);
    }
  }
  
  async notifyUserConsolidated(
    userId: string, 
    message: string, 
    metadata?: NotificationMetadata
  ): Promise<NotificationResult> {
    const results = await this.notifyUser(userId, message, metadata);
    
    const success = results.some(r => r.success);
    const errors = results.filter(r => r.error).map(r => r.error);
    const notificationIds = results.filter(r => r.notificationId).map(r => r.notificationId as string);
    
    return {
      success,
      error: errors.length > 0 ? errors.join('; ') : undefined,
      notificationId: notificationIds.length > 0 ? notificationIds.join(',') : undefined,
      sentAt: new Date()
    };
  }
}

export class NotificationBuilder {
  private userId: string = '';
  private message: string = '';
  private metadata: NotificationMetadata = {};
  private types: ('email' | 'push' | 'inapp' | 'all')[] = ['inapp'];
  private priority: 'low' | 'medium' | 'high' = 'medium';
  
  setUserId(userId: string): this {
    this.userId = userId;
    return this;
  }
  
  setMessage(message: string): this {
    this.message = message;
    return this;
  }
  
  setMetadata(metadata: NotificationMetadata): this {
    this.metadata = metadata;
    return this;
  }
  
  setTypes(types: ('email' | 'push' | 'inapp' | 'all')[]): this {
    this.types = types;
    return this;
  }
  
  setPriority(priority: 'low' | 'medium' | 'high'): this {
    this.priority = priority;
    this.metadata.priority = priority;
    return this;
  }
  
  async buildAndSend(): Promise<NotificationResult[]> {
    if (!this.userId || !this.message) {
      throw new Error('UserId e Message são obrigatórios');
    }
    
    const factories: NotificationFactory[] = [];
    for (const type of this.types) {
      const factory = NotificationFactoryProducer.getFactory(type);
      if (factory instanceof CompositeNotificationFactory) {
        return await factory.notifyUser(this.userId, this.message, this.metadata);
      } else {
        factories.push(factory);
      }
    }
    
    if (factories.length === 1) {
      return [await factories[0].notifyUser(this.userId, this.message, this.metadata)];
    }
    
    const compositeFactory = new CompositeNotificationFactory(factories);
    return await compositeFactory.notifyUser(this.userId, this.message, this.metadata);
  }
  
  async buildAndSendConsolidated(): Promise<NotificationResult> {
    if (!this.userId || !this.message) {
      throw new Error('UserId e Message são obrigatórios');
    }
    
    const factories: NotificationFactory[] = [];
    for (const type of this.types) {
      const factory = NotificationFactoryProducer.getFactory(type);
      if (factory instanceof CompositeNotificationFactory) {
        return await factory.notifyUserConsolidated(this.userId, this.message, this.metadata);
      } else {
        factories.push(factory);
      }
    }
    
    if (factories.length === 1) {
      return await factories[0].notifyUser(this.userId, this.message, this.metadata);
    }
    
    const compositeFactory = new CompositeNotificationFactory(factories);
    return await compositeFactory.notifyUserConsolidated(this.userId, this.message, this.metadata);
  }
  
  async buildAndSendAll(): Promise<NotificationResult[]> {
    const originalTypes = [...this.types];
    this.types = ['all'];
    const result = await this.buildAndSend();
    this.types = originalTypes;
    return result;
  }
  
  async buildAndSendAllConsolidated(): Promise<NotificationResult> {
    const originalTypes = [...this.types];
    this.types = ['all'];
    const result = await this.buildAndSendConsolidated();
    this.types = originalTypes;
    return result;
  }
  
  async sendForType(type: 'email' | 'push' | 'inapp'): Promise<NotificationResult> {
    const originalTypes = [...this.types];
    this.types = [type];
    const results = await this.buildAndSend();
    this.types = originalTypes;
    return results[0] || {
      success: false,
      error: 'Nenhum resultado retornado',
      sentAt: new Date()
    };
  }
  
  async sendAll(): Promise<NotificationResult[]> {
    return await this.buildAndSendAll();
  }
  
  async sendAllConsolidated(): Promise<NotificationResult> {
    return await this.buildAndSendAllConsolidated();
  }
}