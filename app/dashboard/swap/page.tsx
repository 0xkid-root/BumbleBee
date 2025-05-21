"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, RefreshCw, Info, Rocket, ArrowLeftRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TOKENS = [
  { symbol: "ETH", name: "Ethereum", color: "#627EEA" },
  { symbol: "USDT", name: "Tether", color: "#26A17B" },
  { symbol: "DAI", name: "Dai", color: "#F5AC37" },
  { symbol: "BNB", name: "Binance Coin", color: "#F3BA2F" },
];

export default function TokenSwap() {
  const [fromToken, setFromToken] = useState(TOKENS[0].symbol);
  const [toToken, setToToken] = useState(TOKENS[1].symbol);
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0.997);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Simulate random exchange rate changes for demo purposes
    const interval = setInterval(() => {
      const newRate = 0.99 + Math.random() * 0.02;
      setExchangeRate(newRate);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSwap = () => {
    setLoading(true);
    // Simulate transaction processing
    setTimeout(() => {
      setResult(`Successfully swapped ${amount} ${fromToken} to ${(Number(amount) * exchangeRate).toFixed(6)} ${toToken}!`);
      setLoading(false);
    }, 1500);
  };

  const handleSwitchTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  // Find the current token objects for color display
  const fromTokenObj = TOKENS.find(t => t.symbol === fromToken);
  const toTokenObj = TOKENS.find(t => t.symbol === toToken);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10 flex flex-col gap-6 px-4"
    >
      {/* Catchy Card */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white text-center mb-4 relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="absolute -right-10 -top-10 w-32 h-32 bg-white opacity-10 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="flex items-center justify-center mb-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="h-7 w-7 mr-2 text-yellow-300" />
          </motion.div>
          <h2 className="text-2xl font-bold">DeFi Token Swap</h2>
        </div>
        <p className="text-sm font-medium mt-1">
          Fast, secure, and low-fee trading on Ethereum
        </p>
        
        <motion.div 
          className="absolute -left-10 -bottom-10 w-28 h-28 bg-white opacity-10 rounded-full"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ 
            duration: 4,
            delay: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>

      {/* Token Swap Component */}
      <motion.div 
        className="p-6 bg-white rounded-2xl shadow-xl flex flex-col gap-6 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Token Swap</h2>
            <motion.div 
              className="flex items-center text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <motion.span
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >Network: Ethereum</motion.span>
            </motion.div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Instant trading with optimal rates and minimal slippage</p>
        </div>
        
        <div className="flex flex-col gap-5">
          {/* From Token */}
          <motion.div 
            className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600"
            whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">From</label>
            <div className="flex items-center gap-2">
              <select
                className="flex-grow bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                value={fromToken}
                onChange={e => setFromToken(e.target.value)}
              >
                {TOKENS.map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
              <motion.div 
                className="h-10 w-10 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: fromTokenObj?.color || "#627EEA" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-xs">{fromToken}</span>
              </motion.div>
            </div>
            <div className="mt-3">
              <Input
                type="number"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 h-12 text-lg font-medium"
              />
            </div>
          </motion.div>

          {/* Arrow and Switch Button */}
          <div className="flex justify-center my-2 relative">
            <motion.button
              type="button"
              className="bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 p-3 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition z-10"
              onClick={handleSwitchTokens}
              aria-label="Switch tokens"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeftRight className="h-5 w-5 text-purple-500" />
            </motion.button>
            
            {/* Exchange rate floating info */}
            <motion.div 
              className="absolute -right-2 top-0 text-xs bg-gray-800 text-white px-3 py-1 rounded-full opacity-80"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Rate: 1:{exchangeRate.toFixed(4)}
            </motion.div>
          </div>

          {/* To Token */}
          <motion.div 
            className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600"
            whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">To</label>
            <div className="flex items-center gap-2">
              <select
                className="flex-grow bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                value={toToken}
                onChange={e => setToToken(e.target.value)}
              >
                {TOKENS.filter(t => t.symbol !== fromToken).map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
              <motion.div 
                className="h-10 w-10 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: toTokenObj?.color || "#26A17B" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-xs">{toToken}</span>
              </motion.div>
            </div>
            <motion.div 
              className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-600 rounded-lg p-2"
              animate={amount ? { 
                backgroundColor: ["rgba(243,244,246,1)", "rgba(236,252,246,1)", "rgba(243,244,246,1)"],
              } : {}}
              transition={{ duration: 2, repeat: amount ? 1 : 0 }}
            >
              <span>Estimated to receive: </span>
              <span className="ml-1 font-bold text-gray-700 dark:text-gray-200">
                {amount ? (Number(amount) * exchangeRate).toFixed(6) : '0.00'}
              </span>
            </motion.div>
          </motion.div>

          {/* Gas Fee Estimate */}
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 px-2 items-center">
            <motion.div 
              className="flex items-center cursor-pointer relative"
              onHoverStart={() => setShowTooltip(true)}
              onHoverEnd={() => setShowTooltip(false)}
            >
              <Info className="h-4 w-4 mr-1 text-blue-500" />
              <span>Est. Gas Fee:</span>
              
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 text-white text-xs rounded w-48 z-10"
                  >
                    Gas prices fluctuate based on network congestion. This is an estimate only.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.span 
              className="font-medium"
              animate={{ 
                color: loading ? ["#9CA3AF", "#6B7280", "#9CA3AF"] : "#6B7280"
              }}
              transition={{ duration: 1.5, repeat: loading ? Infinity : 0 }}
            >
              ~0.005 ETH
            </motion.span>
          </div>

          {/* Swap Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="w-full h-14 font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg"
              onClick={handleSwap}
              disabled={!amount || fromToken === toToken || loading}
            >
              {loading ? (
                <motion.span 
                  className="flex items-center justify-center" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                  </motion.div>
                  Processing...
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Swap Now
                </motion.span>
              )}
            </Button>
          </motion.div>

          {/* Coming Soon Banner */}
          <motion.div 
            className="text-center px-4 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900 dark:to-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-300 text-sm font-medium"
            animate={{ 
              y: [0, -2, 0],
              backgroundColor: ["rgba(254,252,232,1)", "rgba(254,249,195,0.7)", "rgba(254,252,232,1)"]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <span className="flex items-center justify-center">
              <Rocket className="h-4 w-4 mr-2" />
              Cross-chain swaps coming soon!
            </span>
          </motion.div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div 
                className="mt-2 text-green-600 dark:text-green-400 text-center font-medium bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border border-green-200 dark:border-green-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {result}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}