import { simpleHash } from '../storage/crypto';

export class AppLockService {
  private static pinHash: string | null = null;
  private static isBiometricsEnabled: boolean = false;
  private static isLocked: boolean = false;

  public static setPin(pin: string): void {
    this.pinHash = simpleHash('applock:' + pin);
    this.isLocked = false;
  }

  public static removePin(): void {
    this.pinHash = null;
    this.isLocked = false;
  }

  public static isLockEnabled(): boolean {
    return this.pinHash !== null;
  }

  public static verifyPin(pin: string): boolean {
    if (!this.pinHash) return true;
    const testHash = simpleHash('applock:' + pin);
    const valid = testHash === this.pinHash;
    if (valid) {
      this.isLocked = false;
    }
    return valid;
  }

  public static lock(): void {
    if (this.isLockEnabled()) {
      this.isLocked = true;
    }
  }

  public static getLockState(): boolean {
    return this.isLocked;
  }

  public static reset(): void {
    this.pinHash = null;
    this.isBiometricsEnabled = false;
    this.isLocked = false;
  }
}
