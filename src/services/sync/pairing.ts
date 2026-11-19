import { getRandomBytes, bytesToHex } from '../storage/crypto';
import { KeyPair } from './e2ee';

export interface PairingPackage {
  code: string; // 6-character alphanumeric code
  mailboxId: string;
  publicKey: string;
  qrPayload: string;
}

export class PairingService {
  /**
   * Generates a 6-character uppercase alphanumeric rendezvous PIN
   */
  public static generatePairingCode(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // exclude ambiguous 0, O, 1, I
    let code = '';
    const bytes = getRandomBytes(6);
    for (let i = 0; i < 6; i++) {
      code += chars[bytes[i] % chars.length];
    }
    return code;
  }

  /**
   * Generates the complete pairing package for primary user setup
   */
  public static createPairingPackage(keyPair: KeyPair): PairingPackage {
    const code = this.generatePairingCode();
    const mailboxId = bytesToHex(getRandomBytes(16));

    const qrData = {
      v: 1,
      m: mailboxId,
      pk: keyPair.publicKey,
    };

    return {
      code,
      mailboxId,
      publicKey: keyPair.publicKey,
      qrPayload: `periodflo://pair?data=${encodeURIComponent(JSON.stringify(qrData))}`,
    };
  }

  /**
   * Parses QR payload scanned on partner device
   */
  public static parseQrPayload(payload: string): { mailboxId: string; publicKey: string } | null {
    try {
      if (!payload.startsWith('periodflo://pair?data=')) return null;
      const rawJson = decodeURIComponent(payload.replace('periodflo://pair?data=', ''));
      const parsed = JSON.parse(rawJson);
      if (parsed.v === 1 && parsed.m && parsed.pk) {
        return {
          mailboxId: parsed.m,
          publicKey: parsed.pk,
        };
      }
      return null;
    } catch {
      return null;
    }
  }
}
