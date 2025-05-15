import { z } from 'zod'

const envSchema = z.object({
  GAIA_NET_API_KEY: z.string().optional(),
  DELEGATION_CONTRACT_ADDRESS: z.string().optional(),
  RPC_URL: z.string().url().default('https://rpc.sepolia.org'),
  GAIA_NET_URL: z.string().url().default('https://api.gaianet.ai'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  isDevelopment: z.boolean().optional(),
}).partial()

export type Env = z.infer<typeof envSchema>

function getEnvironment(): Env {
  try {
    const parsed = envSchema.parse({
      GAIA_NET_API_KEY: process.env.NEXT_PUBLIC_GAIA_NET_API_KEY,
      DELEGATION_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_DELEGATION_CONTRACT_ADDRESS,
      RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
      GAIA_NET_URL: process.env.NEXT_PUBLIC_GAIA_NET_URL,
      LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL
    })

    return {
      ...parsed,
      isDevelopment: process.env.NODE_ENV === 'development'
    }
  } catch (error) {
    console.warn('Environment validation failed, using defaults:', error)
    return {
      RPC_URL: 'https://rpc.sepolia.org',
      GAIA_NET_URL: 'https://api.gaianet.ai',
      LOG_LEVEL: 'info',
      isDevelopment: process.env.NODE_ENV === 'development'
    }
  }
}

export const env = getEnvironment()