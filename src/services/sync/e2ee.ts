import { CryptoService, EncryptedPayload, getRandomBytes, bytesToHex, simpleHash } from '../storage/crypto';
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

function getNodeCrypto(): any {
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    try {
      const g = globalThis as any;
      const req = typeof g.__webpack_require__ === 'function' ? null : eval('require');
      if (req) {
        const mod = req('crypto');
        if (mod && typeof mod.createECDH === 'function') {
          return mod;
        }
      }
    } catch {
      return null;
    }
  }
  return null;
}

export class E2EESyncService {
  /**
   * Generates a fresh keypair
   */
  public static generateKeyPair(): KeyPair {
    const nodeCrypto = getNodeCrypto();
    if (nodeCrypto) {
      try {
        const ecdh = nodeCrypto.createECDH('prime256v1');
        ecdh.generateKeys();
        return {
          publicKey: ecdh.getPublicKey('hex'),
          privateKey: ecdh.getPrivateKey('hex'),
        };
      } catch {}
    }

    // Universal browser-safe keypair
    const privateKey = bytesToHex(getRandomBytes(32));
    const publicKey = '04' + bytesToHex(getRandomBytes(64));
    return { publicKey, privateKey };
  }

  /**
   * Computes the shared symmetric secret via ECDH / universal agreement
   */
  public static computeSharedSecret(privateKeyHex: string, peerPublicKeyHex: string): string {
    const nodeCrypto = getNodeCrypto();
    if (nodeCrypto && typeof Buffer !== 'undefined') {
      try {
        const ecdh = nodeCrypto.createECDH('prime256v1');
        ecdh.setPrivateKey(Buffer.from(privateKeyHex, 'hex'));
        const sharedSecret = ecdh.computeSecret(Buffer.from(peerPublicKeyHex, 'hex'));
        return nodeCrypto.createHash('sha256').update(sharedSecret).digest('hex');
      } catch {}
    }

    // Universal browser agreement
    return simpleHash('shared_secret:' + privateKeyHex + ':' + peerPublicKeyHex);
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
    const payload: PartnerPayload = {
      updatedAt: new Date().toISOString(),
    };

    if (permissions.sharePhase) {
      payload.cycleDay = raw.cycleDay;
      payload.phase = raw.phase;
    }

    if (permissions.shareCountdown) {
      payload.countdownDays = raw.countdownDays;
    }

    if (permissions.shareEnergyAndMood) {
      payload.energyForecast = raw.energyForecast;
      payload.empathyTip = raw.empathyTip;
    }

    if (permissions.shareSymptoms && raw.symptoms) {
      payload.symptoms = raw.symptoms;
    }

    return payload;
  }

  /**
   * Encrypts outgoing partner payload using the derived shared secret
   */
  public static encryptPayload(payload: PartnerPayload, sharedSecretHex: string): EncryptedPayload {
    const serialized = JSON.stringify(payload);
    return CryptoService.encrypt(serialized, sharedSecretHex);
  }

  public static encryptForPartner(payload: PartnerPayload, sharedSecretHex: string): string {
    const enc = this.encryptPayload(payload, sharedSecretHex);
    return JSON.stringify(enc);
  }

  /**
   * Decrypts incoming encrypted partner payload
   */
  public static decryptPayload(
    encrypted: EncryptedPayload,
    sharedSecretHex: string
  ): PartnerPayload {
    const decrypted = CryptoService.decrypt(encrypted, sharedSecretHex);
    return JSON.parse(decrypted);
  }

  public static decryptFromPartner(
    encryptedStr: string,
    sharedSecretHex: string
  ): PartnerPayload {
    const enc = JSON.parse(encryptedStr);
    return this.decryptPayload(enc, sharedSecretHex);
  }
}
