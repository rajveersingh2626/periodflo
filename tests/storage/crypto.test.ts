import { describe, it, expect } from 'vitest';
import { CryptoService } from '../../src/services/storage/crypto';

describe('CryptoService (AES-256-GCM Zero-Knowledge Storage)', () => {
  it('should generate a secure 256-bit master key', () => {
    const key = CryptoService.generateMasterKey();
    expect(key).toBeDefined();
    expect(key.length).toBe(64); // 32 bytes in hex = 64 characters
  });

  it('should encrypt and decrypt a plaintext string with authentication tag', () => {
    const key = CryptoService.generateMasterKey();
    const plaintext = JSON.stringify({
      flowIntensity: 'heavy',
      cramps: 'severe',
      notes: 'Severe pelvic pain on Day 1',
    });

    const encrypted = CryptoService.encrypt(plaintext, key);
    expect(encrypted).toHaveProperty('ciphertext');
    expect(encrypted).toHaveProperty('iv');
    expect(encrypted).toHaveProperty('tag');
    expect(encrypted.ciphertext).not.toBe(plaintext);

    const decrypted = CryptoService.decrypt(encrypted, key);
    expect(decrypted).toBe(plaintext);
  });

  it('should fail decryption if ciphertext or tag is tampered with', () => {
    const key = CryptoService.generateMasterKey();
    const plaintext = 'Secret reproductive health data';
    const encrypted = CryptoService.encrypt(plaintext, key);

    // Tamper with ciphertext
    const tamperedCipher = {
      ...encrypted,
      ciphertext: encrypted.ciphertext.slice(0, -4) + '0000',
    };

    expect(() => CryptoService.decrypt(tamperedCipher, key)).toThrow();
  });
});
