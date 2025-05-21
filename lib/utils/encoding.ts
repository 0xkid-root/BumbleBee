export function bufferToBase64URLString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  
  for (const byte of bytes) {
    str += String.fromCharCode(byte);
  }
  
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function base64URLStringToBuffer(base64URLString: string): ArrayBuffer {
  const base64 = base64URLString
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const paddedBase64 = base64.padEnd(
    base64.length + (4 - (base64.length % 4)) % 4,
    '='
  );
  
  const str = atob(paddedBase64);
  const buffer = new ArrayBuffer(str.length);
  const bytes = new Uint8Array(buffer);
  
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  
  return buffer;
}