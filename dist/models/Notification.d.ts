import { Model } from 'sequelize';
declare class Notification extends Model {
    id: number;
    userId: string;
    message: string;
    type: 'email' | 'push' | 'in_app';
    metadata: any;
    read: boolean;
    createdAt: Date;
    readAt?: Date;
}
export { Notification };
//# sourceMappingURL=Notification.d.ts.map