import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message: string;
  error: string | null;
}

export const LoadingOverlay = React.memo(({ message, error }: LoadingOverlayProps) => {
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
        {error ? (
          <Loader2 className="h-20 w-20 text-amber-500 animate-spin" />
        ) : (
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
        )}
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
});

LoadingOverlay.displayName = "LoadingOverlay";