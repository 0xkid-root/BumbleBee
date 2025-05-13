import SDK from 'weavedb-sdk';

// Define types for database tables (keeping the same structure for compatibility)
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

// WeaveDB configuration
const WEAVEDB_CONTRACTTXID = process.env.NEXT_PUBLIC_WEAVEDB_CONTRACTTXID || 'default-contract-id';
const WEAVEDB_COLLECTION_USERS = 'users';
const WEAVEDB_COLLECTION_WAITLIST = 'waitlist';

// Database instance
let db: any = null;

// Initialize WeaveDB connection
async function getDB() {
  if (!db) {
    try {
      // Initialize WeaveDB SDK
      db = new SDK({
        contractTxId: WEAVEDB_CONTRACTTXID,
      });
      await db.init();
      
      // Ensure collections exist
      await ensureCollectionsExist();
    } catch (error) {
      console.error('WeaveDB initialization error:', error);
      throw error;
    }
  }
  return db;
}

// Ensure collections and indexes exist
async function ensureCollectionsExist() {
  try {
    // Check if collections exist, if not create them
    // Note: In WeaveDB, collections are created automatically when first used
    // but we can add rules and indexes here
    
    // Add indexes for users collection
    await db.addIndex({
      collection: WEAVEDB_COLLECTION_USERS,
      fields: ['wallet_address'],
    });
    
    await db.addIndex({
      collection: WEAVEDB_COLLECTION_USERS,
      fields: ['username'],
    });
    
    // Add indexes for waitlist collection
    await db.addIndex({
      collection: WEAVEDB_COLLECTION_WAITLIST,
      fields: ['email'],
    });
    
  } catch (error) {
    console.warn('Error setting up collections:', error);
    // Continue anyway as collections might already exist
  }
}

// Generate a UUID (keeping the same implementation for compatibility)
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
    await getDB();
    console.log('WeaveDB initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('WeaveDB initialization failed:', error);
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
    // Query users where wallet_address equals the provided address
    const users = await db.get(
      WEAVEDB_COLLECTION_USERS,
      ['wallet_address', '==', walletAddress]
    );
    
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error getting user by wallet address:', error);
    return null;
  }
}

export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  try {
    const db = await getDB();
    
    // Check if user with this wallet address already exists
    const existingUser = await getUserByWalletAddress(userData.wallet_address);
    if (existingUser) {
      throw new Error('User with this wallet address already exists');
    }
    
    // Create new user object
    const now = new Date();
    const newUser: User = {
      ...userData,
      id: generateUUID(),
      created_at: now,
      updated_at: now
    };
    
    // Add user to WeaveDB
    await db.set(
      newUser,
      WEAVEDB_COLLECTION_USERS,
      newUser.id
    );
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Waitlist-related functions
export async function addToWaitlist(waitlistData: Omit<WaitlistEntry, 'id' | 'created_at'>): Promise<WaitlistEntry> {
  try {
    const db = await getDB();
    
    // Check if email already exists in waitlist
    const existingEntries = await db.get(
      WEAVEDB_COLLECTION_WAITLIST,
      ['email', '==', waitlistData.email]
    );
    
    if (existingEntries.length > 0) {
      throw new Error('Email already registered in waitlist');
    }
    
    // Create new waitlist entry
    const now = new Date();
    const newEntry: WaitlistEntry = {
      ...waitlistData,
      id: generateUUID(),
      created_at: now
    };
    
    // Add entry to WeaveDB
    await db.set(
      newEntry,
      WEAVEDB_COLLECTION_WAITLIST,
      newEntry.id
    );
    
    return newEntry;
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    throw error;
  }
}

// Close connection
export async function closeConnection() {
  if (db) {
    // WeaveDB doesn't require explicit connection closing
    // but we'll reset the instance for consistency with the previous API
    db = null;
    console.log('WeaveDB connection closed');
  }
}
