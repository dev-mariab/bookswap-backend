export declare class AuthUtils {
    static generateToken(userId: string, email: string): string;
    static verifyToken(token: string): any;
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hash: string): Promise<boolean>;
    static extractToken(authHeader: string | undefined): string | null;
}
//# sourceMappingURL=Auth.d.ts.map