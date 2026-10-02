describe('Frontend Validation Utilities', () => {
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidIndianMobile = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    const clean10Digits = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    return /^[6-9]\d{9}$/.test(clean10Digits);
  };

  const isValidPassword = (password: string) => password.length >= 8;

  it('should validate email addresses correctly', () => {
    expect(isValidEmail('jenish@example.com')).toBe(true);
    expect(isValidEmail('test.user@domain.co.in')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('missing@domain')).toBe(false);
  });

  it('should validate 10-digit Indian mobile numbers', () => {
    expect(isValidIndianMobile('9876543210')).toBe(true);
    expect(isValidIndianMobile('+91 9876543210')).toBe(true);
    expect(isValidIndianMobile('12345')).toBe(false); // less than 10 digits
    expect(isValidIndianMobile('1234567890')).toBe(false); // invalid starting digit for India
  });

  it('should enforce password length rules (at least 8 chars)', () => {
    expect(isValidPassword('password123')).toBe(true);
    expect(isValidPassword('pass')).toBe(false);
  });
});
