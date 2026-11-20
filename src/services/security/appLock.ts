import { CryptoService } from '../storage/crypto';

export class AppLockService {
  private static pinSalt: string | null = null;
  private static pinHash: string | null = null;
  private static isBiometricsEnabled: boolean = false;
  private static isLocked: boolean = false;
  private static isInitialized: boolean = false;

  private static ensureLoaded(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = window.localStorage.getItem('periodflo_v1_pin_hash');
        if (stored) {
          const parts = stored.split(':');
          if (parts.length === 2) {
            this.pinSalt = parts[0];
            this.pinHash = parts[1];
            this.isLocked = true; // Lock on refresh when PIN is enabled
          }
        }
      } catch {
        // Ignore
      }
    }
  }

  public static setPin(pin: string): void {
    this.ensureLoaded();
    const salt = CryptoService.generateRandomHex(16);
    const hash = CryptoService.sha256(`applock:${salt}:${pin}`);
    this.pinSalt = salt;
    this.pinHash = hash;
    this.isLocked = false;

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('periodflo_v1_pin_hash', `${salt}:${hash}`);
      } catch {
        // Ignore
      }
    }
  }

  public static removePin(): void {
    this.ensureLoaded();
    this.pinSalt = null;
    this.pinHash = null;
    this.isLocked = false;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem('periodflo_v1_pin_hash');
      } catch {
        // Ignore
      }
    }
  }

  public static isLockEnabled(): boolean {
    this.ensureLoaded();
    return this.pinHash !== null;
  }

  public static verifyPin(pin: string): boolean {
    this.ensureLoaded();
    if (!this.pinHash || !this.pinSalt) return true;
    const testHash = CryptoService.sha256(`applock:${this.pinSalt}:${pin}`);
    const valid = testHash === this.pinHash;
    if (valid) {
      this.isLocked = false;
    }
    return valid;
  }

  public static lock(): void {
    this.ensureLoaded();
    if (this.isLockEnabled()) {
      this.isLocked = true;
    }
  }

  public static getLockState(): boolean {
    this.ensureLoaded();
    return this.isLocked;
  }

  public static reset(): void {
    this.pinSalt = null;
    this.pinHash = null;
    this.isBiometricsEnabled = false;
    this.isLocked = false;
    this.isInitialized = true;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem('periodflo_v1_pin_hash');
      } catch {
        // Ignore
      }
    }
  }
}
