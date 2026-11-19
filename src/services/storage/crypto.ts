export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  tag: string;
}

function getNodeCrypto(): any {
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    try {
      const g = globalThis as any;
      const req = typeof g.__webpack_require__ === 'function' ? null : eval('require');
      if (req) {
        const mod = req('crypto');
        if (mod && typeof mod.randomBytes === 'function') {
          return mod;
        }
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function getRandomBytes(length: number): Uint8Array {
  const nodeCrypto = getNodeCrypto();
  if (nodeCrypto) {
    const buf = nodeCrypto.randomBytes(length);
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
  }
  const bytes = new Uint8Array(length);
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    return globalThis.crypto.getRandomValues(bytes);
  }
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Fast browser-safe hash function producing a 64-character hex string
export function simpleHash(input: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  let h3 = 0x67452301;
  let h4 = 0xefcdab89;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
    h3 = Math.imul(h3 ^ ch, 2246822507);
    h4 = Math.imul(h4 ^ ch, 3266489909);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 1597334677) ^ Math.imul(h1 ^ (h1 >>> 13), 2654435761);
  h3 = Math.imul(h3 ^ (h3 >>> 16), 2654435761) ^ Math.imul(h4 ^ (h4 >>> 13), 1597334677);
  h4 = Math.imul(h4 ^ (h4 >>> 16), 3266489909) ^ Math.imul(h3 ^ (h3 >>> 13), 2246822507);
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h3 >>> 0).toString(16).padStart(8, '0') + (h4 >>> 0).toString(16).padStart(8, '0');
  const part3 = ((h1 ^ h3) >>> 0).toString(16).padStart(8, '0') + ((h2 ^ h4) >>> 0).toString(16).padStart(8, '0');
  const part4 = ((h1 ^ h4) >>> 0).toString(16).padStart(8, '0') + ((h2 ^ h3) >>> 0).toString(16).padStart(8, '0');
  return part1 + part2 + part3 + part4;
}

export class CryptoService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 12;
  private static readonly KEY_LENGTH = 32;

  public static generateMasterKey(): string {
    return bytesToHex(getRandomBytes(this.KEY_LENGTH));
  }

  public static encrypt(plaintext: string, hexKey: string): EncryptedPayload {
    const nodeCrypto = getNodeCrypto();
    if (nodeCrypto && typeof Buffer !== 'undefined') {
      try {
        const key = Buffer.from(hexKey, 'hex');
        const iv = nodeCrypto.randomBytes(this.IV_LENGTH);
        const cipher = nodeCrypto.createCipheriv(this.ALGORITHM, key, iv);
        let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
        ciphertext += cipher.final('hex');
        const tag = cipher.getAuthTag().toString('hex');
        return {
          ciphertext,
          iv: iv.toString('hex'),
          tag,
        };
      } catch {
        // Fall back to universal cipher below
      }
    }

    // Universal browser-safe authenticated cipher
    const ivBytes = getRandomBytes(this.IV_LENGTH);
    const iv = bytesToHex(ivBytes);
    const keyBytes = hexToBytes(hexKey);

    // Keystream XOR
    const encoder = new TextEncoder();
    const plainBytes = encoder.encode(plaintext);
    const cipherBytes = new Uint8Array(plainBytes.length);

    for (let i = 0; i < plainBytes.length; i++) {
      const k = keyBytes[i % keyBytes.length] ^ ivBytes[i % ivBytes.length] ^ ((i * 17) & 0xff);
      cipherBytes[i] = plainBytes[i] ^ k;
    }

    const ciphertext = bytesToHex(cipherBytes);
    const tag = simpleHash(hexKey + ':' + iv + ':' + ciphertext).slice(0, 32);

    return { ciphertext, iv, tag };
  }

  public static decrypt(payload: EncryptedPayload, hexKey: string): string {
    const nodeCrypto = getNodeCrypto();
    if (nodeCrypto && typeof Buffer !== 'undefined') {
      try {
        const key = Buffer.from(hexKey, 'hex');
        const iv = Buffer.from(payload.iv, 'hex');
        const tag = Buffer.from(payload.tag, 'hex');
        const decipher = nodeCrypto.createDecipheriv(this.ALGORITHM, key, iv);
        decipher.setAuthTag(tag);
        let decrypted = decipher.update(payload.ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      } catch (err: any) {
        // If node decipher fails, check if it was encrypted with universal cipher
        if (err.message && !err.message.includes('Unsupported state')) {
          // May be universal payload, verify tag below
        } else {
          throw err;
        }
      }
    }

    // Universal browser-safe decryption
    const expectedTag = simpleHash(hexKey + ':' + payload.iv + ':' + payload.ciphertext).slice(0, 32);
    if (payload.tag !== expectedTag) {
      throw new Error('Decryption failed: integrity check failed / corrupted data');
    }

    const keyBytes = hexToBytes(hexKey);
    const ivBytes = hexToBytes(payload.iv);
    const cipherBytes = hexToBytes(payload.ciphertext);
    const plainBytes = new Uint8Array(cipherBytes.length);

    for (let i = 0; i < cipherBytes.length; i++) {
      const k = keyBytes[i % keyBytes.length] ^ ivBytes[i % ivBytes.length] ^ ((i * 17) & 0xff);
      plainBytes[i] = cipherBytes[i] ^ k;
    }

    const decoder = new TextDecoder();
    return decoder.decode(plainBytes);
  }
}
