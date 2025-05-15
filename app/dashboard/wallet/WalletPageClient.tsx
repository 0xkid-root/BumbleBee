"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
// Import both Asset types to handle compatibility
import type { Asset } from "@/lib/store/use-wallet-store";
import type { Asset as WalletComponentAsset } from "@/types/wallet";
import { useWalletStore } from "@/lib/store/use-wallet-store";
import { ConnectWalletCard } from "@/components/wallet/connect-wallet-card";
import { AssetCard } from "@/components/wallet/asset-card";
import { SendAssetModal } from "@/components/wallet/send-asset-modal";
import { ReceiveAssetModal } from "@/components/wallet/receive-asset-modal";
import { SwapAssetsModal } from "@/components/wallet/swap-assets-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Copy,
  Check,
  Sparkles,
  ArrowUpDown,
  ArrowDown,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useClipboard } from "@/lib/hooks/use-clipboard";

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

export default function WalletPageClient(): React.ReactElement {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { isConnected: wagmiConnected, address: wagmiAddress } = useAccount();
  const {
    isConnected,
    address,
    assets: walletAssets,
    connectWallet,
  } = useWalletStore();

  // Delegation state
  const [isDelegationModalOpen, setIsDelegationModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  // Helper function to adapt store Asset to component Asset
  const adaptAsset = (asset: Asset | null): WalletComponentAsset | null => {
    if (!asset) return null;
    return asset as unknown as WalletComponentAsset;
  };
  const [delegationComplete, setDelegationComplete] = useState(false);
  const [delegationError, setDelegationError] = useState<string | null>(null);

  const { copy, hasCopied } = useClipboard();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModalModals();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Clear errors on successful connection
  useEffect(() => {
    if (isConnected || wagmiConnected) {
      setConnectionError(null);
    }
  }, [isConnected, wagmiConnected]);

  // Check existing delegation in session storage
  const checkExistingDelegation = useCallback(() => {
    const delegationInfo = sessionStorage.getItem("delegationInfo");
    const delegationData = sessionStorage.getItem("delegation");

    if (delegationInfo && delegationData) {
      try {
        JSON.parse(delegationInfo);
        JSON.parse(delegationData);
        setDelegationComplete(true);
        return true;
      } catch (error) {
        console.error("Failed to parse delegation data:", error);
      }
    }

    return false;
  }, []);

  // Setup smart accounts
  const setupAccounts = async () => {
    if (!wagmiConnected || !wagmiAddress) {
      setDelegationError("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setDelegationError(null);

    try {
      console.log("Setting up delegator and AI delegate accounts...");
      // Simulate account creation or call actual SDK
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Accounts created successfully.");

      setDelegationComplete(false); // Reset before creating new delegation
    } catch (err) {
      console.error("Failed to create smart accounts:", err);
      setDelegationError("Failed to create smart accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  // Create delegation
  const createDelegationWithCaveats = async () => {
    if (!wagmiConnected || !wagmiAddress) {
      setDelegationError("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setDelegationError(null);

    try {
      console.log("Creating delegation with caveats...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Delegation created.");

      setDelegationComplete(true);
    } catch (err) {
      console.error("Failed to create delegation:", err);
      setDelegationError("Failed to create delegation.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const closeModalModals = () => {
    setIsDelegationModalOpen(false);
    setIsSendModalOpen(false);
    setIsReceiveModalOpen(false);
    setIsSwapModalOpen(false);
    setSelectedAsset(null);
  };

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      setConnectionError(null);
      await connectWallet();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect wallet.";
      setConnectionError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleOpenSendModal = (asset: Asset) => {
    handleSelectAsset(asset);
    setIsSendModalOpen(true);
  };

  const handleOpenReceiveModal = (asset: Asset) => {
    handleSelectAsset(asset);
    setIsReceiveModalOpen(true);
  };

  const handleOpenSwapModal = (asset: Asset) => {
    handleSelectAsset(asset);
    setIsSwapModalOpen(true);
  };

  const handleDelegationSetup = async () => {
    setIsDelegationModalOpen(true);
    if (!checkExistingDelegation()) {
      await setupAccounts();
    }
  };

  const handleCreateDelegation = async () => {
    await createDelegationWithCaveats();
  };

  // Sample transactions
  const recentTransactions = [
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
  ];

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 relative">
      {/* Global Loading Overlay */}
      {isLoading && (
        <div
          role="progressbar"
          aria-busy="true"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-card p-6 rounded-lg shadow-xl flex flex-col items-center text-white">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-4 h-16 w-16"
            >
              <Sparkles className="h-full w-full text-primary" />
            </motion.div>
            <p className="font-medium">
              {delegationError ? "Retrying..." : "Processing..."}
            </p>
          </div>
        </div>
      )}

      {/* Connection Error */}
      {connectionError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/20 border border-destructive text-white p-4 rounded-lg mb-4 flex items-start"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-5 w-5 text-destructive mr-3 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{connectionError}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => setConnectionError(null)}
              aria-label="Dismiss error message"
            >
              Dismiss
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <SectionTitle
            title="Bumblebee Wallet"
            subtitle="Smart financial management powered by AI"
            titleClassName="text-2xl md:text-3xl text-amber-500"
            subtitleClassName="text-sm md:text-base text-gray-300"
          />

          {isConnected && (
            <div className="flex items-center bg-white/10 backdrop-blur-md p-2 rounded-lg text-sm border border-white/20">
              <span className="text-sm font-medium text-white mr-1">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => address && copy(address)}
                className="h-6 w-6 text-white"
              >
                {hasCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span className="sr-only">Copy address</span>
              </Button>
            </div>
          )}
        </div>

        {!isConnected ? (
          <ConnectWalletCard onConnect={handleConnectWallet} />
        ) : (
          <>
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <CardTitle className="text-lg text-white">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 hover:bg-white/10 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 bg-${tx.color}-100/20`}>
                          {tx.icon === ArrowDown ? (
                            <ArrowDown className="h-4 w-4 text-green-300" />
                          ) : (
                            <ArrowUpDown className="h-4 w-4 text-blue-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{tx.type}</p>
                          <p className="text-xs text-gray-400">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{tx.amount}</p>
                        <p className="text-xs text-gray-400">{tx.usd}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-amber-800">AI Delegation</CardTitle>
                <CardDescription className="text-amber-600">
                  Enable AI-powered transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <div className="text-sm text-amber-700">
                    {delegationComplete
                      ? "AI delegation is active! Your AI assistant can now create tokens."
                      : "Delegate token creation capabilities to your AI assistant"}
                  </div>
                </div>
                <Button
                  className={
                    delegationComplete
                      ? "text-amber-600 border-amber-300 mt-2"
                      : "bg-amber-600 hover:bg-amber-700 text-white mt-2"
                  }
                  onClick={handleDelegationSetup}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      {delegationComplete ? "Updating..." : "Setting up..."}
                    </>
                  ) : delegationComplete ? (
                    "View Delegation Details"
                  ) : (
                    "Setup AI Delegation"
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </motion.div>

      {/* Modals */}
      <Dialog open={isDelegationModalOpen} onOpenChange={setIsDelegationModalOpen}>
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
                    Your AI assistant can now create tokens on your behalf.
                  </p>
                </div>
                <Button variant="outline" onClick={() => setIsDelegationModalOpen(false)}>
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
                    AI Delegation allows your AI assistant to perform specific actions on your
                    behalf, such as creating new tokens.
                  </p>
                  <p>
                    Your permissions are strictly limited to the actions you approve, and you can
                    revoke access at any time.
                  </p>
                </div>
                <Button onClick={handleCreateDelegation} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Creating delegation...
                    </>
                  ) : (
                    "Create AI Delegation"
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsDelegationModalOpen(false)}>
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
            onClose={() => setIsSendModalOpen(false)}
            asset={selectedAsset as any}
          />
          <ReceiveAssetModal
            isOpen={isReceiveModalOpen}
            onClose={() => setIsReceiveModalOpen(false)}
            asset={selectedAsset as any}
            walletAddress={address || ""}
          />
          <SwapAssetsModal
            isOpen={isSwapModalOpen}
            onClose={() => setIsSwapModalOpen(false)}
            fromAsset={selectedAsset}
          />
        </>
      )}
    </div>
  );
}

// Section Title Component
function SectionTitle({
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
}: {
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <div className="text-left">
      <h1 className={titleClassName}>{title}</h1>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
    </div>
  );
}