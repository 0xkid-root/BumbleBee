import { openDB, IDBPDatabase } from 'idb'

interface IDBUser {
  id: string
  name: string | null
  address: string
  createdAt: number
}

const DB_NAME = 'BumbleBeeDB'
const DB_VERSION = 1
const USERS_STORE = 'users'

export async function initializeDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db: IDBPDatabase) {
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const store = db.createObjectStore(USERS_STORE, { keyPath: 'address' })
        store.createIndex('address', 'address', { unique: true })
      }
    },
  })
  return db
}

export async function getUserByWalletAddress(address: string): Promise<IDBUser | null> {
  try {
    const db = await initializeDB()
    const user = await db.get(USERS_STORE, address)
    return user || null
  } catch (error) {
    console.error('Error fetching user from IDB:', error)
    return null
  }
}

export async function createUser(userData: { name: string; address: string }): Promise<IDBUser> {
  try {
    const db = await initializeDB()
    const user: IDBUser = {
      id: crypto.randomUUID(),
      ...userData,
      createdAt: Date.now(),
    }
    
    await db.put(USERS_STORE, user)
    return user
  } catch (error) {
    console.error('Error creating user in IDB:', error)
    throw error
  }
}

export async function updateUser(userData: Partial<IDBUser> & { address: string }): Promise<IDBUser> {
  try {
    const db = await initializeDB()
    const existingUser = await getUserByWalletAddress(userData.address)
    
    if (!existingUser) {
      throw new Error('User not found')
    }
    
    const updatedUser = {
      ...existingUser,
      ...userData,
    }
    
    await db.put(USERS_STORE, updatedUser)
    return updatedUser
  } catch (error) {
    console.error('Error updating user in IDB:', error)
    throw error
  }
}

export async function deleteUser(address: string): Promise<void> {
  try {
    const db = await initializeDB()
    await db.delete(USERS_STORE, address)
  } catch (error) {
    console.error('Error deleting user from IDB:', error)
    throw error
  }
}
