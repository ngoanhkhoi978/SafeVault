export interface EncryptTextResult {
  ciphertext: string; // base64-encoded
  duration: number;   // ms
}

export interface DecryptTextResult {
  plaintext: string;
  duration: number;
}

export interface EncryptFileResult {
  blob: Blob;
  filename: string; // original + .enc
  duration: number;
  size: number;
}

export interface DecryptFileResult {
  blob: Blob;
  filename: string;
  duration: number;
  size: number;
}
