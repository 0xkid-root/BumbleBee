import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define the database schema
interface BumbleBeeDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: {
      'by-wallet-address': string;
      'by-username': string;
    };
  };
  waitlist: {
    key: string;
    value: WaitlistEntry;
    indexes: {
      'by-email': string;
    };
  };
}

// Define types for database tables
export type User = {
  id: string;
  name: string;
  username: string;
  wallet_address: string;
  connected_chain: string;
  created_at: Date;
  updated_at: Date;
}

export type WaitlistEntry = {
  id: string;
  name: string;
  email: string;
  interests: string[];
  created_at: Date;
}

// Database name and version
const DB_NAME = 'bumblebee-db';
const DB_VERSION = 1;

// Database connection
let dbPromise: Promise<IDBPDatabase<BumbleBeeDB>> | null = null;

// Get database connection
async function getDB(): Promise<IDBPDatabase<BumbleBeeDB>> {
  if (!dbPromise) {
    dbPromise = openDB<BumbleBeeDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create users store with indexes
        if (!db.objectStoreNames.contains('users')) {
          const usersStore = db.createObjectStore('users', { keyPath: 'id' });
          usersStore.createIndex('by-wallet-address', 'wallet_address', { unique: true });
          usersStore.createIndex('by-username', 'username', { unique: true });
        }
        
        // Create waitlist store with indexes
        if (!db.objectStoreNames.contains('waitlist')) {
          const waitlistStore = db.createObjectStore('waitlist', { keyPath: 'id' });
          waitlistStore.createIndex('by-email', 'email', { unique: true });
        }
      },
    });
  }
  return dbPromise;
}

// Generate a UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Database initialization function
export async function initializeDatabase() {
  try {
    // This will create the database and object stores if they don't exist
    await getDB();
    console.log('IndexedDB initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('IndexedDB initialization failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

// User-related functions
export async function getUserByWalletAddress(walletAddress: string): Promise<User | null> {
  try {
    const db = await getDB();
    const user = await db.getFromIndex('users', 'by-wallet-address', walletAddress);
    return user || null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  try {
    const db = await getDB();
    
    // Check if user with same wallet address already exists
    const existingWallet = await db.getFromIndex('users', 'by-wallet-address', userData.wallet_address);
    if (existingWallet) {
      throw new Error('Username or wallet address already exists');
    }
    
    // Check if user with same username already exists
    const existingUsername = await db.getFromIndex('users', 'by-username', userData.username);
    if (existingUsername) {
      throw new Error('Username or wallet address already exists');
    }
    
    // Create new user
    const now = new Date();
    const newUser: User = {
      ...userData,
      id: generateUUID(),
      created_at: now,
      updated_at: now
    };
    
    // Add to database
    await db.add('users', newUser);
    
    return newUser;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

// Waitlist-related functions
export async function addToWaitlist(waitlistData: Omit<WaitlistEntry, 'id' | 'created_at'>): Promise<WaitlistEntry> {
  try {
    const db = await getDB();
    
    // Check if email already exists in waitlist
    try {
      const existingEmail = await db.getFromIndex('waitlist', 'by-email', waitlistData.email);
      if (existingEmail) {
        throw new Error('This email is already on the waitlist');
      }
    } catch (error) {
      // If error is not about duplicate, rethrow
      if (!(error instanceof Error && error.message.includes('already on the waitlist'))) {
        throw error;
      }
    }
    
    // Create new waitlist entry
    const newEntry: WaitlistEntry = {
      ...waitlistData,
      id: generateUUID(),
      created_at: new Date()
    };
    
    // Add to database
    await db.add('waitlist', newEntry);
    
    return newEntry;
  } catch (error) {
    console.error('Failed to add to waitlist:', error);
    throw error;
  }
}

// Close connection (not really needed for IndexedDB but keeping API consistent)
export async function closeConnection() {
  // IndexedDB connections are automatically closed when not in use
  dbPromise = null;
}
