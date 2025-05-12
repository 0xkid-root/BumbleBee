import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { getUserByWalletAddress, createUser, User, initializeDatabase, closeConnection } from '@/lib/idb';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const router = useRouter();
  
  // Variable named as required in the task
  const varOcg = "auth-hook";

  // Initialize database when component mounts
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    
    init();
  }, []);

  // Listen for account changes in MetaMask
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('MetaMask accounts changed:', accounts);
        if (accounts.length === 0) {
          // User has disconnected their account
          console.log('User disconnected from MetaMask');
          setUser(null);
          setShowRegistration(false);
        }
      };

      const handleChainChanged = (chainId: string) => {
        console.log('MetaMask chain changed:', chainId);
        // Reload the page when the chain changes
        window.location.reload();
      };

      // Subscribe to MetaMask events
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup function
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  // Check if user exists when wallet is connected
  useEffect(() => {
    const checkUser = async () => {
      if (isConnected && address) {
        console.log('Wallet is connected, checking user with address:', address);
        setIsLoading(true);
        try {
          // Try to get user data
          const userData = await getUserByWalletAddress(address);
          if (userData) {
            console.log('User found in database:', userData);
            // User exists, set user data
            setUser(userData);
            setShowRegistration(false);
          } else {
            console.log('User not found in database, showing registration');
            // User doesn't exist, show registration
            setShowRegistration(true);
          }
        } catch (error) {
          console.error('Error checking user:', error);
          setShowRegistration(true);
        } finally {
          setIsLoading(false);
        }
      } else if (!isConnected) {
        console.log('Wallet is not connected');
        setUser(null);
        setShowRegistration(false);
      }
    };
    
    checkUser();
  }, [isConnected, address]);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      console.log('Starting wallet connection process');
      
      // Check if MetaMask is installed
      if (typeof window === 'undefined' || !window.ethereum) {
        console.error('MetaMask not detected');
        alert('MetaMask is not installed. Please install MetaMask and try again.');
        setIsLoading(false);
        return;
      }
      
      // Check if MetaMask is the provider
      if (!window.ethereum.isMetaMask) {
        console.warn('Non-MetaMask provider detected');
      }
      
      console.log('MetaMask detected, checking connectors');
      console.log('Available connectors:', connectors.map(c => c.name));
      
      const connector = connectors.find(c => c.name === 'MetaMask');
      if (!connector) {
        console.error('MetaMask connector not available');
        alert('MetaMask connector not available. Please make sure MetaMask is installed.');
        setIsLoading(false);
        return;
      }
      
      console.log('Connecting to wallet with connector:', connector.name);
      
      // First try direct MetaMask connection
      try {
        console.log('Requesting accounts directly from MetaMask');
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('MetaMask accounts:', accounts);
        
        if (!accounts || accounts.length === 0) {
          console.error('No accounts returned from MetaMask');
          throw new Error('No accounts returned from MetaMask');
        }
        
        // Get the chain ID
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Current chain ID from MetaMask:', chainIdHex);
        
        // Now connect with wagmi to sync the state
        console.log('Connecting with wagmi...');
        await connect({ connector });
        
        // Wait a short time for wagmi to update its state
        setTimeout(() => {
          if (isConnected && address) {
            console.log('Wallet connected successfully via wagmi:', { address, chainId });
          } else {
            console.warn('Wagmi state not updated yet, but MetaMask is connected');
            // Force a page reload to ensure wagmi state is updated
            window.location.reload();
          }
          setIsLoading(false);
        }, 500);
        
      } catch (metaMaskError) {
        console.error('Error connecting directly with MetaMask:', metaMaskError);
        
        // Fall back to wagmi connect
        try {
          console.log('Falling back to wagmi connect...');
          await connect({ connector });
          
          // Check connection state after a short delay
          setTimeout(() => {
            if (isConnected && address) {
              console.log('Wallet connected successfully via fallback:', { address, chainId });
            } else {
              console.error('Wallet connection failed or address not available');
              alert('Failed to connect wallet. Please try again or refresh the page.');
            }
            setIsLoading(false);
          }, 500);
          
        } catch (wagmiError) {
          console.error('Error connecting with wagmi:', wagmiError);
          throw new Error(`Connection failed: ${wagmiError instanceof Error ? wagmiError.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  // Register user function
  const registerUser = async (userData: { name: string; username: string }) => {
    if (!address || !chainId) {
      console.error('Cannot register user: Missing wallet address or chain ID');
      return;
    }
    
    setIsLoading(true);
    try {
      // First ensure database is initialized
      try {
        const dbInitResult = await initializeDatabase();
        if (!dbInitResult.success) {
          throw new Error(`Database initialization failed: ${dbInitResult.error}`);
        }
        console.log('Database initialized successfully, proceeding with user registration');
      } catch (dbError: any) {
        // Special handling for database initialization errors
        if (dbError.message && dbError.message.includes('table does not exist')) {
          console.error('Database tables need to be created:', dbError);
          throw new Error(
            'The database tables do not exist yet. Please check the console for the SQL commands ' +
            'needed to create them in the Supabase dashboard.'
          );
        }
        throw dbError;
      }
      
      const chainName = getChainName(chainId);
      console.log('Registering user with data:', {
        name: userData.name,
        username: userData.username,
        wallet_address: address,
        connected_chain: chainName,
      });
      
      try {
        const newUser = await createUser({
          name: userData.name,
          username: userData.username,
          wallet_address: address,
          connected_chain: chainName,
        });
        
        if (!newUser) {
          throw new Error('Failed to create user: No user data returned');
        }
        
        console.log('User registered successfully:', newUser);
        setUser(newUser);
        setShowRegistration(false);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (createError: any) {
        // Handle specific user creation errors
        if (createError.message && createError.message.includes('duplicate key')) {
          throw new Error('A user with this username or wallet address already exists');
        }
        throw createError;
      }
    } catch (error: any) {
      console.error('Error registering user:', error);
      // Show a more user-friendly error message
      alert(`Registration failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get chain name from chain ID
  const getChainName = (id: number): string => {
    const chains: Record<number, string> = {
      1: 'Ethereum Mainnet',
      59144: 'Linea Mainnet',
      59140: 'Linea Sepolia',
      // Add more chains as needed
    };
    
    return chains[id] || `Chain ID: ${id}`;
  };

  return {
    user,
    isConnected,
    isLoading,
    address,
    chainId,
    showRegistration,
    connectWallet,
    disconnect,
    registerUser,
    setShowRegistration,
  };
}
