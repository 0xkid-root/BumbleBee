"use client";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAccount, useChainId } from "wagmi";
import { useAuth } from "@/hooks/useAuth";
import { useClipboard } from "@/lib/hooks/use-clipboard";
import { toast } from "sonner";
import {
  sendUserOperation,
  createSessionKey,
  redeemPermissions,
  revokeDelegation as revokeDelegationToolkit,
  connectBundler,
  getEntryPointContract,
  SessionKey,
} from "@/lib/delegation/gatorClient";
import { createMetaMaskSmartAccount } from "@/lib/delegation/metaMaskSmartAccount";
import {
  PasskeyCredential,
  registerPasskey as createPasskeyCredential,
  verifyPasskeyCredential,
} from "@/lib/webauthn";
import {
  SectionTitle,
  DelegationCaveatsModal,
  AccountDetailsModal,
  DelegationStatus,
  DelegationCaveat,
} from "@/components/wallet";
import {
  SendAssetModal,
  ReceiveAssetModal,
  SwapAssetsModal,
} from "@/components/wallet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Sparkles,
  AlertCircle,
  RefreshCw,
  Loader2,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  Wallet,
  Shield,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { PasskeyDialog } from "./components/PasskeyDialog";

// Types
import type { Asset } from "@/lib/store/use-wallet-store";
import { useWalletStore } from "@/lib/store/use-wallet-store";
import {
  Network,
  PermissionType,
  Caveat,
} from "@/lib/bumblebee-sdk";
import { calculateExpiryFromCaveats } from "./utils/delegation";
import { CaveatType, DelegationAccount as ComponentDelegationAccount } from "@/components/wallet/delegation-types";

// Define types with proper null handling
interface SmartAccount {
  id: string;
  address: string;
  name: string;
  type: "EOA" | "Smart" | "Delegate";
  balance: number;
  createdAt: Date;
  status: "Active" | "Pending" | "Inactive";
  implementation?: string;
}

interface DelegationResult {
  delegation: { id: string };
  smartAccount: { address: string };
  implementation: string;
}

interface DelegationAccount extends SmartAccount {
  delegationId: string;
  delegationType: PermissionType;
  caveats: DelegationCaveat[];
  delegatedTo: string;
  expiresAt?: Date;
  sessionKey: SessionKey;
  passkey?: PasskeyCredential | null; // Allow null values
  revokedAt?: Date;
  implementation: string;
  signers?: string[];
  threshold?: number;
}

// Delegation implementation types
enum DelegationImplementation {
  Hybrid = "Hybrid",
  Multisig = "Multisig"
}

interface WalletError {
  code: string;
  message: string;
  timestamp: Date;
  retryable: boolean;
}

type ModalState = "none" | "caveats" | "accountDetails" | "sendAsset" | "receiveAsset" | "swapAssets" | "passkey" | "delegationType";

const LoadingOverlay = ({ message, error }: { message: string; error: string | null }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="progressbar"
      aria-busy="true"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-black/70 p-8 rounded-2xl shadow-xl border border-amber-500/20 flex flex-col items-center text-white"
      >
        <motion.div
          animate={{
            rotate: 360,
            filter: ["drop-shadow(0 0 8px #f59e0b)", "drop-shadow(0 0 2px #f59e0b)"],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            filter: { duration: 1.5, repeat: Infinity, yoyo: true },
          }}
          className="mb-4 h-20 w-20"
        >
          <Sparkles className="h-full w-full text-amber-500" />
        </motion.div>
        <motion.p
          className="font-medium text-xl text-center"
          animate={{ opacity: [0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity, yoyo: true }}
        >
          {error ? "Retrying connection..." : message}
        </motion.p>
        <p className="text-gray-400 mt-2 text-center max-w-xs">
          {error 
            ? "Please wait while we restore your connection"
            : "Please wait while we securely process your request on the blockchain"
          }
        </p>
      </motion.div>
    </motion.div>
  );
};

export default function WalletPageClient(): React.ReactElement {
  const router = useRouter();
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { user } = useAuth();
  const { copy, hasCopied } = useClipboard();
  
  // Delegation implementation state
  const [delegationImplementation, setDelegationImplementation] = useState<DelegationImplementation>(DelegationImplementation.Hybrid);
  const [signers, setSigners] = useState<`0x${string}`[]>([]);
  const [threshold, setThreshold] = useState<number>(1);
  const [isDelegationTypeModalOpen, setIsDelegationTypeModalOpen] = useState(false);
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [delegationStatus, setDelegationStatus] = useState<DelegationStatus>(DelegationStatus.None);
  const [delegationError, setDelegationError] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<WalletError | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [smartAccounts, setSmartAccounts] = useState<SmartAccount[]>([]);
  const [delegationAccounts, setDelegationAccounts] = useState<DelegationAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<DelegationAccount | null>(null);
  const [sessionKey, setSessionKey] = useState<SessionKey | null>(null);
  const [passkey, setPasskey] = useState<PasskeyCredential | null>(null);
  const [isPasskeyRegistered, setIsPasskeyRegistered] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalState>("none");
  const [delegationLifecycle, setDelegationLifecycle] = useState({
    created: false,
    granted: false,
    redeemed: false,
    revoked: false,
  });
  const [animateCards, setAnimateCards] = useState(false);

  // Handle loading state - Moved declaration up
  const handleLoading = useCallback((isLoading: boolean, message: string = "", error: string | null = null) => {
    setIsLoading(isLoading);
    setLoadingMessage(message);
    setLoadingError(error);
  }, []);

  // Initialize bundler connection and monitor network
  useEffect(() => {
    let isInitializing = false;
    let timeoutId: NodeJS.Timeout;

    const initializeConnection = async () => {
      if (isInitializing || !isConnected || !address) return;
      isInitializing = true;

      try {
        handleLoading(true, "Initializing connection...", null);
        await connectBundler(address, chainId);
        const entryPoint = await getEntryPointContract(chainId);
        
        if (!entryPoint) {
          throw new Error("Unsupported network or entry point not found");
        }

        // Clear any existing errors
        setWalletError(null);
        setIsErrorDialogOpen(false);
        handleLoading(false);
        toast.success("Wallet connected successfully");
      } catch (error: any) {
        console.error("Connection initialization failed:", error);
        const errorMessage = error.message || "Failed to initialize connection";
        
        setWalletError({
          code: "INITIALIZATION_ERROR",
          message: errorMessage,
          timestamp: new Date(),
          retryable: true,
        });
        setIsErrorDialogOpen(true);
        handleLoading(false, "", errorMessage);
        toast.error(errorMessage);
      } finally {
        isInitializing = false;
      }
    };

    // Handle disconnected state
    if (!isConnected || !address) {
      setWalletError({
        code: "WALLET_DISCONNECTED",
        message: "Wallet is disconnected. Please connect your wallet to continue.",
        timestamp: new Date(),
        retryable: true,
      });
      setIsErrorDialogOpen(true);
      return;
    }

    // Initialize connection with debounce
    timeoutId = setTimeout(initializeConnection, 500);
    
    // Animate cards after successful connection
    const animationTimeout = setTimeout(() => setAnimateCards(true), 1000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(animationTimeout);
    };
  }, [isConnected, address, chainId, handleLoading]);

  // Create session key for delegation
  const createSessionKeyHandler = useCallback(async (): Promise<SessionKey> => {
    if (!address) throw new Error("Address not found");
    setIsLoading(true);
    try {
      const newSessionKey = await createSessionKey(address);
      setSessionKey(newSessionKey);
      toast.success("Session key created successfully");
      return newSessionKey;
    } catch (error) {
      console.error("Failed to create session key:", error);
      toast.error("Failed to create session key");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Register passkey for enhanced security
  const registerPasskey = useCallback(async (): Promise<void> => {
    if (!address) return;
    setIsLoading(true);
    try {
      const credential = await createPasskeyCredential(
        address || "user",
        user?.name || "BumbleBee User"
      );
      setPasskey(credential);
      setIsPasskeyRegistered(true);
      toast.success("Passkey registered successfully");
    } catch (error) {
      console.error("Failed to register passkey:", error);
      toast.error("Failed to register passkey");
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Create delegator account using MetaMask Gator Delegation Toolkit
  const createDelegatorAccount = useCallback(async (params: {
    delegator: `0x${string}`;
    delegate: `0x${string}`;
    sessionKey: string;
    passkey?: PasskeyCredential | null;
    caveats: DelegationCaveat[];
  }): Promise<DelegationResult> => {
    if (!address || !isConnected) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    handleLoading(true, "Creating delegator account...");

    try {
      // First create a session key if not exists
      const sessionKeyData = params.sessionKey ? { publicKey: params.sessionKey } : await createSessionKeyHandler();
      if (!sessionKeyData) throw new Error("Failed to create session key");

      // Create the smart account using MetaMask's delegation toolkit
      const smartAccountResult = await createMetaMaskSmartAccount({
        ownerAddress: address as `0x${string}`,
        deploySalt: `0x${crypto.randomUUID().replace(/-/g, '')}` as `0x${string}`, // Unique salt for each account
        implementation: delegationImplementation,
        signers: delegationImplementation === DelegationImplementation.Multisig ? signers : undefined,
        threshold: delegationImplementation === DelegationImplementation.Multisig ? threshold : undefined
      });

      if (!smartAccountResult?.address) {
        throw new Error("Failed to create smart account");
      }

      // Generate unique IDs
      const delegationId = `del_${crypto.randomUUID()}`;
      const accountId = `acc_${crypto.randomUUID()}`;

      // Create the delegation account object
      const newAccount: DelegationAccount = {
        id: accountId,
        delegationId,
        address: smartAccountResult.address,
        name: "AI Assistant Delegation",
        type: "Smart",
        balance: 0,
        createdAt: new Date(),
        status: "Active",
        implementation: delegationImplementation,
        delegationType: PermissionType.Custom,
        caveats: params.caveats,
        delegatedTo: params.delegate,
        expiresAt: calculateExpiryFromCaveats(params.caveats),
        sessionKey: 'id' in sessionKeyData && 'privateKey' in sessionKeyData ? 
          sessionKeyData as SessionKey : 
          {
            id: `sk-${crypto.randomUUID()}`,
            publicKey: sessionKeyData.publicKey,
            privateKey: `0x${Math.random().toString(16).substring(2, 66)}`,
            createdAt: new Date()
          },
        passkey: params.passkey,
        signers: delegationImplementation === DelegationImplementation.Multisig ? signers : undefined,
        threshold: delegationImplementation === DelegationImplementation.Multisig ? threshold : undefined
      };

      // Update state
      setDelegationAccounts(prev => [...prev, newAccount]);
      setSelectedAccount(newAccount);
      setDelegationLifecycle(prev => ({ ...prev, created: true }));
      setCurrentStep(2);

      // Show success message
      toast.success("Delegator account created successfully");

      return {
        delegation: { id: delegationId },
        smartAccount: { address: smartAccountResult.address },
        implementation: delegationImplementation
      };

    } catch (error: any) {
      console.error("Failed to create delegator account:", error);
      const errorMessage = error.message || "Failed to create delegator account";
      toast.error(errorMessage);
      setDelegationError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
      handleLoading(false);
    }
  }, [
    address,
    isConnected,
    chainId,
    delegationImplementation,
    signers,
    threshold,
    createSessionKeyHandler,
    handleLoading
  ]);

  // Handle creating a new account
  const handleCreateAccount = useCallback(async () => {
    if (!address || !isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // Create session key if not exists
      let sessionKeyData = sessionKey;
      if (!sessionKeyData) {
        sessionKeyData = await createSessionKeyHandler();
      }

      // Default caveats
      const defaultCaveats: DelegationCaveat[] = [
        {
          id: `caveat-${Date.now()}-1`,
          type: CaveatType.MaxAmount,
          value: "0.1",
          description: "Maximum transaction value of 0.1 ETH"
        },
        {
          id: `caveat-${Date.now()}-2`,
          type: CaveatType.TimeLimit,
          value: "86400", // 24 hours in seconds
          description: "Time limit of 24 hours"
        }
      ];

      // Create delegator account
      await createDelegatorAccount({
        delegator: address as `0x${string}`,
        delegate: "0x0000000000000000000000000000000000000000" as `0x${string}`, // Replace with actual AI assistant address
        sessionKey: 'publicKey' in sessionKeyData ? sessionKeyData.publicKey : '',
        passkey,
        caveats: defaultCaveats
      });

      // Open caveats modal for further configuration
      setActiveModal("caveats");

    } catch (error: any) {
      console.error("Failed to create account:", error);
      toast.error(error.message || "Failed to create account");
    }
  }, [
    address,
    isConnected,
    sessionKey,
    passkey,
    createSessionKeyHandler,
    createDelegatorAccount,
    setActiveModal
  ]);

  // Grant permissions with caveats
  const grantPermissions = useCallback(
    async (caveats: DelegationCaveat[]) => {
      if (!selectedAccount || !address) return;
      setIsLoading(true);
      try {
        if (isPasskeyRegistered && passkey) {
          await verifyPasskeyCredential(passkey);
        }
        
        // Mock user operation hash
        const userOpHash = `0x${Math.random().toString(16).substring(2, 10)}`;
        
        toast.loading("Granting permissions...", {
          duration: 5000,
        });
        
        // Mock transaction receipt
        const receipt = await new Promise<{ transactionHash: string; status: number }>((resolve) => {
          setTimeout(
            () =>
              resolve({
                transactionHash: `0x${Math.random().toString(16).substring(2, 8)}`,
                status: 1,
              }),
            3000
          );
        });
        
        if (receipt.status === 1) {
          setDelegationAccounts((prev) =>
            prev.map((acc) => (acc.id === selectedAccount.id ? { ...acc, caveats, status: "Active" } : acc))
          );
          setDelegationLifecycle((prev) => ({ ...prev, granted: true }));
          toast.success("Permissions granted successfully");
          setCurrentStep(3);
        }
      } catch (error) {
        console.error("Failed to grant permissions:", error);
        toast.error("Failed to grant permissions");
        setDelegationError("Failed to grant permissions");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedAccount, address, sessionKey, passkey, isPasskeyRegistered]
  );

  // Redeem permissions
  const redeemPermissionsHandler = useCallback(async () => {
    if (!selectedAccount || !address) return;
    setIsLoading(true);
    try {
      if (isPasskeyRegistered && passkey) {
        await verifyPasskeyCredential(passkey);
      }
      
      // Mock redemption
      const mockResponse = {
        transactionHash: `0x${Math.random().toString(16).substring(2, 8)}`,
        status: 1,
      };
      
      if (mockResponse.status === 1) {
        toast.success("Permissions redeemed successfully");
        setDelegationLifecycle((prev) => ({ ...prev, redeemed: true }));
        setCurrentStep(4);
      }
    } catch (error) {
      console.error("Failed to redeem permissions:", error);
      toast.error("Failed to redeem permissions");
      setDelegationError("Failed to redeem permissions");
    } finally {
      setIsLoading(false);
    }
  }, [selectedAccount, address]);

  // Revoke delegation
  const revokeDelegationHandler = useCallback(
    async () => {
      if (!address || !selectedAccount) return;
      setIsLoading(true);
      try {
        if (isPasskeyRegistered && passkey) {
          await verifyPasskeyCredential(passkey);
        }
        
        // Mock revocation
        setDelegationAccounts((prev) =>
          prev.map((acc) =>
            acc.id === selectedAccount.id
              ? { ...acc, status: "Inactive", revokedAt: new Date() }
              : acc
          )
        );
        setDelegationLifecycle((prev) => ({ ...prev, revoked: true }));
        toast.success("Delegation revoked successfully");
      } catch (error) {
        console.error("Failed to revoke delegation:", error);
        toast.error("Failed to revoke delegation");
      } finally {
        setIsLoading(false);
      }
    },
    [address]
  );

  // Track connection attempt state
  const isConnectingRef = useRef(false);
const connectionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Connect wallet function with improved error handling and network switching
  const connectWallet = useCallback(async () => {
    if (isLoading || isConnectingRef.current) return;
    isConnectingRef.current = true;
    handleLoading(true, "Connecting to MetaMask...", null);

    // Clear any existing timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }
    try {
      // Check if ethereum object exists
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error("MetaMask not installed");
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }).catch((error: any) => {
        // Handle user rejected request
        if (error.code === 4001) {
          throw new Error("Connection request rejected. Please approve the connection request in MetaMask.");
        }
        throw error;
      });
      
      // Check if we got the account
      if (!accounts || !accounts[0]) {
        throw new Error("No accounts found. Please unlock your MetaMask wallet.");
      }
      
      // Get the network/chain ID
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });
      
      // Check if we're on the correct network (Sepolia = 0xaa36a7)
      if (chainId !== '0xaa36a7') {
        toast.info("Switching to Sepolia network...");
        // Switch to Sepolia
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
          });
          // Get updated chainId after network switch
          const updatedChainId = await window.ethereum.request({ 
            method: 'eth_chainId' 
          });
          if (updatedChainId !== '0xaa36a7') {
            throw new Error("Failed to switch to Sepolia network. Please try again.");
          }
        } catch (switchError: any) {
          // If the chain hasn't been added to MetaMask
          if (switchError.code === 4902) {
            toast.info("Adding Sepolia network to MetaMask...");
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://rpc.sepolia.org '],
                  blockExplorerUrls: ['https://sepolia.etherscan.io ']
                }]
              });
              // Verify the network was added and switched
              const finalChainId = await window.ethereum.request({ 
                method: 'eth_chainId' 
              });
              if (finalChainId !== '0xaa36a7') {
                throw new Error("Failed to add Sepolia network. Please try again or add it manually.");
              }
            } catch (addError) {
              console.error('Failed to add network:', addError);
              throw new Error("Failed to add Sepolia network. Please add it manually in MetaMask.");
            }
          } else {
            console.error('Failed to switch network:', switchError);
            throw new Error("Failed to switch to Sepolia network. Please try again or switch manually.");
          }
        }
      }
      
      // Connect to bundler with the confirmed account and chain
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const currentAccounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (!currentAccounts || !currentAccounts[0]) {
        throw new Error("Account access lost. Please reconnect your wallet.");
      }
      
      await connectBundler(currentAccounts[0] as `0x${string}`, parseInt(currentChainId, 16));
      const entryPoint = await getEntryPointContract(parseInt(currentChainId, 16));
      console.log("entry point ::-",entryPoint)
      if (!entryPoint) throw new Error("Unsupported network");
      toast.success("Connected to wallet successfully");
      
      // Clear any wallet errors
      setWalletError(null);
      return {
        account: currentAccounts[0] as `0x${string}`,
        chainId: parseInt(currentChainId, 16)
      };
    } catch (error: any) {
      console.error('Failed to connect:', error);
      const errorMessage = error.message || 'Failed to connect to MetaMask';
      toast.error(errorMessage);
      setWalletError({
        code: "WALLET_CONNECTION_ERROR",
        message: errorMessage,
        timestamp: new Date(),
        retryable: true,
      });
      throw error;
    } finally {
      handleLoading(false);
      // Reset connection state after a delay to prevent rapid retries
      connectionTimeoutRef.current = setTimeout(() => {
        isConnectingRef.current = false;
      }, 2000); // 2 second cooldown
    }
  }, [isLoading, handleLoading]);

  // Handle error retry
  const handleErrorRetry = useCallback(async () => {
    if (!walletError?.retryable) return;
    connectWallet();
  }, [walletError, connectWallet]);

  // Open delegation type selection modal
  const openDelegationTypeModal = useCallback(() => {
    setIsDelegationTypeModalOpen(true);
  }, []);

  // Handle delegation type selection
  const handleDelegationTypeSelect = useCallback((type: DelegationImplementation) => {
    setDelegationImplementation(type);
    setIsDelegationTypeModalOpen(false);
    
    // If Multisig is selected, open caveats modal to configure signers
    if (type === DelegationImplementation.Multisig) {
      // Default to current address as first signer
      if (address && signers.length === 0) {
        setSigners([address as `0x${string}`]);
      }
    }
    
    // Create session key if not already created
    if (!sessionKey) {
      createSessionKeyHandler().catch(console.error);
    }
    
    // Open caveats modal after selecting delegation type
    setActiveModal("caveats");
  }, [address, signers, sessionKey, createSessionKeyHandler]);
  
  // Add a signer to the multisig account
  const addSigner = useCallback((signerAddress: string) => {
    if (!signerAddress || !signerAddress.startsWith('0x')) return;
    
    setSigners(prev => {
      if (prev.includes(signerAddress as `0x${string}`)) return prev;
      return [...prev, signerAddress as `0x${string}`];
    });
  }, []);
  
  // Remove a signer from the multisig account
  const removeSigner = useCallback((signerAddress: string) => {
    setSigners(prev => prev.filter(addr => addr !== signerAddress));
    
    // Adjust threshold if needed
    setThreshold(prev => Math.min(prev, signers.length - 1 || 1));
  }, [signers.length]);
  
  // Update threshold for multisig account
  const updateThreshold = useCallback((value: number) => {
    setThreshold(Math.min(value, signers.length));
  }, [signers.length]);
  
  // UI Components
  const StepContent = () => {
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
    // Store event listener references
    const listenerRefs = useRef<{
      accountsChanged: (accounts: string[]) => void;
      chainChanged: (chainId: string) => void;
      disconnect: (error: any) => void;
    }>( {
      accountsChanged: () => {},
      chainChanged: () => {},
      disconnect: () => {},
    });
    
    // Check if MetaMask is installed
    useEffect(() => {
      const checkMetaMask = async () => {
        const isInstalled = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
        setIsMetaMaskInstalled(isInstalled);
      };
      checkMetaMask();
    }, []);
    
    // Auto-connect and set up event listeners
    useEffect(() => {
      // Only attempt to connect if not already connected or there's an error
      const attemptConnection = async () => {
        if ((walletError || !isConnected) && !isLoading) {
          try {
            await connectWallet();
          } catch (error) {
            console.log('Connection attempt failed, will retry when user initiates');
          }
        }
      };
      
      // Attempt initial connection
      attemptConnection();
      
      // Set up event listeners for MetaMask
      const setupMetaMaskListeners = () => {
        if (typeof window !== 'undefined' && window.ethereum) {
          // Create event listeners
          const accountsChangedListener = (accounts: string[]) => {
            if (accounts.length === 0) {
              toast.info("Wallet disconnected");
              setWalletError({
                code: "WALLET_DISCONNECTED",
                message: "Wallet disconnected. Please connect your wallet to continue.",
                timestamp: new Date(),
                retryable: true,
              });
            } else {
              toast.info("Account changed. Refreshing...");
              setTimeout(() => window.location.reload(), 1500);
            }
          };
          
          const chainChangedListener = (chainId: string) => {
            if (chainId !== '0xaa36a7') {
              toast.info("Network changed. Please use Sepolia testnet.");
              connectWallet().catch(console.error);
            } else {
              toast.success("Connected to Sepolia testnet");
              setTimeout(() => window.location.reload(), 1500);
            }
          };
          
          const disconnectListener = (error: any) => {
            console.log('MetaMask disconnect event:', error);
            toast.info("Wallet disconnected");
            setWalletError({
              code: "WALLET_DISCONNECTED",
              message: "Wallet disconnected. Please connect your wallet to continue.",
              timestamp: new Date(),
              retryable: true,
            });
          };
          
          // Remove existing listeners if they exist
          if (listenerRefs.current.accountsChanged) {
            window.ethereum.removeListener('accountsChanged', listenerRefs.current.accountsChanged);
          }
          if (listenerRefs.current.chainChanged) {
            window.ethereum.removeListener('chainChanged', listenerRefs.current.chainChanged);
          }
          if (listenerRefs.current.disconnect) {
            window.ethereum.removeListener('disconnect', listenerRefs.current.disconnect);
          }
          
          // Add new listeners and store references
          window.ethereum.on('accountsChanged', accountsChangedListener);
          window.ethereum.on('chainChanged', chainChangedListener);
          window.ethereum.on('disconnect', disconnectListener);
          
          // Store references for cleanup
          listenerRefs.current = {
            accountsChanged: accountsChangedListener,
            chainChanged: chainChangedListener,
            disconnect: disconnectListener,
          };
        }
      };
      
      setupMetaMaskListeners();
      
      // Cleanup listeners on unmount
      return () => {
        if (typeof window !== 'undefined' && window.ethereum) {
          window.ethereum.removeListener('accountsChanged', listenerRefs.current.accountsChanged);
          window.ethereum.removeListener('chainChanged', listenerRefs.current.chainChanged);
          window.ethereum.removeListener('disconnect', listenerRefs.current.disconnect);
        }
      };
    }, [walletError, isLoading, isConnected, connectWallet]);

    if (!isMetaMaskInstalled) {
      return (
        <div className="p-6 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-2" />
          <h3 className="text-xl font-semibold text-gray-800">MetaMask Required</h3>
          <p className="text-gray-600 text-center max-w-md">
            Please install MetaMask to use this application.
          </p>
          <a
            href="https://metamask.io/download/ "
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 35 33" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path d="M32.9582 1L19.8241 10.7183L22.2541 5.09833L32.9582 1Z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.04183 1L15.0589 10.809L12.7459 5.09833L2.04183 1Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M28.2036 23.5466L24.7063 28.8825L32.2155 30.9315L34.3825 23.6646L28.2036 23.5466Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M0.631531 23.6646L2.78452 30.9315L10.2937 28.8825L6.79645 23.5466L0.631531 23.6646Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.86452 14.5149L7.76654 17.6507L15.2097 17.9687L14.9458 9.92754L9.86452 14.5149Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M25.1265 14.5149L20.0093 9.83755L19.8274 17.9687L27.2615 17.6507L25.1265 14.5149Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.2937 28.8825L14.7638 26.7155L10.8937 23.7285L10.2937 28.8825Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.2272 26.7155L24.7063 28.8825L24.0973 23.7285L20.2272 26.7155Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Install MetaMask
          </a>
        </div>
      );
    }
    
    if (walletError) {
      return (
        <div className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-2" />
            <h3 className="text-xl font-semibold text-gray-800 mt-4">
              {walletError.message}
            </h3>
            <p className="text-gray-600 text-center max-w-md mt-2">
              {walletError.code === "WALLET_DISCONNECTED" 
                ? "Please connect your wallet to continue." 
                : "There was an issue connecting to your wallet."}
            </p>
            {walletError.retryable && (
              <button
                onClick={handleErrorRetry}
                className="mt-4 inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </button>
            )}
          </div>
          <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-200 max-w-md">
            <h4 className="font-medium text-amber-800 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
              Connection Issue
            </h4>
            <p className="text-amber-700 text-sm mt-2">{walletError.message}</p>
            <Button 
              onClick={() => connectWallet()} 
              className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Connecting...
                </>
              ) : (
                "Retry Connection"
              )}
            </Button>
          </div>
        </div>
      );
    }
    
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-semibold text-gray-900">Create Delegation Account</h3>
            <p className="text-gray-600">
              Create a secure delegation account to allow your AI assistant to perform actions on your behalf.
            </p>
            <div className="space-y-4">
              <motion.div
                className="flex items-center gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <KeyRound className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-gray-700">Session key will be generated automatically</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => setActiveModal("passkey")}
              >
                <ShieldCheck className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-700">Optional: Register a passkey for enhanced security</span>
              </motion.div>
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={handleCreateAccount}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                  disabled={isLoading || !isConnected}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Delegator Account
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-semibold text-gray-900">Configure Permissions</h3>
            <p className="text-gray-600">
              Set caveats for what your AI assistant can do with your delegation account.
            </p>
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setActiveModal("caveats")}
                  className="w-full justify-between bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                >
                  <span>Configure Caveats</span>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </motion.div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Current Caveats</h4>
                <div className="space-y-2">
                  {selectedAccount?.caveats && selectedAccount.caveats.length > 0 ? (
                    selectedAccount.caveats.map((caveat, idx) => (
                      <motion.div
                        key={idx}
                        className="text-sm text-gray-700 p-2 bg-white rounded-md border border-gray-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <span className="font-medium text-purple-600">{caveat.type}:</span>{" "}
                        {JSON.stringify(caveat.value)}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No caveats configured</p>
                  )}
                </div>
              </div>
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={() => {
                    if (selectedAccount) {
                      const sampleCaveats: DelegationCaveat[] = selectedAccount.caveats.length > 0
                        ? selectedAccount.caveats
                        : [
                            { id: `caveat-${Date.now()}-1`, type: CaveatType.MaxAmount, value: "0.1 ETH", description: "Maximum value per transaction" },
                            { id: `caveat-${Date.now()}-2`, type: CaveatType.TimeLimit, value: "24 hours", description: "Time window for transactions" },
                          ];
                      grantPermissions(sampleCaveats);
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Granting Permissions...
                    </>
                  ) : (
                    "Grant Permissions"
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-semibold text-gray-900">Redeem Permissions</h3>
            <p className="text-gray-600">
              Allow your AI assistant to perform actions according to the configured caveats.
            </p>
            <motion.div
              className="bg-green-50 p-4 rounded-lg border border-green-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <p className="text-sm text-green-700 flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
                Your AI assistant can now perform transactions within the limits you've set.
              </p>
            </motion.div>
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={redeemPermissionsHandler}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Redeeming Permissions...
                  </>
                ) : (
                  "Redeem Permissions"
                )}
              </Button>
            </motion.div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-semibold text-gray-900">Delegation Complete</h3>
            <p className="text-gray-600">
              Your delegation is active and ready to use. You can revoke it at any time.
            </p>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    when: "beforeChildren",
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="bg-white rounded-lg p-4 flex flex-col items-center justify-center text-center border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => setActiveModal("sendAsset")}
              >
                <div className="bg-amber-100 p-3 rounded-full mb-3">
                  <ChevronRight className="h-6 w-6 text-amber-500" />
                </div>
                <h4 className="font-medium text-gray-900">Send Assets</h4>
                <p className="text-xs text-gray-500 mt-1">Transfer tokens to another address</p>
              </motion.div>
              <motion.div
                className="bg-white rounded-lg p-4 flex flex-col items-center justify-center text-center border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => setActiveModal("receiveAsset")}
              >
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <Wallet className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-medium text-gray-900">Receive Assets</h4>
                <p className="text-xs text-gray-500 mt-1">Get your deposit addresses</p>
              </motion.div>
              <motion.div
                className="bg-white rounded-lg p-4 flex flex-col items-center justify-center text-center border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => setActiveModal("swapAssets")}
              >
                <div className="bg-purple-100 p-3 rounded-full mb-3">
                  <RefreshCw className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="font-medium text-gray-900">Swap Assets</h4>
                <p className="text-xs text-gray-500 mt-1">Exchange between different tokens</p>
              </motion.div>
            </motion.div>
            <motion.div
              className="space-y-4 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="destructive"
                onClick={() => revokeDelegationHandler()}
                className="w-full bg-red-600 hover:bg-red-700 transition-colors"
              >
                Revoke Delegation
              </Button>
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Update modal state handling
  const handleModalChange = useCallback((modalType: ModalState) => {
    setActiveModal(modalType);
  }, []);

  // Update DelegationCaveatsModal usage
  const handleCaveatsSave = useCallback((caveats: DelegationCaveat[]) => {
    if (selectedAccount) {
      grantPermissions(caveats);
      handleModalChange("none");
    }
  }, [selectedAccount, grantPermissions]);

  // Update LoadingOverlay to prevent re-renders
  const loadingOverlay = useMemo(() => {
    if (!isLoading) return null;
    return (
      <LoadingOverlay 
        message={loadingMessage || "Processing blockchain transaction..."} 
        error={loadingError || delegationError}
      />
    );
  }, [isLoading, loadingMessage, loadingError, delegationError]);

  // Update dialog state handling
  const handleDialogChange = useCallback((open: boolean, modalType: ModalState) => {
    if (!open) {
      handleModalChange("none");
    }
  }, [handleModalChange]);

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 relative">
      
      
      {/* Global Loading Overlay */}
      <AnimatePresence>
        {loadingOverlay}
      </AnimatePresence>
      
      {/* Main Content */}
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">BumbleBee Smart Wallet</h1>
          <p className="text-gray-600 mt-2">Securely delegate transactions to your AI assistant with fine-grained permissions</p>
        </div>
        
        {/* Step Indicator */}
        <div className="flex justify-between items-center w-full max-w-3xl mx-auto mb-8">
          {[
            { step: 1, label: "Create Account", completed: delegationLifecycle.created },
            { step: 2, label: "Configure Permissions", completed: delegationLifecycle.granted },
            { step: 3, label: "Redeem Permissions", completed: delegationLifecycle.redeemed },
            { step: 4, label: "Complete", completed: delegationLifecycle.revoked || currentStep === 4 },
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full 
                ${step.completed ? 'bg-green-500' : currentStep === step.step ? 'bg-blue-500' : 'bg-gray-200'}
                text-white font-medium shadow-sm`}>
                {step.completed ? <Check size={16} /> : step.step}
              </div>
              <span className="text-sm mt-2 text-gray-700 font-medium">{step.label}</span>
            </div>
          ))}
        </div>
        
        {/* Step Content */}
        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-gray-900">Delegation Setup</CardTitle>
            <CardDescription className="text-gray-600">
              Follow the steps to set up your secure delegation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepContent />
          </CardContent>
        </Card>
        
        {/* Modals */}
        <DelegationCaveatsModal
          isOpen={activeModal === "caveats"}
          onOpenChange={(open: boolean) => handleDialogChange(open, "caveats")}
          onSave={handleCaveatsSave}
        />
        <AccountDetailsModal
          isOpen={activeModal === "accountDetails"}
          onOpenChange={(open: boolean) => handleDialogChange(open, "accountDetails")}
          account={selectedAccount}
        />
        <SendAssetModal
          isOpen={activeModal === "sendAsset"}
          onOpenChange={(open: boolean) => handleDialogChange(open, "sendAsset")}
          asset={null}
        />
        <ReceiveAssetModal
          isOpen={activeModal === "receiveAsset"}
          onOpenChange={(open: boolean) => handleDialogChange(open, "receiveAsset")}
          asset={null}
          walletAddress={address || "0x0"}
        />
        <SwapAssetsModal
          isOpen={activeModal === "swapAssets"}
          onOpenChange={(open: boolean) => handleDialogChange(open, "swapAssets")}
          fromAsset={null}
        />
        
        {/* Update Passkey Dialog */}
        <PasskeyDialog
          isOpen={activeModal === "passkey"}
          onClose={() => handleModalChange("none")}
          onRegister={registerPasskey}
          isLoading={isLoading}
          isRegistered={isPasskeyRegistered}
        />
        
        {/* Error Dialog */}
        <Dialog 
          open={isErrorDialogOpen} 
          onOpenChange={(open) => setIsErrorDialogOpen(open)}
        >
          <DialogContent className="sm:max-w-md rounded-xl bg-gradient-to-b from-red-900 to-black border-red-500/20">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                Wallet Error
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                {walletError?.message || "An error occurred with your wallet connection"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm text-red-300">
                <p className="mb-2">
                  <strong>Error Code:</strong> {walletError?.code || "UNKNOWN_ERROR"}
                </p>
                <p className="mb-2">
                  <strong>Time:</strong> {walletError?.timestamp?.toLocaleTimeString() || new Date().toLocaleTimeString()}
                </p>
                {walletError?.retryable && (
                  <p>
                    This error is temporary. You can try reconnecting your wallet.
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                {walletError?.retryable && (
                  <Button
                    onClick={() => {
                      setIsErrorDialogOpen(false);
                      // Trigger reconnection logic here if needed
                    }}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Connection
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsErrorDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}

// This function will be defined inside the component