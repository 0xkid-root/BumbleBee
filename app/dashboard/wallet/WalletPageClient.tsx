"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { MockAsset, Asset } from "@/types/wallet";
import { Asset as WalletAsset } from "@/lib/store/use-wallet-store";
import { publicClient } from "@/wagmi.config";
import {
  Implementation,
  toMetaMaskSmartAccount,
  createDelegation,
  createCaveatBuilder,
  getDelegationHashOffchain,
  type MetaMaskSmartAccount,
  type DelegationStruct,
} from "@metamask/delegation-toolkit";
import { createWalletClient, custom, toHex, zeroAddress, type Hex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { randomBytes } from "crypto";
import { FACTORY_CONTRACT_ADDRESS, CREATE_TOKEN_SELECTOR } from "@/constants";
import { bundler, pimlicoClient } from "@/lib/services/bundler";
import { getDelegationStorageClient } from "@/delegationStorage";
import { ConnectWalletCard } from "@/components/wallet/connect-wallet-card";
import { AssetCard } from "@/components/wallet/asset-card";
import { SendAssetModal } from "@/components/wallet/send-asset-modal";
import { ReceiveAssetModal } from "@/components/wallet/receive-asset-modal";
import { SwapAssetsModal } from "@/components/wallet/swap-assets-modal";
import { useWalletStore } from "@/lib/store/use-wallet-store";
import { SectionTitle } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Copy,
  Check,
  Sparkles,
  ArrowUpDown,
  ArrowUp,
  MessageSquare,
  Settings,
  ChevronDown,
  PieChart,
  Wallet,
  Bell,
  Zap,
  Lightbulb,
  ArrowDown,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useClipboard } from "@/lib/hooks/use-clipboard";
import { ConnectWalletModal } from "@/components/wallet/connect-wallet-modal";
import { QRCodeSVG } from "qrcode.react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const cardHoverVariants = {
  hover: {
    y: -5,
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.3 },
  },
};

const gradientVariants = {
  initial: { opacity: 0.8 },
  animate: {
    opacity: 1,
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      backgroundPosition: { duration: 4, repeat: Infinity, ease: "linear" },
      opacity: { duration: 0.5 },
    },
  },
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Mock data for AI insights
const mockInsights = [
  {
    id: 1,
    title: "Portfolio Rebalance",
    description:
      "Your portfolio is heavily weighted in ETH (80%). Consider diversifying to reduce risk.",
    impact: "high",
    type: "suggestion",
  },
  {
    id: 2,
    title: "Gas Optimization",
    description:
      "Current gas prices are high. Consider scheduling non-urgent transactions for later.",
    impact: "medium",
    type: "alert",
  },
  {
    id: 3,
    title: "Yield Opportunity",
    description: "Your USDC could earn 5.2% APY in the Aave protocol.",
    impact: "medium",
    type: "opportunity",
  },
  {
    id: 4,
    title: "Smart Savings",
    description:
      "Based on your transaction patterns, you could save ~$12/month on gas fees by batching transfers.",
    impact: "low",
    type: "suggestion",
  },
];

// Mock data for recurring payments
const mockRecurringPayments = [
  {
    id: 1,
    name: "Crypto News Premium",
    amount: "10 USDC",
    frequency: "Monthly",
    nextPayment: "May 20, 2025",
    icon: "📰",
  },
  {
    id: 2,
    name: "NFT Marketplace Pro",
    amount: "0.01 ETH",
    frequency: "Monthly",
    nextPayment: "May 15, 2025",
    icon: "🖼️",
  },
];

// Mock data for AI chat messages
const initialMessages = [
  {
    role: "assistant",
    content:
      "Hello! I'm your AI financial assistant. How can I help you with your crypto today?",
  },
];

// Define a minimal interface for Ethereum Provider
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
}

export default function WalletPageClient(): React.ReactElement {
  const router = useRouter();
  // Track component loading state
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { isConnected: wagmiConnected, address: wagmiAddress } = useAccount();
  const {
    isConnected,
    address,
    assets: walletAssets,
    connectWallet,
  } = useWalletStore();

  // Clear connection error when wallet connects
  useEffect(() => {
    if (isConnected || wagmiConnected) {
      setConnectionError(null);
    }
  }, [isConnected, wagmiConnected]);

  // Delegation state
  const [delegatorAccount, setDelegatorAccount] = useState<
    MetaMaskSmartAccount<Implementation> | undefined
  >(undefined);
  const [aiDelegateAccount, setAiDelegateAccount] = useState<
    MetaMaskSmartAccount<Implementation> | undefined
  >(undefined);
  const [delegation, setDelegation] = useState<DelegationStruct | undefined>(
    undefined
  );
  const [isCreatingAccounts, setIsCreatingAccounts] = useState(false);
  const [isCreatingDelegation, setIsCreatingDelegation] = useState(false);
  const [delegationComplete, setDelegationComplete] = useState(false);
  const [delegationError, setDelegationError] = useState<string | null>(null);
  const [isDelegationModalOpen, setIsDelegationModalOpen] = useState(false);
  const { copy, hasCopied } = useClipboard();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [portfolioScore, setPortfolioScore] = useState(78);
  const [showAISettings, setShowAISettings] = useState(false);

  // Simulate AI analyzing portfolio
  // Create a unique salt for account creation
  const createSalt = () => toHex(randomBytes(8));

  // Initialize accounts when user connects
  useEffect(() => {
    if (wagmiConnected && wagmiAddress) {
      // Clear previous state if user changes
      setDelegatorAccount(undefined);
      setAiDelegateAccount(undefined);
      setDelegation(undefined);
      setDelegationComplete(false);
      setDelegationError(null);
    }
  }, [wagmiAddress, wagmiConnected]);

  // Create delegator and AI delegate accounts
  const setupAccounts = async () => {
    if (!wagmiConnected || !wagmiAddress) {
      setDelegationError(
        "Wallet not connected. Please connect your wallet first."
      );
      return;
    }

    setIsLoading(true);
    setIsCreatingAccounts(true);
    setDelegationError(null);

    try {
      console.group("=== Setting up Delegation Accounts ===");

      // For delegator account, we'll use the connected wallet
      const provider = (window as Window & { ethereum?: EthereumProvider })
        .ethereum;
      if (!provider) {
        throw new Error(
          "No provider found. Please make sure MetaMask is installed and connected."
        );
      }

      console.log("Creating wallet client for address:", wagmiAddress);
      const walletClient = createWalletClient({
        transport: custom(provider),
        account: wagmiAddress as `0x${string}`,
      });

      // Create delegator smart account
      console.log("Creating delegator smart account...");
      const delegatorSmartAccount = await toMetaMaskSmartAccount({
        client: publicClient,
        implementation: Implementation.Hybrid,
        deployParams: [wagmiAddress, [], [], []],
        deploySalt: createSalt(),
        signatory: { walletClient },
      });
      console.log("Delegator account created:", delegatorSmartAccount.address);

      console.log("Deploying delegator account...");

      const { fast: fees } = await pimlicoClient.getUserOperationGasPrice();

      if (!delegatorSmartAccount.isDeployed) {
        const receipt = await bundler.sendUserOperation({
          account: delegatorSmartAccount,
          calls: [{ to: zeroAddress }],
          ...fees,
        });

        console.log("Delegator account deployed:", receipt);
      }

      // Create AI delegate account with a burner key
      console.log("Creating AI delegate account...");
      const aiPrivateKey = generatePrivateKey(); // need to store this somewhere
      const aiAccount = privateKeyToAccount(aiPrivateKey);

      console.log("AI account:", aiAccount);
      console.log("Private key:", aiPrivateKey);

      const aiSmartAccount = await toMetaMaskSmartAccount({
        client: publicClient,
        implementation: Implementation.Hybrid,
        deployParams: [delegatorSmartAccount.address, [], [], []],
        deploySalt: "0x1231245", // need to store this somewhere to be able to access this wallet later
        signatory: { account: aiAccount },
      });
      console.log("AI delegate account created:", aiSmartAccount.address);

      // Store the AI account private key securely
      sessionStorage.setItem("aiDelegatePrivateKey", aiPrivateKey);
      console.log("AI private key stored in session storage");

      setDelegatorAccount(delegatorSmartAccount);
      setAiDelegateAccount(aiSmartAccount);
      console.groupEnd();
    } catch (error: unknown) {
      console.error("Error setting up accounts:", error);
      setDelegationError(
        `Failed to set up accounts: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.groupEnd();
    } finally {
      setIsCreatingAccounts(false);
      setIsLoading(false);
    }
  };

  // Create delegation with caveats
  const createDelegationWithCaveats = async () => {
    if (!delegatorAccount || !aiDelegateAccount) {
      setDelegationError(
        "Smart accounts not set up. Please set up accounts first."
      );
      return;
    }

    setIsLoading(true);
    setIsCreatingDelegation(true);
    setDelegationError(null);

    try {
      console.group("=== Creating Delegation with Caveats ===");

      // Add diagnostic logging
      console.log(
        "FACTORY_CONTRACT_ADDRESS raw value:",
        FACTORY_CONTRACT_ADDRESS
      );
      console.log(
        "FACTORY_CONTRACT_ADDRESS type:",
        typeof FACTORY_CONTRACT_ADDRESS
      );
      console.log(
        "FACTORY_CONTRACT_ADDRESS length:",
        FACTORY_CONTRACT_ADDRESS?.length
      );
      console.log(
        "Starts with 0x?",
        FACTORY_CONTRACT_ADDRESS?.startsWith("0x")
      );
      console.log(
        "Address matches format?",
        /^0x[a-fA-F0-9]{40}$/.test(FACTORY_CONTRACT_ADDRESS || "")
      );

      // Build caveats that restrict what the AI can do
      console.log("Building caveats...");
      const caveats = createCaveatBuilder(delegatorAccount.environment)
        .addCaveat("allowedTargets", [
          FACTORY_CONTRACT_ADDRESS as `0x${string}`,
        ])
        .addCaveat("valueLte", BigInt(0))
        .addCaveat("allowedMethods", [CREATE_TOKEN_SELECTOR])
        .build();

      console.log("Caveats created:", {
        allowedTargets: [FACTORY_CONTRACT_ADDRESS],
        valueLte: "0",
        allowedMethods: [CREATE_TOKEN_SELECTOR],
      });

      // Create root delegation with a unique salt
      console.log("Creating root delegation...");
      const rootDelegation = await createDelegation({
        from: delegatorAccount.address as Hex,
        to: aiDelegateAccount.address as Hex,
        caveats,
      });

      // Manually set the salt after creation to avoid TypeScript errors
      // @ts-ignore - We need to set the salt directly as the createDelegation options don't include it
      rootDelegation.salt = toHex(randomBytes(8)) as Hex;

      // Sign the delegation using the delegator account
      console.log("Signing delegation...");
      const signature = await delegatorAccount.signDelegation({
        delegation: rootDelegation,
      });

      const signedDelegation = {
        ...rootDelegation,
        signature,
      } as any;

      console.log("Delegation signed successfully");

      // Store delegation in the delegation storage service
      try {
        const delegationStorageClient = getDelegationStorageClient();

        // Store the delegation in the delegation storage service
        try {
          console.log("Storing delegation in storage service...");
          const client = await delegationStorageClient;
          const storedDelegation = await client.storeDelegation(
            signedDelegation as any
          );
          console.log(
            "Delegation stored in storage service successfully:",
            storedDelegation
          );
        } catch (storageError: any) {
          console.error(
            "Failed to store delegation in storage service:",
            storageError
          );
          setDelegationError(
            "Warning: Remote storage failed, but proceeding with local storage"
          );
        }
      } catch (error: any) {
        console.error("Error in delegation storage:", error);
      }

      // Store delegation info in session storage
      const delegationHash = getDelegationHashOffchain(signedDelegation);
      const delegationInfo = {
        delegationHash,
        delegatorAddress: delegatorAccount.address,
        delegateAddress: aiDelegateAccount.address,
        timestamp: Date.now(),
      };

      sessionStorage.setItem("delegationInfo", JSON.stringify(delegationInfo));
      sessionStorage.setItem("delegation", JSON.stringify(signedDelegation));
      console.log("Delegation info stored in session storage");

      setDelegation(signedDelegation);

      setDelegationComplete(true);
      console.groupEnd();
    } catch (error: unknown) {
      console.error("Error creating delegation:", error);
      setDelegationError(
        `Failed to create delegation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.groupEnd();
    } finally {
      setIsCreatingDelegation(false);
      setIsLoading(false);
    }
  };

  // Check if delegation exists in session storage
  const checkExistingDelegation = () => {
    const delegationInfo = sessionStorage.getItem("delegationInfo");
    const delegationData = sessionStorage.getItem("delegation");

    if (delegationInfo && delegationData) {
      try {
        const parsedInfo = JSON.parse(delegationInfo);
        const parsedDelegation = JSON.parse(delegationData);

        setDelegation(parsedDelegation);
        setDelegationComplete(true);
        return true;
      } catch (error) {
        console.error("Error parsing delegation from session storage:", error);
      }
    }
    return false;
  };

  // Handle delegation setup
  const handleDelegationSetup = async () => {
    setIsDelegationModalOpen(true);
    if (!checkExistingDelegation()) {
      await setupAccounts();
    }
  };

  // Handle delegation creation
  const handleCreateDelegation = async () => {
    if (!delegatorAccount || !aiDelegateAccount) {
      await setupAccounts();
    }
    await createDelegationWithCaveats();
  };

  const handleAnalyzePortfolio = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAIInsights(true);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    setMessages((prev) => [...prev, { role: "user", content: inputMessage }]);

    setTimeout(() => {
      let response;
      if (inputMessage.toLowerCase().includes("swap")) {
        response =
          "I can help you swap tokens. Would you like me to find the best rate for a specific pair?";
      } else if (inputMessage.toLowerCase().includes("gas")) {
        response =
          "Current gas prices are around 25 gwei. Based on historical data, prices should be lower in about 3 hours.";
      } else if (inputMessage.toLowerCase().includes("portfolio")) {
        response =
          "Your portfolio has grown 3.2% this week, outperforming BTC by 0.8%.";
      } else {
        response =
          "Can you provide more details about what you'd like to know?";
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    }, 1000);

    setInputMessage("");
  };

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      setConnectionError(null);
      setIsConnectWalletModalOpen(true);

      if (typeof window.ethereum === "undefined") {
        throw new Error(
          "MetaMask is not installed. Please install MetaMask to connect your wallet."
        );
      }

      await connectWallet();
    } catch (error) {
      console.error("Wallet connection error:", error);
      setConnectionError(
        error instanceof Error ? error.message : "Failed to connect wallet"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseConnectWalletModal = () => {
    setIsConnectWalletModalOpen(false);
    setConnectionError(null);
  };

  const handleSendAsset = (asset: Asset) => {
    // Convert the asset type to ensure compatibility with the wallet store Asset type
    const compatibleAsset = {
      id: typeof asset.id === "number" ? asset.id.toString() : asset.id,
      name: asset.name,
      symbol: asset.symbol,
      amount: asset.balance || asset.amount || 0,
      value: asset.usdValue || asset.value || 0,
      price:
        asset.price ||
        (asset.balance && asset.usdValue ? asset.usdValue / asset.balance : 0),
      change24h: asset.change24h || 0,
      logo: asset.icon || asset.logo || "",
    } as unknown as WalletAsset;
    setSelectedAsset(compatibleAsset);
    setIsSendModalOpen(true);
  };

  const handleReceiveAsset = (asset: Asset) => {
    // Convert the asset type to ensure compatibility with the wallet store Asset type
    const compatibleAsset = {
      id: typeof asset.id === "number" ? asset.id.toString() : asset.id,
      name: asset.name,
      symbol: asset.symbol,
      amount: asset.balance || asset.amount || 0,
      value: asset.usdValue || asset.value || 0,
      price:
        asset.price ||
        (asset.balance && asset.usdValue ? asset.usdValue / asset.balance : 0),
      change24h: asset.change24h || 0,
      logo: asset.icon || asset.logo || "",
    } as unknown as WalletAsset;
    setSelectedAsset(compatibleAsset);
    setIsReceiveModalOpen(true);
  };

  const handleSwapAssets = (asset: Asset) => {
    // Convert the asset type to ensure compatibility with the wallet store Asset type
    const compatibleAsset = {
      id: typeof asset.id === "number" ? asset.id.toString() : asset.id,
      name: asset.name,
      symbol: asset.symbol,
      amount: asset.balance || asset.amount || 0,
      value: asset.usdValue || asset.value || 0,
      price:
        asset.price ||
        (asset.balance && asset.usdValue ? asset.usdValue / asset.balance : 0),
      change24h: asset.change24h || 0,
      logo: asset.icon || asset.logo || "",
    } as unknown as WalletAsset;
    setSelectedAsset(compatibleAsset);
    setIsSwapModalOpen(true);
  };

  const handleCloseSendModal = () => {
    setIsSendModalOpen(false);
    setSelectedAsset(null);
  };

  const handleCloseReceiveModal = () => {
    setIsReceiveModalOpen(false);
    setSelectedAsset(null);
  };

  const handleCloseSwapModal = () => {
    setIsSwapModalOpen(false);
    setSelectedAsset(null);
  };

  // Demo wallet address for QR demo
  const demoWalletAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-gradient-to-br from-gray-900 to-blue-900 relative">
      {/* Global loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="relative h-16 w-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-primary border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
              <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-r-transparent border-b-primary border-l-transparent animate-spin animation-delay-300"></div>
            </div>
            <p className="text-white font-medium">
              {isCreatingAccounts
                ? "Setting up smart accounts..."
                : isCreatingDelegation
                ? "Creating delegation..."
                : "Loading..."}
            </p>
          </div>
        </div>
      )}

      {/* Error display */}
      {delegationError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/20 border border-destructive text-white p-4 rounded-lg mb-4 flex items-start"
        >
          <div className="flex-shrink-0 mr-3 mt-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-destructive"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{delegationError}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => setDelegationError(null)}
            >
              Dismiss
            </Button>
          </div>
        </motion.div>
      )}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative"
      >
        <motion.div variants={itemVariants}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <SectionTitle
              title="Bumblebee Wallet"
              subtitle="Smart financial management powered by AI"
              className="text-left"
              titleClassName="text-2xl md:text-3xl flex items-center text-white"
              subtitleClassName="text-sm md:text-base max-w-none text-left text-gray-300"
            />
            {isConnected && (
              <motion.div
                className="flex items-center bg-white/10 backdrop-blur-md p-2 rounded-lg text-sm border border-white/20"
                variants={fadeInVariants}
              >
                <div className="hidden md:flex items-center mr-2">
                  <Avatar className="h-6 w-6 mr-2 bg-gradient-to-r from-blue-500 to-purple-500">
                    <span className="text-xs text-white">
                      {address ? address.slice(0, 2) : ""}
                    </span>
                  </Avatar>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-white mr-1">
                    {address
                      ? `${address.slice(0, 6)}...${address.slice(-4)}`
                      : ""}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copy(address || "")}
                    className="h-6 w-6 rounded-full text-white"
                  >
                    {hasCopied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copy address</span>
                  </Button>
                </div>
              </motion.div>
            )}

            {isConnected && (
              <motion.div
                className="flex items-center bg-white/10 backdrop-blur-md p-2 rounded-lg text-sm border border-white/20"
                variants={fadeInVariants}
              >
                <div className="hidden md:flex items-center mr-2">
                  <Avatar className="h-6 w-6 mr-2 bg-gradient-to-r from-blue-500 to-purple-500">
                    <span className="text-xs text-white">
                      {address?.slice(0, 2)}
                    </span>
                  </Avatar>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-white mr-1">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copy(address || "")}
                    className="h-6 w-6 rounded-full text-white"
                  >
                    {hasCopied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copy address</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {!isConnected ? (
          <>
            <motion.div variants={itemVariants}>
              <ConnectWalletCard
                onConnect={async () => {
                  await handleConnectWallet();
                }}
              />
            </motion.div>


          </>
        ) : (
          <>
            <motion.div variants={itemVariants}>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-6 bg-white/10 backdrop-blur-md border border-white/20">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-2 text-white"
                  >
                    <PieChart className="h-4 w-4" />
                    <span className="hidden md:inline">Overview</span>
                  </TabsTrigger>
                 
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Smart Wallet Setup Card */}
                    {isConnected && !delegationComplete && (
                      <motion.div variants={itemVariants} className="mb-8">
                        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-blue-400" />
                              Smart Wallet Setup
                            </CardTitle>
                            <CardDescription className="text-blue-200">
                              Set up your AI-powered smart wallet to enable
                              advanced features
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="bg-blue-500/20 p-3 rounded-full">
                                  <Wallet className="h-6 w-6 text-blue-300" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-white font-medium">
                                    Create Smart Account
                                  </h3>
                                  <p className="text-sm text-blue-200">
                                    Deploy a smart contract wallet linked to
                                    your EOA
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  className="bg-blue-500/20 border-blue-500/30 text-white hover:bg-blue-500/30"
                                  onClick={setupAccounts}
                                  disabled={
                                    isCreatingAccounts ||
                                    delegatorAccount !== undefined
                                  }
                                >
                                  {delegatorAccount ? "Done" : "Setup"}
                                </Button>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="bg-purple-500/20 p-3 rounded-full">
                                  <Sparkles className="h-6 w-6 text-purple-300" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-white font-medium">
                                    Create AI Delegation
                                  </h3>
                                  <p className="text-sm text-blue-200">
                                    Enable AI assistant to perform actions on
                                    your behalf
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  className="bg-purple-500/20 border-purple-500/30 text-white hover:bg-purple-500/30"
                                  onClick={handleCreateDelegation}
                                  disabled={
                                    isCreatingDelegation ||
                                    !delegatorAccount ||
                                    delegationComplete
                                  }
                                >
                                  {delegationComplete ? "Done" : "Setup"}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                   

                  </div>
                  <motion.div variants={cardHoverVariants} whileHover="hover">
                    <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                      <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                        <CardTitle className="text-lg text-white">
                          Recent Transactions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            {
                              type: "Received ETH",
                              date: "May 10, 2025 • 14:23",
                              amount: "+0.15 ETH",
                              usd: "$421.32",
                              icon: ArrowDown,
                              color: "green",
                            },
                            {
                              type: "Swapped ETH for USDC",
                              date: "May 9, 2025 • 09:13",
                              amount: "-0.3 ETH",
                              usd: "+842.65 USDC",
                              icon: ArrowUpDown,
                              color: "blue",
                            },
                          ].map((tx, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-2 hover:bg-white/10 rounded-lg"
                            >
                              <div className="flex items-center">
                                <div
                                  className={`bg-${tx.color}-100/20 p-2 rounded-full mr-3`}
                                >
                                  {tx.icon === ArrowDown ? (
                                    <ArrowDown className="h-4 w-4 text-green-300" />
                                  ) : (
                                    <ArrowUpDown className="h-4 w-4 text-blue-300" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {tx.type}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {tx.date}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-white">
                                  {tx.amount}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {tx.usd}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-amber-800">
                          AI Delegation
                        </CardTitle>
                        <CardDescription className="text-amber-600">
                          Enable AI-powered transactions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-amber-500" />
                          <div className="text-sm text-amber-700">
                            {delegationComplete
                              ? "AI delegation is active! Your AI assistant can now create tokens on your behalf."
                              : "Delegate token creation capabilities to your AI assistant"}
                          </div>
                        </div>
                        <Button
                          variant={delegationComplete ? "outline" : "default"}
                          className={
                            delegationComplete
                              ? "text-amber-600 border-amber-300 mt-2"
                              : "bg-amber-600 hover:bg-amber-700 text-white mt-2"
                          }
                          onClick={handleDelegationSetup}
                          disabled={isCreatingAccounts || isCreatingDelegation}
                        >
                          {isCreatingAccounts || isCreatingDelegation ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="mr-2"
                              >
                                <Sparkles className="h-4 w-4" />
                              </motion.div>
                              {isCreatingAccounts
                                ? "Setting up accounts..."
                                : "Creating delegation..."}
                            </>
                          ) : delegationComplete ? (
                            "View Delegation Details"
                          ) : (
                            "Setup AI Delegation"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>

            <ConnectWalletModal
              isOpen={isConnectWalletModalOpen}
              onClose={handleCloseConnectWalletModal}
              onConnect={async () => {
                await handleConnectWallet();
              }}
            />

            {/* AI Delegation Modal */}
            <Dialog
              open={isDelegationModalOpen}
              onOpenChange={(open) => setIsDelegationModalOpen(open)}
            >
              <DialogContent className="sm:max-w-md rounded-xl">
                <DialogHeader>
                  <DialogTitle>AI Delegation</DialogTitle>
                  <DialogDescription>
                    {delegationComplete
                      ? "Your AI delegation is active and ready to use"
                      : "Delegate token creation capabilities to your AI assistant"}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  {delegationError && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
                      {delegationError}
                    </div>
                  )}

                  {delegationComplete ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                          <Check className="h-5 w-5 text-green-600" />
                          Delegation Active
                        </div>
                        <p className="text-sm text-green-700 mb-2">
                          Your AI assistant can now create tokens on your behalf
                          using your delegated permissions.
                        </p>
                        <div className="text-xs text-green-600 space-y-1">
                          <div>
                            <strong>Delegator:</strong>{" "}
                            {delegatorAccount?.address.slice(0, 6)}...
                            {delegatorAccount?.address.slice(-4)}
                          </div>
                          <div>
                            <strong>Delegate:</strong>{" "}
                            {aiDelegateAccount?.address.slice(0, 6)}...
                            {aiDelegateAccount?.address.slice(-4)}
                          </div>
                          <div>
                            <strong>Permissions:</strong> Create tokens only
                            (ERC-20)
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsDelegationModalOpen(false)}
                      >
                        Close
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                        <p className="mb-2">
                          <strong>What is AI Delegation?</strong>
                        </p>
                        <p className="mb-2">
                          AI Delegation allows your AI assistant to perform
                          specific actions on your behalf, such as creating new
                          tokens.
                        </p>
                        <p>
                          Your permissions are strictly limited to the actions
                          you approve, and you can revoke access at any time.
                        </p>
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleCreateDelegation}
                        disabled={isCreatingAccounts || isCreatingDelegation}
                      >
                        {isCreatingAccounts || isCreatingDelegation ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="mr-2"
                            >
                              <Sparkles className="h-4 w-4" />
                            </motion.div>
                            {isCreatingAccounts
                              ? "Setting up accounts..."
                              : "Creating delegation..."}
                          </>
                        ) : (
                          "Create AI Delegation"
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsDelegationModalOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            {selectedAsset && (
              <>
                <SendAssetModal
                  isOpen={isSendModalOpen}
                  onClose={handleCloseSendModal}
                  asset={selectedAsset as unknown as WalletAsset}
                />
                <ReceiveAssetModal
                  isOpen={isReceiveModalOpen}
                  onClose={handleCloseReceiveModal}
                  asset={selectedAsset as unknown as WalletAsset}
                  walletAddress={address || ""}
                />
                <SwapAssetsModal
                  isOpen={isSwapModalOpen}
                  onClose={handleCloseSwapModal}
                  fromAsset={selectedAsset as unknown as WalletAsset}
                />
              </>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
