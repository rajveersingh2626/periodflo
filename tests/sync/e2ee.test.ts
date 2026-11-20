import { describe, it, expect } from 'vitest';
import { E2EESyncService, SharedPermissions, WebCryptoECDH } from '../../src/services/sync/e2ee';

describe('Zero-Knowledge E2EE Sync Protocol', () => {
  it('should generate an ECDH keypair and derive identical shared symmetric secret on both devices', () => {
    // Primary User Device
    const primarySession = E2EESyncService.generateKeyPair();
    // Partner Device
    const partnerSession = E2EESyncService.generateKeyPair();

    // Key exchange: Primary receives Partner's public key
    const primarySharedSecret = E2EESyncService.computeSharedSecret(
      primarySession.privateKey,
      partnerSession.publicKey
    );

    // Partner receives Primary's public key
    const partnerSharedSecret = E2EESyncService.computeSharedSecret(
      partnerSession.privateKey,
      primarySession.publicKey
    );

    expect(primarySharedSecret).toBeDefined();
    expect(partnerSharedSecret).toBeDefined();
    expect(primarySharedSecret).toBe(partnerSharedSecret);
  });

  it('should perform Web Crypto ECDH key agreement', async () => {
    const aliceKeys = await WebCryptoECDH.generateKeyPair();
    const bobKeys = await WebCryptoECDH.generateKeyPair();

    const alicePubHex = await WebCryptoECDH.exportPublicKey(aliceKeys.publicKey);
    const bobPubHex = await WebCryptoECDH.exportPublicKey(bobKeys.publicKey);

    const aliceShared = await WebCryptoECDH.deriveSharedSecret(aliceKeys.privateKey, bobPubHex);
    const bobShared = await WebCryptoECDH.deriveSharedSecret(bobKeys.privateKey, alicePubHex);

    expect(aliceShared).toBeDefined();
    expect(bobShared).toBeDefined();
    expect(aliceShared).toBe(bobShared);
  });

  it('should filter payload according to granular permissions before encryption', () => {
    const fullPayload = {
      cycleDay: 14,
      phase: 'ovulatory' as const,
      countdownDays: 14,
      energyForecast: 'Peak Energy',
      symptoms: ['cramps' as const],
      detailedNotes: 'Private gynecologist appointment details',
      sexualActivity: 'Active',
    };

    // Case 1: Primary allows phase, countdown, energy, but forbids symptoms and detailed notes
    const restrictedPermissions: SharedPermissions = {
      sharePhase: true,
      shareCountdown: true,
      shareEnergyAndMood: true,
      shareSymptoms: false,
    };

    const sanitized = E2EESyncService.filterPayloadByPermissions(
      fullPayload,
      restrictedPermissions
    );

    expect(sanitized.cycleDay).toBe(14);
    expect(sanitized.phase).toBe('ovulatory');
    expect(sanitized.countdownDays).toBe(14);
    expect(sanitized.symptoms).toBeUndefined();
    // Private notes and sensitive activity must NEVER be included in sync
    expect((sanitized as any).detailedNotes).toBeUndefined();
    expect((sanitized as any).sexualActivity).toBeUndefined();
  });

  it('should encrypt and decrypt partner payload end-to-end', async () => {
    const primarySession = E2EESyncService.generateKeyPair();
    const partnerSession = E2EESyncService.generateKeyPair();
    const sharedSecret = E2EESyncService.computeSharedSecret(
      primarySession.privateKey,
      partnerSession.publicKey
    );

    const payload = {
      cycleDay: 20,
      phase: 'luteal' as const,
      countdownDays: 8,
      energyForecast: 'Gentle calm',
      empathyTip: 'Make dinner and offer a back rub tonight',
    };

    const ciphertext = await E2EESyncService.encryptForPartner(payload, sharedSecret);
    expect(typeof ciphertext).toBe('string');
    expect(ciphertext).not.toContain('luteal'); // Ciphertext only

    const decrypted = await E2EESyncService.decryptFromPartner(ciphertext, sharedSecret);
    expect(decrypted).toEqual(payload);
  });
});
