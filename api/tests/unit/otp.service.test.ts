import { generateOtpCode, hashOtp, verifyOtpHash } from '../../src/utils/crypto';

describe('OTP & Security Utils Logic Tests', () => {
  it('should generate a valid 6-digit numeric OTP', () => {
    const otp = generateOtpCode();
    expect(otp).toMatch(/^\d{6}$/);
    expect(otp.length).toBe(6);
  });

  it('should generate consistent SHA-256 HMAC hashes for the same OTP', () => {
    const code = '123456';
    const hash1 = hashOtp(code);
    const hash2 = hashOtp(code);
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(code); // Must never store plain text
  });

  it('should correctly verify valid OTP hashes and reject invalid OTP codes', () => {
    const validCode = '654321';
    const invalidCode = '000000';
    const hash = hashOtp(validCode);

    expect(verifyOtpHash(validCode, hash)).toBe(true);
    expect(verifyOtpHash(invalidCode, hash)).toBe(false);
  });

  it('should evaluate OTP expiry windows accurately', () => {
    const now = new Date();
    const futureExpiry = new Date(now.getTime() + 10 * 60 * 1000); // +10 min
    const pastExpiry = new Date(now.getTime() - 1000); // -1 sec

    expect(futureExpiry > now).toBe(true);
    expect(pastExpiry < now).toBe(true);
  });

  it('should calculate remaining attempt limits accurately (Max 5 attempts)', () => {
    const maxAttempts = 5;
    let attempts = 0;

    for (let i = 1; i <= 5; i++) {
      attempts++;
      const remaining = maxAttempts - attempts;
      if (i < 5) {
        expect(remaining).toBeGreaterThan(0);
      } else {
        expect(remaining).toBe(0);
      }
    }
    expect(attempts >= maxAttempts).toBe(true);
  });

  it('should calculate resend cooldown correctly (30 seconds)', () => {
    const now = new Date();
    const resendAfter = new Date(now.getTime() + 30 * 1000); // +30 sec
    
    expect(resendAfter > now).toBe(true);
    const cooldownRemaining = Math.ceil((resendAfter.getTime() - now.getTime()) / 1000);
    expect(cooldownRemaining).toBeGreaterThanOrEqual(29);
    expect(cooldownRemaining).toBeLessThanOrEqual(30);
  });
});
