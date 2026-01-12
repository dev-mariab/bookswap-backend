"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationBuilder = exports.CompositeNotificationFactory = exports.NotificationFactoryProducer = exports.InAppNotificationFactory = exports.PushNotificationFactory = exports.EmailNotificationFactory = exports.NotificationFactory = exports.InAppNotification = exports.PushNotification = exports.EmailNotification = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const webPushService_1 = require("./webPushService");
const Notification_1 = require("../models/Notification");
class EmailNotification {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    async send(userId, message, metadata) {
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
        }
        catch (error) {
            console.error(`Erro ao enviar email para ${userId}:`, error.message);
            return {
                success: false,
                error: error.message,
                sentAt: new Date()
            };
        }
    }
    async getUserEmail(userId) {
        return `${userId}@example.com`;
    }
    generateSubject(metadata) {
        if (metadata?.listingType === 'venda') {
            return 'Seu livro foi anunciado para venda no BookSwap!';
        }
        else if (metadata?.listingType === 'troca') {
            return 'Anúncio de troca publicado no BookSwap';
        }
        else if (metadata?.listingType === 'doacao') {
            return 'Obrigado por doar um livro no BookSwap!';
        }
        return 'Notificação do BookSwap Academy';
    }
    generateEmailTemplate(message, metadata) {
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
exports.EmailNotification = EmailNotification;
class PushNotification {
    constructor() {
        this.webPushService = new webPushService_1.WebPush();
    }
    async send(userId, message, metadata) {
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
        }
        catch (error) {
            console.error(`Erro ao enviar push notification para ${userId}:`, error.message);
            return {
                success: false,
                error: error.message,
                sentAt: new Date()
            };
        }
    }
    async getUserPushSubscription(userId) {
        return {
            endpoint: 'https://fcm.googleapis.com/fcm/send/fake-token',
            keys: {
                p256dh: 'fake-p256dh-key',
                auth: 'fake-auth-key'
            }
        };
    }
}
exports.PushNotification = PushNotification;
class InAppNotification {
    async send(userId, message, metadata) {
        try {
            console.log(`🔔 Criando notificação in-app para usuário ${userId}: ${message}`);
            const notification = await Notification_1.Notification.create({
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
        }
        catch (error) {
            console.error(`Erro ao salvar notificação in-app para ${userId}:`, error.message);
            return {
                success: false,
                error: error.message,
                sentAt: new Date()
            };
        }
    }
    emitWebSocketEvent(userId, notification) {
        console.log(`Evento WebSocket emitido para usuário ${userId}`);
    }
}
exports.InAppNotification = InAppNotification;
class NotificationFactory {
    async notifyUser(userId, message, metadata) {
        const notification = this.createNotification();
        return await notification.send(userId, message, metadata);
    }
    async notifyUsers(userIds, message, metadata) {
        const results = [];
        for (const userId of userIds) {
            const result = await this.notifyUser(userId, message, metadata);
            results.push(result);
        }
        return results;
    }
}
exports.NotificationFactory = NotificationFactory;
class EmailNotificationFactory extends NotificationFactory {
    createNotification() {
        return new EmailNotification();
    }
}
exports.EmailNotificationFactory = EmailNotificationFactory;
class PushNotificationFactory extends NotificationFactory {
    createNotification() {
        return new PushNotification();
    }
}
exports.PushNotificationFactory = PushNotificationFactory;
class InAppNotificationFactory extends NotificationFactory {
    createNotification() {
        return new InAppNotification();
    }
}
exports.InAppNotificationFactory = InAppNotificationFactory;
class NotificationFactoryProducer {
    static getFactory(type) {
        switch (type.toLowerCase()) {
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
    static getFactoryForUser(userPreferences) {
        const factories = [];
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
exports.NotificationFactoryProducer = NotificationFactoryProducer;
class CompositeNotificationFactory {
    constructor(factories) {
        super();
        this.factories = factories;
    }
    async notifyUser(userId, message, metadata) {
        const results = [];
        for (const factory of this.factories) {
            try {
                const result = await factory.notifyUser(userId, message, metadata);
                results.push(result);
            }
            catch (error) {
                results.push({
                    success: false,
                    error: `Erro na factory ${factory.constructor.name}: ${error.message}`,
                    sentAt: new Date()
                });
            }
        }
        return results;
    }
    addFactory(factory) {
        this.factories.push(factory);
    }
    removeFactory(factory) {
        const index = this.factories.indexOf(factory);
        if (index > -1) {
            this.factories.splice(index, 1);
        }
    }
}
exports.CompositeNotificationFactory = CompositeNotificationFactory;
class NotificationBuilder {
    constructor() {
        this.userId = '';
        this.message = '';
        this.metadata = {};
        this.types = ['inapp'];
        this.priority = 'medium';
    }
    setUserId(userId) {
        this.userId = userId;
        return this;
    }
    setMessage(message) {
        this.message = message;
        return this;
    }
    setMetadata(metadata) {
        this.metadata = metadata;
        return this;
    }
    setTypes(types) {
        this.types = types;
        return this;
    }
    setPriority(priority) {
        this.priority = priority;
        this.metadata.priority = priority;
        return this;
    }
    buildAndSend() {
        if (!this.userId || !this.message) {
            throw new Error('UserId e Message são obrigatórios');
        }
        const factories = this.types.map(type => NotificationFactoryProducer.getFactory(type));
        const compositeFactory = new CompositeNotificationFactory(factories);
        return compositeFactory.notifyUser(this.userId, this.message, this.metadata);
    }
}
exports.NotificationBuilder = NotificationBuilder;
//# sourceMappingURL=NotificationFactory.js.map