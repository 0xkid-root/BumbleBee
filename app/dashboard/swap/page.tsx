"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeftRight,
  RefreshCw,
  Info,
  Rocket,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Settings,
  History,
  Percent,
  TrendingUp,
  ArrowRight,
  BarChart3,
  DollarSign,
} from "lucide-react";

const TOKENS = [
  { symbol: "ETH", name: "Ethereum", color: "#627EEA", balance: "1.234", price: 5320.75 },
  { symbol: "USDT", name: "Tether", color: "#26A17B", balance: "2,500.00", price: 1.00 },
  { symbol: "DAI", name: "Dai", color: "#F5AC37", balance: "1,850.50", price: 1.01 },
  { symbol: "BNB", name: "Binance Coin", color: "#F3BA2F", balance: "12.5", price: 675.20 },
  { symbol: "MATIC", name: "Polygon", color: "#8247E5", balance: "3,205.75", price: 2.12 },
  { symbol: "USDC", name: "USD Coin", color: "#2775CA", balance: "4,200.00", price: 1.00 },
];

const EDUCATIONAL_CONTENT = [
  {
    title: "What is a Token Swap?",
    content: "Token swapping is the process of exchanging one cryptocurrency for another without using a traditional exchange. Swaps execute through smart contracts, providing better rates and lower fees than centralized exchanges.",
    icon: <ArrowLeftRight className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "How Slippage Works",
    content: "Slippage refers to the difference between the expected price of a trade and the actual price at which it's executed. Higher trading volume leads to lower slippage. Our platform automatically minimizes slippage for better rates.",
    icon: <TrendingUp className="h-8 w-8 text-green-500" />,
  },
  {
    title: "Gas Fees Explained",
    content: "Gas fees are transaction costs on the Ethereum network. They vary based on network congestion and computational complexity of your transaction. Token swaps typically require more gas than simple transfers.",
    icon: <DollarSign className="h-8 w-8 text-yellow-500" />,
  },
  {
    title: "Price Impact",
    content: "Price impact measures how your swap affects the market price. Large trades in pools with low liquidity can cause significant price impact. Our interface shows this percentage to help you make informed decisions.",
    icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
  },
];

const TRANSACTION_HISTORY = [
  { id: 1, fromToken: "ETH", toToken: "USDT", fromAmount: "0.5", toAmount: "2,662.50", timestamp: "May 19, 2025 14:32", status: "Completed" },
  { id: 2, fromToken: "BNB", toToken: "DAI", fromAmount: "2.5", toAmount: "1,688.00", timestamp: "May 18, 2025 09:17", status: "Completed" },
  { id: 3, fromToken: "USDC", toToken: "MATIC", fromAmount: "500", toAmount: "235.85", timestamp: "May 17, 2025 22:05", status: "Completed" },
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

const slideDown = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

const rotate = {
  initial: { rotate: 0 },
  animate: { rotate: 360, transition: { duration: 0.6 } },
};

export default function TokenSwap() {
  const [fromToken, setFromToken] = useState(TOKENS[0].symbol);
  const [toToken, setToToken] = useState(TOKENS[1].symbol);
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1.0024);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [activeEducationIndex, setActiveEducationIndex] = useState(0);
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [transactionPending, setTransactionPending] = useState(false);
  const [priceImpact, setPriceImpact] = useState(0.12);
  const [showMaxButton, setShowMaxButton] = useState(false);
  const [pulsateRate, setPulsateRate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRate = 0.99 + Math.random() * 0.02;
      setExchangeRate(newRate);
      setPulsateRate(true);
      setTimeout(() => setPulsateRate(false), 1000);
      if (amount) {
        const impact = Number(amount) > 10 ? Number(amount) * 0.01 : 0.12;
        setPriceImpact(parseFloat(Math.min(impact, 5).toFixed(2)));
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [amount]);

  useEffect(() => {
    const handleShowMax = () => setShowMaxButton(true);
    const handleHideMax = () => setShowMaxButton(false);
    const inputElement = document.getElementById("amount-input");
    if (inputElement) {
      inputElement.addEventListener("mouseenter", handleShowMax);
      inputElement.addEventListener("mouseleave", handleHideMax);
      return () => {
        inputElement.removeEventListener("mouseenter", handleShowMax);
        inputElement.removeEventListener("mouseleave", handleHideMax);
      };
    }
  }, []);

  const handleSwap = () => {
    setLoading(true);
    setTransactionPending(true);
    setTimeout(() => {
      setTransactionPending(false);
      setResult(`Successfully swapped ${amount} ${fromToken} to ${(Number(amount) * exchangeRate).toFixed(6)} ${toToken}!`);
      setLoading(false);
      setTimeout(() => setResult(""), 8000);
    }, 2500);
  };

  const handleSwitchTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setAmount("");
  };

  const handleMaxAmount = () => {
    const currentToken = TOKENS.find((t) => t.symbol === fromToken);
    if (currentToken) setAmount(currentToken.balance.replace(/,/g, ""));
  };

  const fromTokenObj = TOKENS.find((t) => t.symbol === fromToken);
  const toTokenObj = TOKENS.find((t) => t.symbol === toToken);
  const fromTokenUsdValue = fromTokenObj ? Number(amount) * fromTokenObj.price : 0;
  const toTokenUsdValue = toTokenObj ? Number(amount) * exchangeRate * toTokenObj.price : 0;
  const minAmountToReceive = amount ? ((Number(amount) * exchangeRate) * (1 - slippageTolerance / 100)).toFixed(6) : "0";

  return (
    <div className="flex flex-col md:flex-row max-w-4xl mx-auto gap-4 p-4">
      {/* Left Panel: Token Swap Interface */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full md:w-1/2 flex flex-col gap-4"
      >
        {/* Header Card */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg p-4 text-white overflow-hidden relative"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-bold">Token Swap</h2>
              <p className="text-sm opacity-90">Instant trading with optimal rates</p>
            </div>
            <motion.div
              className="flex items-center text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span>Ethereum Mainnet</span>
            </motion.div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-4 left-10 w-12 h-12 rounded-full bg-white"></div>
            <div className="absolute bottom-4 right-10 w-20 h-20 rounded-full bg-white"></div>
            <div className="absolute top-10 right-20 w-8 h-8 rounded-full bg-white"></div>
          </div>
        </motion.div>

        {/* Controls Bar */}
        <div className="flex justify-between">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-gray-600 border-gray-300 shadow-sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-4 w-4" />
              History
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-gray-600 border-gray-300 shadow-sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </motion.div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideDown}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-100"
            >
              <h3 className="font-medium text-gray-700 mb-3">Swap Settings</h3>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Slippage Tolerance</label>
                <div className="flex gap-2">
                  {[0.1, 0.5, 1.0].map((value) => (
                    <motion.button
                      key={value}
                      whileHover={{ scale: slippageTolerance === value ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1 rounded-md text-sm ${
                        slippageTolerance === value
                          ? "bg-blue-500 text-white font-medium shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => setSlippageTolerance(value)}
                    >
                      {value}%
                    </motion.button>
                  ))}
                  <div className="relative flex items-center">
                    <Input
                      type="number"
                      value={slippageTolerance}
                      onChange={(e) => setSlippageTolerance(Number(e.target.value))}
                      className="w-16 px-2 text-sm border-gray-300 focus:border-blue-500"
                    />
                    <span className="absolute right-2 text-gray-500">%</span>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-100"
              >
                <span className="text-blue-700 font-medium">Pro tip:</span> Setting a higher slippage tolerance may help transactions succeed during volatile market conditions.
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction Pending Notification */}
        <AnimatePresence>
          {transactionPending && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideUp}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center"
            >
              <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin mr-3" />
              <div>
                <p className="font-medium text-yellow-700">Transaction pending</p>
                <p className="text-xs text-yellow-600">Your swap is being processed on the blockchain</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Token Swap Component */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {/* From Token */}
          <motion.div
            className={`bg-gray-50 p-4 rounded-xl border ${loading ? "border-gray-200" : "border-gray-200"} mb-3`}
            whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium text-gray-600">From</label>
              {fromTokenObj && (
                <div className="text-xs text-gray-500">
                  Balance: {fromTokenObj.balance} {fromToken}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                className="flex-grow bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                disabled={loading}
              >
                {TOKENS.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
              <motion.div
                className="h-12 w-12 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: fromTokenObj?.color || "#627EEA" }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <span className="text-white font-bold">{fromToken}</span>
              </motion.div>
            </div>
            <div className="mt-3 relative" id="amount-input">
              <Input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-white focus:ring-2 focus:ring-blue-500 h-12 pr-16 text-lg"
                disabled={loading}
              />
              <AnimatePresence>
                {showMaxButton && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-md hover:bg-blue-600 transition shadow-sm font-medium"
                    onClick={handleMaxAmount}
                  >
                    MAX
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            {amount && fromTokenObj && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-xs text-gray-500 text-right"
              >
                ≈ ${fromTokenUsdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
            )}
          </motion.div>

          {/* Arrow and Switch Button */}
          <div className="flex justify-center relative my-1">
            <motion.button
              type="button"
              className="bg-white rounded-full border border-gray-200 p-2 shadow-md hover:bg-gray-50 transition z-10"
              onClick={handleSwitchTokens}
              aria-label="Switch tokens"
              disabled={loading}
              whileTap={{ rotate: 180 }}
              whileHover={{ scale: 1.1, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
            >
              <ArrowLeftRight className="h-5 w-5 text-purple-500" />
            </motion.button>
            <motion.div
              className={`absolute right-0 top-1 text-xs px-2 py-1 rounded-full flex items-center ${pulsateRate ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
              animate={pulsateRate ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <span>Rate: 1:{exchangeRate.toFixed(4)}</span>
            </motion.div>
          </div>

          {/* To Token */}
          <motion.div
            className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-3"
            whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium text-gray-600">To</label>
              {toTokenObj && (
                <div className="text-xs text-gray-500">
                  Balance: {toTokenObj.balance} {toToken}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                className="flex-grow bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                disabled={loading}
              >
                {TOKENS.filter((t) => t.symbol !== fromToken).map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
              <motion.div
                className="h-12 w-12 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: toTokenObj?.color || "#26A17B" }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <span className="text-white font-bold">{toToken}</span>
              </motion.div>
            </div>
            <motion.div
              className="mt-3 bg-blue-50 rounded-lg p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-600">You receive:</span>
                <motion.span
                  className="font-bold text-lg text-gray-800"
                  key={amount + exchangeRate}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {amount ? (Number(amount) * exchangeRate).toFixed(6) : "0.00"} {toToken}
                </motion.span>
              </div>
              {amount && toTokenObj && (
                <div className="mt-1 text-xs text-blue-600 text-right">
                  ≈ ${toTokenUsdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Swap Details */}
          <AnimatePresence>
            {amount && Number(amount) > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-gray-200 rounded-lg bg-gray-50 p-3 mb-3"
              >
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <div className="text-gray-500">Minimum received:</div>
                    <div className="font-medium text-gray-700">{minAmountToReceive} {toToken}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center text-gray-500">
                      <span>Price Impact</span>
                      <motion.div
                        className="relative"
                        onHoverStart={() => setShowTooltip(true)}
                        onHoverEnd={() => setShowTooltip(false)}
                      >
                        <Info className="h-3 w-3 ml-1 cursor-help" />
                        <AnimatePresence>
                          {showTooltip && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute z-10 bottom-5 left-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg"
                            >
                              Price impact shows how your trade affects the market price. Lower is better.
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                    <div className={`font-medium ${Number(priceImpact) > 2 ? "text-orange-600" : "text-gray-700"}`}>
                      {priceImpact}%
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center text-gray-500">
                      <span>Slippage Tolerance</span>
                    </div>
                    <div className="font-medium text-gray-700">{slippageTolerance}%</div>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <div className="flex items-center text-gray-500">
                      <span>Network Fee</span>
                    </div>
                    <div className="font-medium text-gray-700">~0.005 ETH</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Price Impact Warning */}
          <AnimatePresence>
            {Number(priceImpact) > 2 && amount && Number(amount) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3 text-sm"
              >
                <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-orange-700">High price impact</span>
                  <p className="text-orange-600 text-xs mt-1">
                    Your swap will significantly move the market price. Consider breaking your transaction into smaller amounts.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swap Button */}
          <motion.div
            whileHover={!amount || fromToken === toToken || loading ? {} : { scale: 1.02 }}
            whileTap={!amount || fromToken === toToken || loading ? {} : { scale: 0.98 }}
          >
            <Button
              className={`w-full h-12 font-bold text-lg ${
                !amount || fromToken === toToken || loading
                  ? "bg-gray-300 text-gray-500"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-white"
              } rounded-xl shadow-lg`}
              onClick={handleSwap}
              disabled={!amount || fromToken === toToken || loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </span>
              ) : !amount ? (
                "Enter an amount"
              ) : fromToken === toToken ? (
                "Select different tokens"
              ) : (
                "Swap Now"
              )}
            </Button>
          </motion.div>

          {/* Coming Soon Banner */}
          <motion.div
            className="text-center px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg text-white text-sm font-medium mt-3 shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-3 text-green-600 text-center font-medium bg-green-50 p-3 rounded-lg border border-green-200 shadow-sm"
              >
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.5 }}>
                  {result}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Right Panel: Supplementary Information */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
        }}
        className="w-full md:w-1/2 flex flex-col gap-4"
      >
        {/* Transaction History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white rounded-xl shadow-lg p-4 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700">Recent Transactions</h3>
                <span className="text-xs text-gray-500">{TRANSACTION_HISTORY.length} records</span>
              </div>
              {TRANSACTION_HISTORY.length > 0 ? (
                <div className="space-y-3">
                  {TRANSACTION_HISTORY.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 8px rgba(0,0,0,0.05)" }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-800">{tx.fromAmount} {tx.fromToken}</span>
                          <ArrowRight className="h-3 w-3 text-gray-500" />
                          <span className="font-medium text-gray-800">{tx.toAmount} {tx.toToken}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{tx.timestamp}</div>
                      </div>
                      <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full shadow-sm">
                        {tx.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4 text-gray-500"
                >
                  No recent transactions
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liquidity Provider Section */}
        <motion.div
          variants={slideUp}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Percent className="h-5 w-5 mr-2 text-green-600" />
              <h3 className="font-medium text-gray-800">Earn Yield</h3>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-200 text-xs shadow-sm hover:bg-green-50"
              >
                Provide Liquidity
              </Button>
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-600 mt-2"
          >
            Add liquidity to token pairs and earn trading fees plus rewards.
          </motion.p>
        </motion.div>

        {/* Educational Section */}
        <motion.div
          variants={slideUp}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <motion.button
            className="w-full p-4 flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition"
            onClick={() => setShowEducation(!showEducation)}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center text-blue-700 font-medium">
              <BookOpen className="h-5 w-5 mr-2" />
              Learn about Token Swaps
            </div>
            <motion.div animate={showEducation ? { rotate: 180 } : { rotate: 0 }}>
              {showEducation ? (
                <ChevronUp className="h-5 w-5 text-blue-700" />
              ) : (
                <ChevronDown className="h-5 w-5 text-blue-700" />
              )}
            </motion.div>
          </motion.button>
          <AnimatePresence>
            {showEducation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4"
              >
                <div className="flex mb-3 border-b overflow-x-auto hide-scrollbar">
                  {EDUCATIONAL_CONTENT.map((item, index) => (
                    <motion.button
                      key={index}
                      className={`px-3 py-2 text-sm whitespace-nowrap ${
                        activeEducationIndex === index
                          ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                          : "text-gray-600 hover:text-blue-500"
                      }`}
                      onClick={() => setActiveEducationIndex(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.title.split(" ")[0]}
                    </motion.button>
                  ))}
                </div>
                <motion.div
                  key={activeEducationIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-2"
                >
                  <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-2">
                    {EDUCATIONAL_CONTENT[activeEducationIndex].icon}
                    <span className="ml-2">{EDUCATIONAL_CONTENT[activeEducationIndex].title}</span>
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {EDUCATIONAL_CONTENT[activeEducationIndex].content}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}