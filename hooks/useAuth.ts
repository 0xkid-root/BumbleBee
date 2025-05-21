import { useState, useEffect } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { useRouter } from "next/navigation"
import { getUserByWalletAddress, createUser } from "@/lib/idb"
import type { AuthUser, AuthHookResult } from "@/types/auth"
import { toast } from "sonner"
import { useChainId } from "wagmi";


export function useAuth(): AuthHookResult {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [showRegistration, setShowRegistration] = useState(false)
  
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connectAsync } = useConnect()
  const chainId = useChainId()
  console.log(chainId,"hiii")

  const connectWallet = async () => {
    try {
      await connectAsync({ connector: injected() })
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  }
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      if (!address || !isConnected) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const dbUser = await getUserByWalletAddress(address)
        
        if (dbUser) {
          setUser({
            id: dbUser.id,
            name: dbUser.name,
            address: dbUser.address,
            createdAt: dbUser.createdAt
          })
          setShowRegistration(false)
        } else {
          setUser(null)
          setShowRegistration(true)
        }
      } catch (error) {
        console.error("Error checking user:", error)
        toast.error("Failed to load user data", {
          description: "Please check your browser settings and try again."
        })
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [address, isConnected])

  const registerUser = async (userData: { name: string }) => {
    if (!address) {
      throw new Error("No wallet connected")
    }

    try {
      setIsLoading(true)
      const newUser = await createUser({
        name: userData.name,
        address: address
      })

      setUser({
        id: newUser.id,
        name: newUser.name,
        address: newUser.address,
        createdAt: newUser.createdAt
      })
      setShowRegistration(false)
      
      toast.success("Registration successful", {
        description: "Your account has been created locally."
      })
    } catch (error) {
      console.error("Error registering user:", error)
      toast.error("Registration failed", {
        description: "Please check your browser settings and try again."
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isConnected,
    isLoading,
    address,
    chainId,
    showRegistration,
    disconnect,
    connectWallet,
    registerUser,
    setShowRegistration
  }
}
