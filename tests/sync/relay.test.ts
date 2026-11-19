import { describe, it, expect, beforeEach } from 'vitest';
import { RelayServer } from '../../server/src/index';

describe('Relay Server (Blind Ephemeral Mailbox)', () => {
  let relay: RelayServer;

  beforeEach(() => {
    relay = new RelayServer();
  });

  it('should store and retrieve ephemeral rendezvous pairing codes with 10min TTL', () => {
    const code = '7K9X2P';
    const pairingPackage = {
      mailboxId: 'box-abc-123',
      publicKey: 'primary-pub-key-hex',
    };

    const saved = relay.registerRendezvous(code, pairingPackage);
    expect(saved).toBe(true);

    const retrieved = relay.claimRendezvous(code);
    expect(retrieved).toEqual(pairingPackage);

    // After claim or max attempts, it is consumed
    expect(relay.claimRendezvous(code)).toBeNull();
  });

  it('should prevent brute force with max 3 attempts', () => {
    const code = 'BRUTE1';
    relay.registerRendezvous(code, { mailboxId: 'b', publicKey: 'p' });

    expect(relay.checkAttempt('WRONG1')).toBe(false);
    expect(relay.checkAttempt('WRONG2')).toBe(false);
    expect(relay.checkAttempt('WRONG3')).toBe(false);
    // 4th attempt is rate-limited / blocked
    expect(relay.checkAttempt('WRONG4')).toBe(false);
  });

  it('should store and read blind ciphertext in mailbox', () => {
    const mailboxId = 'mailbox-xyz-789';
    const encryptedBlob = 'ciphertext-aes-gcm-hex-string';

    relay.postMailbox(mailboxId, encryptedBlob);
    const read = relay.getMailbox(mailboxId);
    expect(read).toBe(encryptedBlob);
  });
});
