// Store verification codes in memory (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

// Clean up expired codes periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of verificationCodes.entries()) {
    if (data.expiresAt < now) {
      verificationCodes.delete(email);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes

export function storeVerificationCode(email: string, code: string, expiresAt: number): void {
  verificationCodes.set(email, { code, expiresAt });
}

export function verifyCode(email: string, code: string): boolean {
  const stored = verificationCodes.get(email);
  if (!stored) {
    return false;
  }

  if (stored.expiresAt < Date.now()) {
    verificationCodes.delete(email);
    return false;
  }

  if (stored.code !== code) {
    return false;
  }

  // Code is valid, remove it
  verificationCodes.delete(email);
  return true;
}

