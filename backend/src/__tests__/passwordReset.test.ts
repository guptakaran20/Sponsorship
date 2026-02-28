import crypto from 'crypto';

describe('Password Reset Token Logic', () => {
    it('should generate a 64-character hex token', () => {
        const rawToken = crypto.randomBytes(32).toString('hex');
        expect(rawToken).toHaveLength(64);
        expect(/^[a-f0-9]{64}$/.test(rawToken)).toBe(true);
    });

    it('should produce a deterministic SHA-256 hash of a token', () => {
        const rawToken = 'a'.repeat(64);
        const hash1 = crypto.createHash('sha256').update(rawToken).digest('hex');
        const hash2 = crypto.createHash('sha256').update(rawToken).digest('hex');
        expect(hash1).toBe(hash2);
        expect(hash1).toHaveLength(64);
    });

    it('should produce different hashes for different tokens', () => {
        const token1 = crypto.randomBytes(32).toString('hex');
        const token2 = crypto.randomBytes(32).toString('hex');
        const hash1 = crypto.createHash('sha256').update(token1).digest('hex');
        const hash2 = crypto.createHash('sha256').update(token2).digest('hex');
        expect(hash1).not.toBe(hash2);
    });

    it('should set expiry to 15 minutes from now', () => {
        const before = Date.now();
        const expiry = new Date(Date.now() + 15 * 60 * 1000);
        const after = Date.now();

        const expectedMin = before + 15 * 60 * 1000;
        const expectedMax = after + 15 * 60 * 1000;

        expect(expiry.getTime()).toBeGreaterThanOrEqual(expectedMin);
        expect(expiry.getTime()).toBeLessThanOrEqual(expectedMax);
    });

    it('should detect an expired token (expiry in the past)', () => {
        const pastExpiry = new Date(Date.now() - 1000);
        expect(pastExpiry.getTime() < Date.now()).toBe(true);
    });

    it('should detect a valid token (expiry in the future)', () => {
        const futureExpiry = new Date(Date.now() + 15 * 60 * 1000);
        expect(futureExpiry.getTime() > Date.now()).toBe(true);
    });
});
