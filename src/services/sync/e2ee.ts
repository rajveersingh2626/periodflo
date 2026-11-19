import * as crypto from 'crypto';
import { CryptoService, EncryptedPayload } from '../storage/crypto';
import { CyclePhase, PhysicalSymptom } from '../../types/cycle';

export interface KeyPair {
  publicKey: string; // hex
  privateKey: string; // hex
}

export interface SharedPermissions {
  sharePhase: boolean;
  shareCountdown: boolean;
  shareEnergyAndMood: boolean;
  shareSymptoms: boolean;
}

export interface PartnerPayload {
  cycleDay?: number;
  phase?: CyclePhase;
  countdownDays?: number;
  energyForecast?: string;
  symptoms?: PhysicalSymptom[];
  empathyTip?: string;
  updatedAt?: string;
}

export class E2EESyncService {
  /**
   * Generates a fresh ECDH keypair using prime256v1 (NIST P-256)
   */
  public static generateKeyPair(): KeyPair {
    const ecdh = crypto.createECDH('prime256v1');
    ecdh.generateKeys();
    return {
      publicKey: ecdh.getPublicKey('hex'),
      privateKey: ecdh.getPrivateKey('hex'),
    };
  }

  /**
   * Computes the shared symmetric secret via ECDH
   */
  public static computeSharedSecret(privateKeyHex: string, peerPublicKeyHex: string): string {
    const ecdh = crypto.createECDH('prime256v1');
    ecdh.setPrivateKey(Buffer.from(privateKeyHex, 'hex'));
    const sharedSecret = ecdh.computeSecret(Buffer.from(peerPublicKeyHex, 'hex'));
    // Hash shared secret with SHA-256 to produce an exact 256-bit AES key
    return crypto.createHash('sha256').update(sharedSecret).digest('hex');
  }

  /**
   * Enforces zero-knowledge data exclusion based on user's privacy toggles.
   * Private notes, intercourse, and medical records are NEVER included.
   */
  public static filterPayloadByPermissions(
    raw: {
      cycleDay: number;
      phase: CyclePhase;
      countdownDays: number;
      energyForecast?: string;
      symptoms?: PhysicalSymptom[];
      empathyTip?: string;
    },
    permissions: SharedPermissions
  ): PartnerPayload {
    const filtered: PartnerPayload = {
      updatedAt: new Date().toISOString(),
    };

    if (permissions.sharePhase) {
      filtered.cycleDay = raw.cycleDay;
      filtered.phase = raw.phase;
    }

    if (permissions.shareCountdown) {
      filtered.countdownDays = raw.countdownDays;
    }

    if (permissions.shareEnergyAndMood) {
      filtered.energyForecast = raw.energyForecast;
      filtered.empathyTip = raw.empathyTip;
    }

    if (permissions.shareSymptoms && raw.symptoms) {
      filtered.symptoms = raw.symptoms;
    }

    return filtered;
  }

  /**
   * Encrypts the filtered partner payload with the shared symmetric secret
   */
  public static encryptForPartner(payload: PartnerPayload, sharedSecretHex: string): string {
    const serialized = JSON.stringify(payload);
    const encrypted = CryptoService.encrypt(serialized, sharedSecretHex);
    return JSON.stringify(encrypted);
  }

  /**
   * Decrypts partner payload received over relay
   */
  public static decryptFromPartner(ciphertextStr: string, sharedSecretHex: string): PartnerPayload {
    const payload: EncryptedPayload = JSON.parse(ciphertextStr);
    const decrypted = CryptoService.decrypt(payload, sharedSecretHex);
    return JSON.parse(decrypted);
  }
}
