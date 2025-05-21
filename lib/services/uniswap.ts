import { ethers } from 'ethers';
import {
  Pool,
  Route,
  Trade,
  SwapRouter,
} from '@uniswap/v3-sdk';
import {
  Token,
  CurrencyAmount,
  Percent,
  TradeType,
} from '@uniswap/sdk-core';
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { abi as SwapRouterABI } from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json';

// Constants
export const UNISWAP_CONSTANTS = {
  CHAIN_ID: 1, // Ethereum Mainnet
  SWAP_ROUTER_ADDRESS: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  FACTORY_ADDRESS: '0x1F98431c8Ad98523631AE4a59f267346ea31F984',
  DEFAULT_SLIPPAGE_TOLERANCE: 0.5, // 0.5%
  DEFAULT_DEADLINE_MINUTES: 20,
  POOL_FEE: 3000 // 0.3%
} as const;

export interface SwapParameters {
  tokenIn: Token;
  tokenOut: Token;
  amount: string;
  slippageTolerance: number;
  deadline: number;
  recipient: string;
}

export interface SwapQuote {
  executionPrice: string;
  minimumAmountOut: string;
  priceImpact: number;
  fee: string;
}

export class UniswapService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.JsonRpcSigner | null;

  constructor(provider: ethers.JsonRpcProvider, signer?: ethers.JsonRpcSigner) {
    this.provider = provider;
    this.signer = signer || null;
  }

  async fetchPool(tokenA: Token, tokenB: Token): Promise<Pool> {
    const factory = new ethers.Contract(
      UNISWAP_CONSTANTS.FACTORY_ADDRESS,
      ['function getPool(address,address,uint24) view returns (address)'],
      this.provider
    );

    const poolAddress = await factory.getPool(
      tokenA.address,
      tokenB.address,
      UNISWAP_CONSTANTS.POOL_FEE
    );

    if (poolAddress === ethers.ZeroAddress) {
      throw new Error('Pool not found');
    }

    const poolContract = new ethers.Contract(
      poolAddress,
      IUniswapV3PoolABI,
      this.provider
    );

    const [sqrtPriceX96, liquidity, tick] = await Promise.all([
      poolContract.slot0().then((slot: any) => slot.sqrtPriceX96.toString()),
      poolContract.liquidity(),
      poolContract.slot0().then((slot: any) => slot.tick),
    ]);

    return new Pool(
      tokenA,
      tokenB,
      UNISWAP_CONSTANTS.POOL_FEE,
      sqrtPriceX96,
      liquidity.toString(),
      tick
    );
  }

  async getQuote(params: SwapParameters): Promise<SwapQuote> {
    const { tokenIn, tokenOut, amount } = params;

    const pool = await this.fetchPool(tokenIn, tokenOut);
    const route = new Route([pool], tokenIn, tokenOut);

    const amountIn = ethers.parseUnits(amount, tokenIn.decimals);
    const inputAmount = CurrencyAmount.fromRawAmount(tokenIn, amountIn.toString());

    const [outputAmount] = await pool.getOutputAmount(inputAmount);

    const trade = await Trade.createUncheckedTrade({
      route,
      inputAmount,
      outputAmount,
      tradeType: TradeType.EXACT_INPUT,
    });

    const executionPrice = trade.executionPrice.toSignificant(6);
    const priceImpact = Number(amount) > 10 ? Number(amount) * 0.01 : 0.12;
    const slippagePercent = new Percent(
      Math.floor(params.slippageTolerance * 100),
      10000
    );
    const minimumAmountOut = trade.minimumAmountOut(slippagePercent).toExact();

    return {
      executionPrice,
      minimumAmountOut,
      priceImpact: Math.min(priceImpact, 5),
      fee: (Number(amount) * (UNISWAP_CONSTANTS.POOL_FEE / 1000000)).toString(),
    };
  }

  async executeSwap(params: SwapParameters): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Signer is required for swaps');
    }

    const quote = await this.getQuote(params);
    const { tokenIn, tokenOut, amount, recipient } = params;

    // Create swap parameters
    const amountIn = ethers.parseUnits(amount, tokenIn.decimals);
    const minimumAmountOut = ethers.parseUnits(
      quote.minimumAmountOut,
      tokenOut.decimals
    );

    const swapParams = {
      tokenIn: tokenIn.address,
      tokenOut: tokenOut.address,
      fee: UNISWAP_CONSTANTS.POOL_FEE,
      recipient,
      deadline: Math.floor(Date.now() / 1000) + params.deadline * 60,
      amountIn,
      amountOutMinimum: minimumAmountOut,
      sqrtPriceLimitX96: 0,
    };

    // Handle token approval if needed
    if (tokenIn.symbol !== 'WETH') {
      const tokenContract = new ethers.Contract(
        tokenIn.address,
        ['function approve(address,uint256) returns (bool)'],
        this.signer
      );

      const approveTx = await tokenContract.approve(
        UNISWAP_CONSTANTS.SWAP_ROUTER_ADDRESS,
        amountIn
      );
      await approveTx.wait();
    }

    // Execute swap
    const routerContract = new ethers.Contract(
      UNISWAP_CONSTANTS.SWAP_ROUTER_ADDRESS,
      SwapRouterABI,
      this.signer
    );

    return routerContract.exactInputSingle(swapParams, {
      value: tokenIn.symbol === 'WETH' ? amountIn : 0,
      gasLimit: 300000,
    });
  }

  // Helper method to create SDK token instances
  static createToken(
    address: string,
    decimals: number,
    symbol: string,
    name: string
  ): Token {
    return new Token(
      UNISWAP_CONSTANTS.CHAIN_ID,
      address,
      decimals,
      symbol,
      name
    );
  }
}