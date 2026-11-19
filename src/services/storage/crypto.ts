import * as crypto from 'crypto';

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  tag: string;
}

export class CryptoService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 12; // 96-bit IV recommended for GCM
  private static readonly KEY_LENGTH = 32; // 256-bit key

  /**
   * Generates a random cryptographically secure 256-bit master key
   */
  public static generateMasterKey(): string {
    return crypto.randomBytes(this.KEY_LENGTH).toString('hex');
  }

  /**
   * Encrypts plaintext string using AES-256-GCM
   */
  public static encrypt(plaintext: string, hexKey: string): EncryptedPayload {
    const key = Buffer.from(hexKey, 'hex');
    const iv = crypto.randomBytes(this.IV_LENGTH);

    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    const tag = cipher.getAuthTag().toString('hex');

    return {
      ciphertext,
      iv: iv.toString('hex'),
      tag,
    };
  }

  /**
   * Decrypts an EncryptedPayload using AES-256-GCM, verifying authentication tag
   */
  public static decrypt(payload: EncryptedPayload, hexKey: string): string {
    const key = Buffer.from(hexKey, 'hex');
    const iv = Buffer.from(payload.iv, 'hex');
    const tag = Buffer.from(payload.tag, 'hex');

    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(payload.ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
