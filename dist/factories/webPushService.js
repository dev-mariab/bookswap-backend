"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPush = void 0;
const web_push_1 = __importDefault(require("web-push"));
class WebPush {
    constructor() {
        web_push_1.default.setVapidDetails(`mailto:${process.env.VAPID_EMAIL || 'admin@bookswap.com'}`, process.env.VAPID_PUBLIC_KEY || 'fake-public-key', process.env.VAPID_PRIVATE_KEY || 'fake-private-key');
    }
    async sendNotification(subscription, payload) {
        try {
            return await web_push_1.default.sendNotification(subscription, payload);
        }
        catch (error) {
            console.error('Erro ao enviar push notification:', error);
            throw error;
        }
    }
}
exports.WebPush = WebPush;
//# sourceMappingURL=webPushService.js.map