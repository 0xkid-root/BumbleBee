"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import {
  PasskeyCredential,
  registerPasskey as createPasskeyCredential,
  verifyPasskeyAuthentication,
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
} from "lucide-react";

// Types
import type { Asset } from "@/lib/store/use-wallet-store";
import {
  Network,
  PermissionType,
  Caveat,
} from "@/lib/bumblebee-sdk";

interface SmartAccount {
  id: string;
  address: string;
  name: string;
  type: "EOA" | "Smart" | "Delegate";
  balance: number;
  createdAt: Date;
  status: "Active" | "Pending" | "Inactive";
}

interface DelegationAccount extends SmartAccount {
  delegationId: string;
  delegationType: PermissionType;
  caveats: DelegationCaveat[];
  delegatedTo: string;
  expiresAt?: Date;
  sessionKey: SessionKey;
  passkey?: PasskeyCredential;
  revokedAt?: Date;
}

interface WalletError {
  code: string;
  message: string;
  timestamp: Date;
  retryable: boolean;
}

type ModalState = "none" | "caveats" | "accountDetails" | "sendAsset" | "receiveAsset" | "swapAssets" | "passkey";

export default function WalletPageClient(): React.ReactElement {
  const router = useRouter();
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { user } = useAuth();
  const { copy, hasCopied } = useClipboard();

  // State
  const [isLoading, setIsLoading] = useState(false);
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

  // Initialize bundler connection and monitor network
  useEffect(() => {
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

    const initializeConnection = async () => {
      try {
        await connectBundler(address, chainId);
        const entryPoint = await getEntryPointContract(chainId);
        if (!entryPoint) throw new Error("Unsupported network");

        toast.success("Wallet connected successfully");
      } catch (error) {
        console.error("Failed to connect to bundler:", error);
        setWalletError({
          code: "NETWORK_ERROR",
          message: "Failed to connect to network. Please check your network settings.",
          timestamp: new Date(),
          retryable: true,
        });
        setIsErrorDialogOpen(true);
        toast.error("Failed to connect to network");
      }
    };

    initializeConnection();
    const timeout = setTimeout(() => setAnimateCards(true), 500);
    return () => clearTimeout(timeout);
  }, [isConnected, address, chainId]);

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
      const credential = await createPasskeyCredential();
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

  // Create delegator account
  const createDelegatorAccount = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      let currentSessionKey = sessionKey ?? (await createSessionKeyHandler());

      const userOpHash = await sendUserOperation({
        sender: address,
        sessionKey: currentSessionKey.publicKey,
        passkey: isPasskeyRegistered && passkey ? passkey : undefined,
      });

      toast.loading("Submitting user operation...", {
        duration: 5000,
      });

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
        const newAccount: DelegationAccount = {
          id: `da-${Math.random().toString(36).substring(2, 9)}`,
          address: `0x${Math.random().toString(36).substring(2, 14)}`,
          name: "AI Assistant Delegation",
          type: "Delegate",
          balance: 0,
          createdAt: new Date(),
          status: "Active",
          delegationId: `del-${Math.random().toString(36).substring(2, 9)}`,
          delegationType: PermissionType.Custom,
          caveats: [],
          delegatedTo: "BumbleBee AI Assistant",
          sessionKey: currentSessionKey,
        };

        setDelegationAccounts((prev) => [...prev, newAccount]);
        setSelectedAccount(newAccount);
        setDelegationLifecycle((prev) => ({ ...prev, created: true }));
        toast.success("Delegator account created successfully");
        setCurrentStep(2);
      }
    } catch (error) {
      console.error("Failed to create delegator account:", error);
      toast.error("Failed to create delegator account");
      setDelegationError("Failed to create delegator account");
    } finally {
      setIsLoading(false);
    }
  }, [address, sessionKey, passkey, isPasskeyRegistered, createSessionKeyHandler]);

  // Grant permissions with caveats
  const grantPermissions = useCallback(
    async (caveats: DelegationCaveat[]) => {
      if (!selectedAccount || !address) return;

      setIsLoading(true);
      try {
        if (isPasskeyRegistered && passkey) {
          await verifyPasskeyAuthentication(passkey.id);
        }

        const userOpHash = await sendUserOperation({
          sender: address,
          target: selectedAccount.address as `0x${string}`,
          value: BigInt(0),
          data: `0xgrantPermissions(${JSON.stringify(caveats.map(c => ({ type: c.type, params: c.value }))})`,
          sessionKey: sessionKey?.publicKey,
          passkey: isPasskeyRegistered ? passkey : undefined,
        });

        toast.loading("Granting permissions...", {
          duration: 5000,
        });

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
      if (isPasskeyRegistered) {
        await verifyPasskeyAuthentication(passkey!.id);
      }

      await redeemPermissions({
        delegator: address,
        delegate: selectedAccount.address as `0x${string}`,
        sessionKey: sessionKey?.publicKey,
        passkey: isPasskeyRegistered ? passkey : undefined,
      });

      toast.success("Permissions redeemed successfully");
      setDelegationLifecycle((prev) => ({ ...prev, redeemed: true }));
      setCurrentStep(4);
    } catch (error) {
      console.error("Failed to redeem permissions:", error);
      toast.error("Failed to redeem permissions");
      setDelegationError("Failed to redeem permissions");
    } finally {
      setIsLoading(false);
    }
  }, [selectedAccount, address, sessionKey, passkey, isPasskeyRegistered]);

  // Revoke delegation
  const revokeDelegationHandler = useCallback(
    async (delegationId: string) => {
      if (!address) return;

      setIsLoading(true);
      try {
        if (isPasskeyRegistered) {
          await verifyPasskeyAuthentication(passkey!.id);
        }

        await revokeDelegationToolkit({
          delegator: address,
          delegationId,
          sessionKey: sessionKey?.publicKey,
          passkey: isPasskeyRegistered ? passkey : undefined,
        });

        setDelegationAccounts((prev) =>
          prev.map((acc) =>
            acc.delegationId === delegationId
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
    [address, sessionKey, passkey, isPasskeyRegistered]
  );

  // Handle error retry
  const handleErrorRetry = useCallback(async () => {
    if (!walletError?.retryable) return;

    setIsLoading(true);
    try {
      switch (walletError.code) {
        case "WALLET_DISCONNECTED":
          await connectBundler(address!, chainId);
          break;
        case "NETWORK_ERROR":
          const entryPoint = await getEntryPointContract(chainId);
          if (entryPoint) {
            setWalletError(null);
            setIsErrorDialogOpen(false);
          }
          break;
        default:
          await connectBundler(address!, chainId);
      }

      toast.success("Connection restored successfully");
    } catch (error) {
      toast.error("Failed to reconnect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [walletError, address, chainId]);

  // UI Components
  const StepContent = () => {
    if (walletError) {
      return (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h3 className="text-xl font-semibold text-white">Connection Required</h3>
          <p className="text-gray-300">
            Please connect your wallet to proceed with delegation setup.
          </p>
          <Button
            onClick={handleErrorRetry}
            disabled={isLoading || !walletError.retryable}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Reconnecting...
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
        </motion.div>
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
            <h3 className="text-xl font-semibold text-white">Create Delegator Account</h3>
            <p className="text-gray-300">
              Create a hybrid delegator account that combines your EOA with session keys and passkey security.
            </p>
            <div className="space-y-4">
              <motion.div
                className="flex items-center gap-2 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <KeyRound className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-gray-300">Session key will be generated automatically</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => setActiveModal("passkey")}
              >
                <ShieldCheck className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-300">Optional: Register a passkey for enhanced security</span>
              </motion.div>
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={createDelegatorAccount}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium"
                  disabled={isLoading}
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
            <h3 className="text-xl font-semibold text-white">Configure Permissions</h3>
            <p className="text-gray-300">
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
                  className="w-full justify-between bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-white/20 text-white"
                >
                  <span>Configure Caveats</span>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </motion.div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-medium text-white mb-2">Current Caveats</h4>
                <div className="space-y-2">
                  {selectedAccount?.caveats && selectedAccount.caveats.length > 0 ? (
                    selectedAccount.caveats.map((caveat, idx) => (
                      <motion.div
                        key={idx}
                        className="text-sm text-gray-300 p-2 bg-white/5 rounded-md"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <span className="font-medium text-purple-400">{caveat.type}:</span>{" "}
                        {JSON.stringify(caveat.params)}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No caveats configured</p>
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
                            { type: "MaxValue", value: "0.1 ETH", description: "Maximum value per transaction" },
                            { type: "TimeLimit", value: "24 hours", description: "Time window for transactions" },
                          ];
                      grantPermissions(sampleCaveats);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium"
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
            <h3 className="text-xl font-semibold text-white">Redeem Permissions</h3>
            <p className="text-gray-300">
              Allow your AI assistant to perform actions according to the configured caveats.
            </p>
            <motion.div
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-lg border border-green-500/30"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <p className="text-sm text-green-300 flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-green-400" />
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
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium"
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
            <h3 className="text-xl font-semibold text-white">Delegation Complete</h3>
            <p className="text-gray-300">
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
                className="bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-white/20 cursor-pointer"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => setActiveModal("sendAsset")}
              >
                <div className="bg-amber-500/20 p-3 rounded-full mb-3">
                  <ChevronRight className="h-6 w-6 text-amber-500" />
                </div>
                <h4 className="font-medium text-white">Send Assets</h4>
                <p className="text-xs text-gray-400 mt-1">Transfer tokens to another address</p>
              </motion.div>
              <motion.div
                className="bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-white/20 cursor-pointer"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => setActiveModal("receiveAsset")}
              >
                <div className="bg-blue-500/20 p-3 rounded-full mb-3">
                  <Wallet className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-medium text-white">Receive Assets</h4>
                <p className="text-xs text-gray-400 mt-1">Get your deposit addresses</p>
              </motion.div>
              <motion.div
                className="bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-white/20 cursor-pointer"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => setActiveModal("swapAssets")}
              >
                <div className="bg-purple-500/20 p-3 rounded-full mb-3">
                  <RefreshCw className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="font-medium text-white">Swap Assets</h4>
                <p className="text-xs text-gray-400 mt-1">Exchange between different tokens</p>
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
                onClick={() => selectedAccount && revokeDelegationHandler(selectedAccount.delegationId)}
                className="w-full bg-red-600 hover:bg-red-700"
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

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 relative bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* Honeycomb Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <pattern id="honeycomb" width="56" height="100" patternUnits="userSpaceOnUse">
            <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" stroke="white" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#honeycomb)" />
        </svg>
      </div>

      {/* Global Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="progressbar"
            aria-busy="true"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
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
                className="font-medium text-xl"
                animate={{ opacity: [0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity, yoyo: true }}
              >
                {delegationError ? "Retrying..." : "Processing blockchain transaction..."}
              </motion.p>
              <p className="text-gray-400 mt-2 text-center max-w-xs">
                Please wait while we securely process your request on the blockchain
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Error Dialog */}
      <AnimatePresence>
        {isErrorDialogOpen && walletError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
              <DialogContent className="sm:max-w-md rounded-xl bg-gradient-to-b from-gray-900 to-black border border-red-500/30">
                <DialogHeader>
                  <DialogTitle className="text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Connection Error
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">{walletError.message}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-300">
                    <p className="mb-2">Error Code: {walletError.code}</p>
                    <p>Timestamp: {walletError.timestamp.toLocaleString()}</p>
                  </div>
                  {walletError.retryable && (
                    <Button
                      onClick={handleErrorRetry}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Retrying...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry Connection
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setIsErrorDialogOpen(false)}
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
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
        <SectionTitle title="BumbleBee Smart Wallet" subtitle="Securely delegate transactions to your AI assistant with fine-grained permissions" />

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          steps={[
            { label: "Create Account", completed: delegationLifecycle.created },
            { label: "Configure Permissions", completed: delegationLifecycle.granted },
            { label: "Redeem Permissions", completed: delegationLifecycle.redeemed },
            { label: "Complete", completed: delegationLifecycle.revoked || currentStep === 4 },
          ]}
        />

        {/* Step Content */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Delegation Setup</CardTitle>
            <CardDescription className="text-gray-400">
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
          onClose={() => setActiveModal("none")}
          onSave={(caveats) => {
            if (selectedAccount) {
              grantPermissions(caveats);
            }
          }}
        />

        <AccountDetailsModal
          isOpen={activeModal === "accountDetails"}
          onClose={() => setActiveModal("none")}
          account={selectedAccount}
        />

        <SendAssetModal
          isOpen={activeModal === "sendAsset"}
          onClose={() => setActiveModal("none")}
          account={selectedAccount}
        />

        <ReceiveAssetModal
          isOpen={activeModal === "receiveAsset"}
          onClose={() => setActiveModal("none")}
          account={selectedAccount}
        />

        <SwapAssetsModal
          isOpen={activeModal === "swapAssets"}
          onClose={() => setActiveModal("none")}
          account={selectedAccount}
        />

        {/* Passkey Registration Modal */}
        <Dialog open={activeModal === "passkey"} onOpenChange={(open) => setActiveModal(open ? "passkey" : "none")}>
          <DialogContent className="sm:max-w-md rounded-xl bg-gradient-to-b from-gray-900 to-black border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Register Passkey</DialogTitle>
              <DialogDescription className="text-gray-300">
                Register a passkey for enhanced security on your delegation account
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300">
                <p className="mb-2">
                  <strong>What is a passkey?</strong>
                </p>
                <p className="mb-2">
                  A passkey is a secure hardware-based authentication method that uses biometric data or device credentials to verify your identity.
                </p>
                <p>
                  Registering a passkey adds an additional layer of security to your delegation account.
                </p>
              </div>
              <Button
                onClick={registerPasskey}
                disabled={isLoading || isPasskeyRegistered}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Registering...
                  </>
                ) : isPasskeyRegistered ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Passkey Registered
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Register Passkey
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveModal("none")}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}