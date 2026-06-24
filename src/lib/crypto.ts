import argon2 from 'argon2-browser';
import type {
  EncryptTextResult,
  DecryptTextResult,
  EncryptFileResult,
  DecryptFileResult,
} from './crypto.types';

// ── Constants ──
const MAGIC_HEADER = new TextEncoder().encode('SAFE');
const VERSION = new TextEncoder().encode('01');
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const HEADER_LENGTH = MAGIC_HEADER.length + VERSION.length + SALT_LENGTH + IV_LENGTH; // 34 bytes

// ── Argon2id Parameters ──
const ARGON2_MEM_COST = 65536; // 64 MB
const ARGON2_TIME_COST = 3;
const ARGON2_PARALLELISM = 1;
const ARGON2_HASH_LEN = 32;

// ── Key Derivation ──
async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const result = await argon2.hash({
    pass: password,
    salt: salt,
    type: argon2.ArgonType.Argon2id,
    hashLen: ARGON2_HASH_LEN,
    mem: ARGON2_MEM_COST,
    time: ARGON2_TIME_COST,
    parallelism: ARGON2_PARALLELISM,
  });

  return crypto.subtle.importKey(
      'raw',
      result.hash.buffer as ArrayBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
  );
}

// ── Pack Binary Format ──
function packData(salt: Uint8Array, iv: Uint8Array, ciphertext: ArrayBuffer): Uint8Array {
  const ctBytes = new Uint8Array(ciphertext);
  const packed = new Uint8Array(HEADER_LENGTH + ctBytes.length);
  let offset = 0;

  packed.set(MAGIC_HEADER, offset); offset += MAGIC_HEADER.length;
  packed.set(VERSION, offset); offset += VERSION.length;
  packed.set(salt, offset); offset += SALT_LENGTH;
  packed.set(iv, offset); offset += IV_LENGTH;
  packed.set(ctBytes, offset);

  return packed;
}

// ── Unpack Binary Format ──
function unpackData(data: Uint8Array): { salt: Uint8Array; iv: Uint8Array; ciphertext: Uint8Array } {
  // Validate magic header
  const header = new TextDecoder().decode(data.slice(0, 4));
  if (header !== 'SAFE') {
    throw new Error('Invalid file format: not a SafeVault encrypted file');
  }

  const version = new TextDecoder().decode(data.slice(4, 6));
  if (version !== '01') {
    throw new Error(`Unsupported version: ${version}`);
  }

  const salt = data.slice(6, 6 + SALT_LENGTH);
  const iv = data.slice(6 + SALT_LENGTH, 6 + SALT_LENGTH + IV_LENGTH);
  const ciphertext = data.slice(HEADER_LENGTH);

  return { salt, iv, ciphertext };
}

// ── Base64 Helpers ──
function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ── Encrypt Text ──
export async function encryptText(
  plaintext: string,
  password: string
): Promise<EncryptTextResult> {
  const start = performance.now();

  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);

  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  const packed = packData(salt, iv, ciphertext);
  const duration = performance.now() - start;

  return {
    ciphertext: uint8ToBase64(packed),
    duration,
  };
}

// ── Decrypt Text ──
export async function decryptText(
  ciphertextBase64: string,
  password: string
): Promise<DecryptTextResult> {
  const start = performance.now();

  const packed = base64ToUint8(ciphertextBase64);
  const { salt, iv, ciphertext } = unpackData(packed);
  const key = await deriveKey(password, salt);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const plaintext = new TextDecoder().decode(decrypted);
    const duration = performance.now() - start;

    return { plaintext, duration };
  } catch {
    throw new Error('Decryption failed. Wrong password or corrupted data.');
  }
}

// ── Encrypt File ──
// File format: SAFE + 01 + salt(16) + iv(12) + filenameLen(4) + filename + ciphertext
export async function encryptFile(
  file: File,
  password: string
): Promise<EncryptFileResult> {
  const start = performance.now();

  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);

  // Encode filename to prepend to data
  const filenameBytes = new TextEncoder().encode(file.name);
  const filenameLenBytes = new Uint8Array(4);
  new DataView(filenameLenBytes.buffer).setUint32(0, filenameBytes.length, false);

  const fileData = new Uint8Array(await file.arrayBuffer());

  // Combine: filenameLen + filename + fileData
  const payload = new Uint8Array(4 + filenameBytes.length + fileData.length);
  payload.set(filenameLenBytes, 0);
  payload.set(filenameBytes, 4);
  payload.set(fileData, 4 + filenameBytes.length);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    payload
  );

  const packed = packData(salt, iv, ciphertext);
  const duration = performance.now() - start;

  const blob = new Blob([packed], { type: 'application/octet-stream' });

  return {
    blob,
    filename: `${file.name}.enc`,
    duration,
    size: packed.length,
  };
}

// ── Decrypt File ──
export async function decryptFile(
  encFile: File,
  password: string
): Promise<DecryptFileResult> {
  const start = performance.now();

  const fileData = new Uint8Array(await encFile.arrayBuffer());
  const { salt, iv, ciphertext } = unpackData(fileData);
  const key = await deriveKey(password, salt);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const decryptedBytes = new Uint8Array(decrypted);

    // Extract filename
    const filenameLen = new DataView(decryptedBytes.buffer).getUint32(0, false);
    const filename = new TextDecoder().decode(
      decryptedBytes.slice(4, 4 + filenameLen)
    );
    const originalData = decryptedBytes.slice(4 + filenameLen);

    const blob = new Blob([originalData], { type: 'application/octet-stream' });
    const duration = performance.now() - start;

    return {
      blob,
      filename,
      duration,
      size: originalData.length,
    };
  } catch {
    throw new Error('Decryption failed. Wrong password or corrupted data.');
  }
}
