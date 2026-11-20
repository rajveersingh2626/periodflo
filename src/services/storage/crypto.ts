export interface EncryptedPayload {
  ciphertext: string; // hex string
  iv: string; // hex string
  tag: string; // hex string
}

export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.trim();
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytes;
}

/**
 * Pure JavaScript SHA-256 implementation for synchronous hashing in all environments
 */
function pureJsSha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i: number, j: number;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, number> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 300; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  hash = hash.slice(0, 8);

  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (i = 0; i < ascii.length; i++) {
    const j = i >> 2;
    words[j] = (words[j] || 0) | (ascii.charCodeAt(i) << (24 - (i % 4) * 8));
  }

  for (let j = 0; j < words.length; j += 16) {
    const w = words.slice(j, j + 16);
    const oldHash = hash.slice(0);
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i] || 0
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (8 * b)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

export function sha256(str: string): string {
  if (typeof process !== 'undefined' && process.versions?.node) {
    try {
      const g = globalThis as any;
      const req = typeof g.__webpack_require__ === 'function' ? null : eval('require');
      if (req) {
        return req('crypto').createHash('sha256').update(str).digest('hex');
      }
    } catch {}
  }
  return pureJsSha256(str);
}

export function simpleHash(str: string): string {
  return sha256(str);
}

export class CryptoService {
  private static readonly IV_LENGTH = 12;
  private static readonly KEY_LENGTH = 32;

  public static generateMasterKey(): string {
    return bytesToHex(getRandomBytes(this.KEY_LENGTH));
  }

  public static generateRandomHex(byteLength: number): string {
    return bytesToHex(getRandomBytes(byteLength));
  }

  public static sha256(str: string): string {
    return sha256(str);
  }

  /**
   * Standard Web Crypto AES-256-GCM encryption with 96-bit random IV and 128-bit authentication tag.
   */
  public static async encrypt(plaintext: string, hexKey: string): Promise<EncryptedPayload> {
    const keyBytes = hexToBytes(hexKey);
    const iv = getRandomBytes(this.IV_LENGTH);

    const cryptoKey = await globalThis.crypto.subtle.importKey(
      'raw',
      keyBytes as any,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const encoded = new TextEncoder().encode(plaintext);
    const cipherBuffer = await globalThis.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as any },
      cryptoKey,
      encoded as any
    );

    const cipherArray = new Uint8Array(cipherBuffer);
    const tag = cipherArray.slice(cipherArray.length - 16);
    const ciphertext = cipherArray.slice(0, cipherArray.length - 16);

    return {
      ciphertext: bytesToHex(ciphertext),
      iv: bytesToHex(iv),
      tag: bytesToHex(tag),
    };
  }

  /**
   * Standard Web Crypto AES-256-GCM decryption with authentication tag verification.
   * Throws if ciphertext or tag has been tampered with.
   */
  public static async decrypt(payload: EncryptedPayload, hexKey: string): Promise<string> {
    const keyBytes = hexToBytes(hexKey);
    const iv = hexToBytes(payload.iv);
    const cipherBytes = hexToBytes(payload.ciphertext);
    const tagBytes = hexToBytes(payload.tag);

    // Combine ciphertext and 16-byte authentication tag for Web Crypto Subtle
    const combined = new Uint8Array(cipherBytes.length + tagBytes.length);
    combined.set(cipherBytes);
    combined.set(tagBytes, cipherBytes.length);

    const cryptoKey = await globalThis.crypto.subtle.importKey(
      'raw',
      keyBytes as any,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await globalThis.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as any },
      cryptoKey,
      combined as any
    );

    return new TextDecoder().decode(decryptedBuffer);
  }
}
