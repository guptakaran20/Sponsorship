import { generateAccessToken, generateRefreshToken, verifyToken, verifyRefreshToken } from '../utils/jwt';

describe('JWT Utils', () => {
  const userId = '550e8400-e29b-41d4-a716-446655440000';
  const role = 'CLUB';

  it('should generate a valid access token', () => {
    const token = generateAccessToken(userId, role);
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
  });

  it('should generate a valid refresh token', () => {
    const token = generateRefreshToken(userId);
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
  });

  it('should verify a valid access token', () => {
    const token = generateAccessToken(userId, role);
    const decoded = verifyToken(token) as any;
    expect(decoded.id).toBe(userId);
    expect(decoded.role).toBe(role);
  });

  it('should verify a valid refresh token', () => {
    const token = generateRefreshToken(userId);
    const decoded = verifyRefreshToken(token) as any;
    expect(decoded.id).toBe(userId);
  });

  it('should throw on invalid access token', () => {
    expect(() => verifyToken('invalid-token')).toThrow();
  });
});
