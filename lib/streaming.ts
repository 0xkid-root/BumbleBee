import { formatEther, parseEther, type Address } from "viem";

export const calculateStreamRate = (amount: number, duration: number) => {
  const amountWei = parseEther(amount.toString());
  return amountWei / BigInt(duration);
};

export const formatStreamRate = (rateWei: bigint) => {
  return `${formatEther(rateWei)} ETH/s`;
};

export const calculateTotalStreamed = (
  startTime: number,
  currentTime: number,
  ratePerSecond: bigint
) => {
  const duration = currentTime - startTime;
  return ratePerSecond * BigInt(duration);
};

export interface StreamParams {
  chainId: number;
  expiry: number;
  signer: {
    type: "account";
    data: {
      address: Address;
    };
  };
  permission: {
    type: "native-token-stream";
    isAdjustmentAllowed: boolean;
    data: {
      initialAmount: bigint;
      amountPerSecond: bigint;
      maxAmount: bigint;
      startTime: number;
      justification: string;
    };
  };
}

export function calculateStreamParams(params: {
  address: Address;
  amount: number;
  duration: number;
  chainId: number;
  description: string;
}): StreamParams {
  const currentTime = Math.floor(Date.now() / 1000);
  const expiry = currentTime + params.duration;

  const amountInWei = BigInt(Math.floor(params.amount * 1e18));
  const amountPerSecond = amountInWei / BigInt(params.duration);

  return {
    chainId: params.chainId,
    expiry,
    signer: {
      type: "account",
      data: {
        address: params.address,
      },
    },
    permission: {
      type: "native-token-stream",
      isAdjustmentAllowed: true,
      data: {
        initialAmount: amountPerSecond, // First second's payment
        amountPerSecond,
        maxAmount: amountInWei * BigInt(2), // 2x buffer
        startTime: currentTime,
        justification: params.description,
      },
    },
  };
}