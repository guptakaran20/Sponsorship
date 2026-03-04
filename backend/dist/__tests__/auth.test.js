"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
describe('JWT Utils', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const role = 'CLUB';
    it('should generate a valid access token', () => {
        const token = (0, jwt_1.generateAccessToken)(userId, role);
        expect(token).toBeTruthy();
        expect(typeof token).toBe('string');
    });
    it('should generate a valid refresh token', () => {
        const token = (0, jwt_1.generateRefreshToken)(userId);
        expect(token).toBeTruthy();
        expect(typeof token).toBe('string');
    });
    it('should verify a valid access token', () => {
        const token = (0, jwt_1.generateAccessToken)(userId, role);
        const decoded = (0, jwt_1.verifyToken)(token);
        expect(decoded.id).toBe(userId);
        expect(decoded.role).toBe(role);
    });
    it('should verify a valid refresh token', () => {
        const token = (0, jwt_1.generateRefreshToken)(userId);
        const decoded = (0, jwt_1.verifyRefreshToken)(token);
        expect(decoded.id).toBe(userId);
    });
    it('should throw on invalid access token', () => {
        expect(() => (0, jwt_1.verifyToken)('invalid-token')).toThrow();
    });
});
