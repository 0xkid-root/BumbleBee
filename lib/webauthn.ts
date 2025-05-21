/**
 * WebAuthn implementation for BumbleBee
 * Handles passkey registration and authentication
 */

// Types
// Define our own PublicKeyCredential interface to avoid conflicts with DOM types
interface WebAuthnPublicKeyCredential extends Credential {
  rawId: ArrayBuffer;
  response: {
    clientDataJSON: ArrayBuffer;
    attestationObject?: ArrayBuffer;
    authenticatorData?: ArrayBuffer;
    signature?: ArrayBuffer;
    userHandle?: ArrayBuffer | null;
  };
  getClientExtensionResults(): Record<string, any>;
}

export interface PasskeyCredential {
  id: string;
  rawId: string;
  type: string;
  authenticatorAttachment?: string;
  response: {
    clientDataJSON: string;
    attestationObject?: string;
    authenticatorData?: string;
    signature?: string;
    userHandle?: string;
  };
  clientExtensionResults: Record<string, any>;
}

export interface PasskeyOptions {
  challenge: string;
  rp: {
    name: string;
    id?: string;
  };
  user?: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams?: Array<{
    type: string;
    alg: number;
  }>;
  timeout?: number;
  excludeCredentials?: Array<{
    id: string;
    type: string;
    transports?: string[];
  }>;
  authenticatorSelection?: {
    authenticatorAttachment?: string;
    requireResidentKey?: boolean;
    residentKey?: string;
    userVerification?: string;
  };
  attestation?: string;
}

// Check if WebAuthn is supported in the current browser
export function isWebAuthnSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === 'function'
  );
}

// Generate a random challenge for WebAuthn operations
export function generateChallenge(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for non-browser environments
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return btoa(String.fromCharCode.apply(null, Array.from(array)));
}

// Convert a base64 string to a Uint8Array
export function base64ToArrayBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Convert a Uint8Array to a base64 string
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Register a new passkey
export async function registerPasskey(
  username: string,
  displayName: string
): Promise<PasskeyCredential | null> {
  if (!isWebAuthnSupported()) {
    console.error('WebAuthn is not supported in this browser');
    return null;
  }

  try {
    // Generate a random user ID
    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);
    
    // Convert Uint8Array to ArrayBuffer
    const userIdBuffer = userId.buffer;

    // Create registration options
    const publicKeyCredentialCreationOptions: PasskeyOptions = {
      challenge: generateChallenge(),
      rp: {
        name: 'BumbleBee',
        id: window.location.hostname,
      },
      user: {
        id: arrayBufferToBase64(userIdBuffer),
        name: username,
        displayName: displayName,
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 }, // ES256
        { type: 'public-key', alg: -257 }, // RS256
      ],
      timeout: 60000,
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        requireResidentKey: false,
        userVerification: 'preferred',
      },
      attestation: 'none',
    };

    // Create a new credential
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions as any,
    }) as WebAuthnPublicKeyCredential;

    // Convert the credential to a serializable object
    const passkeyCredential: PasskeyCredential = {
      id: credential.id,
      rawId: arrayBufferToBase64(credential.rawId),
      type: credential.type,
      authenticatorAttachment: (credential as any).authenticatorAttachment,
      response: {
        clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON),
        attestationObject: credential.response.attestationObject 
          ? arrayBufferToBase64(credential.response.attestationObject)
          : undefined,
      },
      clientExtensionResults: credential.getClientExtensionResults(),
    };

    return passkeyCredential;
  } catch (error) {
    console.error('Error registering passkey:', error);
    return null;
  }
}

// Authenticate with an existing passkey
export async function authenticateWithPasskey(): Promise<PasskeyCredential | null> {
  if (!isWebAuthnSupported()) {
    console.error('WebAuthn is not supported in this browser');
    return null;
  }

  try {
    // Create authentication options
    const publicKeyCredentialRequestOptions = {
      challenge: base64ToArrayBuffer(generateChallenge()),
      timeout: 60000,
      userVerification: 'preferred',
      rpId: window.location.hostname,
    };

    // Get the credential
    const credential = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions as any,
    }) as WebAuthnPublicKeyCredential;

    // Convert the credential to a serializable object
    const passkeyCredential: PasskeyCredential = {
      id: credential.id,
      rawId: arrayBufferToBase64(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON),
        authenticatorData: credential.response.authenticatorData 
          ? arrayBufferToBase64(credential.response.authenticatorData)
          : undefined,
        signature: credential.response.signature
          ? arrayBufferToBase64(credential.response.signature)
          : undefined,
        userHandle: credential.response.userHandle
          ? arrayBufferToBase64(credential.response.userHandle)
          : undefined,
      },
      clientExtensionResults: credential.getClientExtensionResults(),
    };

    return passkeyCredential;
  } catch (error) {
    console.error('Error authenticating with passkey:', error);
    return null;
  }
}

// Verify a passkey credential on the server
export async function verifyPasskeyCredential(
  credential: PasskeyCredential
): Promise<boolean> {
  // In a real implementation, this would make a server call to verify the credential
  // For now, we'll just simulate a successful verification
  console.log('Verifying passkey credential:', credential.id);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
}
