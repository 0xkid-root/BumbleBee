"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, RefreshCw, Info, Rocket } from "lucide-react";

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

  const handleSwap = () => {
    setLoading(true);
    // Simulate transaction processing
    setTimeout(() => {
      setResult(`Successfully swapped ${amount} ${fromToken} to ${toToken}!`);
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
    <div className="max-w-md mx-auto mt-10 flex flex-col gap-6">
      {/* Catchy Card */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl shadow-lg p-6 text-white text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <Rocket className="h-6 w-6 mr-2" />
          <h2 className="text-2xl font-bold">Swap Tokens Instantly!</h2>
        </div>
        <p className="text-sm font-medium mt-1">
          Get started in seconds on Ethereum!
        </p>
      </div>

      {/* Token Swap Component */}
      <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col gap-6">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-600">Token Swap</h2>
            <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              Network: Ethereum
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">Fast, secure trading with minimal fees and optimal rates</p>
        </div>
        
        <div className="flex flex-col gap-5">
          {/* From Token */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-sm font-medium text-gray-600 mb-2">From</label>
            <div className="flex items-center gap-2">
              <select
                className="flex-grow bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={fromToken}
                onChange={e => setFromToken(e.target.value)}
              >
                {TOKENS.map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
              <div 
                className="h-8 w-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: fromTokenObj?.color || "#627EEA" }}
              >
                <span className="text-white font-bold text-xs">{fromToken}</span>
              </div>
            </div>
            <div className="mt-3">
              <Input
                type="number"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Arrow and Switch Button */}
          <div className="flex justify-center my-2">
            <button
              type="button"
              className="bg-white rounded-full border border-gray-200 p-2 shadow hover:bg-gray-50 transition"
              onClick={handleSwitchTokens}
              aria-label="Switch tokens"
            >
              <RefreshCw className="h-5 w-5 text-amber-500" />
            </button>
          </div>

          {/* To Token */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-sm font-medium text-gray-600 mb-2">To</label>
            <div className="flex items-center gap-2">
              <select
                className="flex-grow bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={toToken}
                onChange={e => setToToken(e.target.value)}
              >
                {TOKENS.filter(t => t.symbol !== fromToken).map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
              <div 
                className="h-8 w-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: toTokenObj?.color || "#26A17B" }}
              >
                <span className="text-white font-bold text-xs">{toToken}</span>
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm text-gray-500">
              <span>Estimated to receive: {amount ? (Number(amount) * 0.997).toFixed(6) : '0.00'}</span>
            </div>
          </div>

          {/* Gas Fee Estimate */}
          <div className="flex justify-between text-sm text-gray-600 px-2">
            <span className="flex items-center">
              <Info className="h-4 w-4 mr-1" />
              Est. Gas Fee:
            </span>
            <span>~0.005 ETH</span>
          </div>

          {/* Swap Button */}
          <Button
            className="w-full h-12 font-bold text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            onClick={handleSwap}
            disabled={!amount || fromToken === toToken || loading}
          >
            {loading ? (
              <span className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </span>
            ) : (
              "Swap"
            )}
          </Button>

          {/* Coming Soon Banner */}
          <div className="text-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm font-medium">
            Cross-chain swaps coming soon!
          </div>

          {/* Result */}
          {result && (
            <div className="mt-2 text-green-600 text-center font-medium bg-green-50 p-3 rounded-lg border border-green-200">
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}