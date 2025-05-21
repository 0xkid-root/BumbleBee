import { 
  Implementation, 
  toMetaMaskSmartAccount,
  createDelegation,
  createCaveatBuilder
} from "@metamask/delegation-toolkit";
import { getDeleGatorEnvironment } from "@metamask/delegation-utils";
import { http, createPublicClient } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { sepolia as chain } from "viem/chains";
import { Address } from "viem";

const transport = http();
export const publicClient = createPublicClient({ 
  transport, 
  chain 
});

export async function createMetaMaskSmartAccount(params: {
  address: Address,
  chainId: number,
  sessionKey: string,
  passkey?: any
}) {
  const privateKey = generatePrivateKey();
  const owner = privateKeyToAccount(privateKey);
  const deploySalt = "0x";

  const smartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [owner.address, [], [], []],
    deploySalt,
    signatory: { account: owner },
  });

  return smartAccount;
}

export async function createDelegatorAccount(params: {
  delegator: Address,
  delegate: Address, 
  sessionKey: string,
  passkey?: any,
  caveats: any[]
}) {
  const { delegator, delegate, caveats } = params;
  
  // Create the delegation
  const delegation = createDelegation({
    to: delegate,
    from: delegator,
    caveats: buildCaveats(caveats)
  });

  // Sign the delegation
  const smartAccount = await createMetaMaskSmartAccount({
    address: delegator,
    chainId: chain.id,
    sessionKey: params.sessionKey,
    passkey: params.passkey
  });

  const signature = await smartAccount.signDelegation({ delegation });

  return {
    delegation: {
      ...delegation,
      signature
    },
    smartAccount
  };
}

function buildCaveats(caveats: any[]) {
  // Get the environment for the Linea Sepolia chain
  // Using chain ID 59141 for Linea Sepolia
  const environment = getDeleGatorEnvironment(59141);
  
  const caveatBuilder = createCaveatBuilder(environment);

  return caveats.reduce((builder, caveat) => {
    switch(caveat.type) {
      case 'nativeTokenTransferAmount':
        return builder.addCaveat('nativeTokenTransferAmount', caveat.value);
      case 'timeLimit':
        const timestamp = Math.floor(Date.now() / 1000) + (caveat.value * 3600); // Convert hours to timestamp
        return builder.addCaveat({
          enforcer: "0x22Ae4c4919C3aB4B5FC309713Bf707569B74876F", // AfterTimestampEnforcer address
          terms: `0x${timestamp.toString(16)}` 
        });
      default:
        return builder;
    }
  }, caveatBuilder);
}