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
export declare class EmailNotification implements Notification {
    private transporter;
    constructor();
    send(userId: string, message: string, metadata?: NotificationMetadata): Promise<NotificationResult>;
    private getUserEmail;
    private generateSubject;
    private generateEmailTemplate;
}
export declare class PushNotification implements Notification {
    private webPushService;
    constructor();
    send(userId: string, message: string, metadata?: NotificationMetadata): Promise<NotificationResult>;
    private getUserPushSubscription;
}
export declare class InAppNotification implements Notification {
    send(userId: string, message: string, metadata?: NotificationMetadata): Promise<NotificationResult>;
    private emitWebSocketEvent;
}
export declare abstract class NotificationFactory {
    abstract createNotification(): Notification;
    notifyUser(userId: string, message: string, metadata?: NotificationMetadata): Promise<NotificationResult>;
    notifyUsers(userIds: string[], message: string, metadata?: NotificationMetadata): Promise<NotificationResult[]>;
}
export declare class EmailNotificationFactory extends NotificationFactory {
    createNotification(): Notification;
}
export declare class PushNotificationFactory extends NotificationFactory {
    createNotification(): Notification;
}
export declare class InAppNotificationFactory extends NotificationFactory {
    createNotification(): Notification;
}
export declare class NotificationFactoryProducer {
    static getFactory(type: 'email' | 'push' | 'inapp' | 'all'): NotificationFactory;
    static getFactoryForUser(userPreferences: any): NotificationFactory[];
}
export declare class CompositeNotificationFactory {
    private factories;
    constructor(factories: NotificationFactory[]);
    notifyUser(userId: string, message: string, metadata?: NotificationMetadata): Promise<NotificationResult[]>;
    addFactory(factory: NotificationFactory): void;
    removeFactory(factory: NotificationFactory): void;
}
export declare class NotificationBuilder {
    private userId;
    private message;
    private metadata;
    private types;
    private priority;
    setUserId(userId: string): this;
    setMessage(message: string): this;
    setMetadata(metadata: NotificationMetadata): this;
    setTypes(types: ('email' | 'push' | 'inapp')[]): this;
    setPriority(priority: 'low' | 'medium' | 'high'): this;
    buildAndSend(): Promise<NotificationResult[]>;
}
//# sourceMappingURL=NotificationFactory.d.ts.map