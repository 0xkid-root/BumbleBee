"use client";
import { useAuth } from "@/hooks/useAuth";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import useDelegatorSmartAccount from "@/hooks/useDelegatorSmartAccount";
import { deploySmartAccount } from "@/lib/services/account";
import {
  paymasterClient,
  bundler,
  pimlicoClient,
  initializeBundler,
} from "@/lib/services/bundler";
import { zeroAddress } from "viem";
import type { Hex } from "viem";

import { generatePrivateKey } from "viem/accounts";
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
  ArrowUpDown,
  Check,
} from "lucide-react";
import { MetaMaskSmartAccount } from "@metamask/delegation-toolkit";

const LoadingOverlay = ({
  message,
  error,
}: {
  message: string;
  error: string | null;
}) => {
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
            filter: [
              "drop-shadow(0 0 8px #f59e0b)",
              "drop-shadow(0 0 2px #f59e0b)",
            ],
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
            : "Please wait while we securely process your request on the blockchain"}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default function WalletPageClient(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage] = useState<string>("");
  const [loadingError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [walletError, setWalletError] = useState<{
    message: string;
    retryable: boolean;
  } | null>(null);
  const { smartAccount } = useDelegatorSmartAccount();
  console.log(smartAccount, "smartAccount");
  const [delegateWallet, setDelegateWallet] = useState<Hex>("0x");

  const { isConnected, address, chainId, connectWallet } = useAuth();

  console.log(isConnected, address, chainId, "isConnected");

  useEffect(() => {
    if (chainId) {
      initializeBundler(chainId);
    }
  }, [chainId]);

  const handleErrorRetry = useCallback(() => {
    // Placeholder for retry logic
  }, []);

  const onHandleSmartAccount = async () => {
    if (!smartAccount) return;
    setIsLoading(true);
    const { fast: fee } = await pimlicoClient!.getUserOperationGasPrice();

    const userOperationHash = await bundler!.sendUserOperation({
      account: smartAccount,
      calls: [
        {
          to: zeroAddress,
        },
      ],
      paymaster: paymasterClient,
      ...fee,
    });
    console.log("userOperationHash", userOperationHash);

    const { receipt } = await bundler!.waitForUserOperationReceipt({
      hash: userOperationHash,
    });

    console.log(receipt);
    const privateKey = generatePrivateKey();
    setDelegateWallet(privateKey);
    setIsLoading(false);
    setCurrentStep(2);
  };

  const StepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-semibold text-gray-900">
              Create Delegation Account
            </h3>
            <p className="text-gray-600">
              Create a secure delegation account to allow your AI assistant to
              perform actions on your behalf.
            </p>
            <div className="space-y-4">
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={async () => {
                    await onHandleSmartAccount(); // Ensure the function is awaited
                    setCurrentStep(2); // Move to the next step after completion
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" /> Creating
                      Account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" /> Create Delegator
                      Account
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
            <h3 className="text-xl font-semibold text-gray-900">
              Configure Permissions
            </h3>
            <p className="text-gray-600">
              Set caveats for what your AI assistant can do with your delegation
              account.
            </p>
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="outline"
                  onClick={() => {}}
                  className="w-full justify-between bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                >
                  <span>Configure Caveats</span>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </motion.div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Current Caveats
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">No caveats configured</p>
                </div>
              </div>
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={() => setCurrentStep(3)}
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
            <h3 className="text-xl font-semibold text-gray-900">
              Redeem Permissions
            </h3>
            <p className="text-gray-600">
              Allow your AI assistant to perform actions according to the
              configured caveats.
            </p>
            <motion.div
              className="bg-green-50 p-4 rounded-lg border border-green-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <p className="text-sm text-green-700 flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
                Your AI assistant can now perform transactions within the limits
                you've set.
              </p>
            </motion.div>
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={() => setCurrentStep(4)}
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
            <h3 className="text-xl font-semibold text-gray-900">
              Delegation Complete
            </h3>
            <p className="text-gray-600">
              Your delegation is active and ready to use. You can revoke it at
              any time.
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
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => {}}
              >
                <div className="bg-amber-100 p-3 rounded-full mb-3">
                  <ChevronRight className="h-6 w-6 text-amber-500" />
                </div>
                <h4 className="font-medium text-gray-900">Send Assets</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Transfer tokens to another address
                </p>
              </motion.div>
              <motion.div
                className="bg-white rounded-lg p-4 flex flex-col items-center justify-center text-center border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => {}}
              >
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <Wallet className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-medium text-gray-900">Receive Assets</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Get your deposit addresses
                </p>
              </motion.div>
              <motion.div
                className="bg-white rounded-lg p-4 flex flex-col items-center justify-center text-center border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => {}}
              >
                <div className="bg-purple-100 p-3 rounded-full mb-3">
                  <RefreshCw className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="font-medium text-gray-900">Swap Assets</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Exchange between different tokens
                </p>
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
                onClick={() => {}}
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

  const loadingOverlay = useMemo(() => {
    if (!isLoading) return null;
    return (
      <LoadingOverlay
        message={loadingMessage || "Processing blockchain transaction..."}
        error={loadingError}
      />
    );
  }, [isLoading, loadingMessage, loadingError]);

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 relative">
      <AnimatePresence>{loadingOverlay}</AnimatePresence>

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
          <h1 className="text-3xl font-bold text-gray-900">
            BumbleBee Smart Wallet
          </h1>
          <p className="text-gray-600 mt-2">
            Securely delegate transactions to your AI assistant with
            fine-grained permissions
          </p>
        </div>

        <div className="flex justify-between items-center w-full max-w-3xl mx-auto mb-8">
          {[
            { step: 1, label: "Create Account", completed: currentStep > 1 },
            {
              step: 2,
              label: "Configure Permissions",
              completed: currentStep > 2,
            },
            {
              step: 3,
              label: "Redeem Permissions",
              completed: currentStep > 3,
            },
            { step: 4, label: "Complete", completed: currentStep === 4 },
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full 
                ${
                  step.completed
                    ? "bg-green-500"
                    : currentStep === step.step
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }
                text-white font-medium shadow-sm`}
              >
                {step.completed ? <Check size={16} /> : step.step}
              </div>
              <span className="text-sm mt-2 text-gray-700 font-medium">
                {step.label}
              </span>
            </div>
          ))}
        </div>

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
      </motion.div>
    </div>
  );
}
