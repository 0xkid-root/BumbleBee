import { ethers } from 'ethers'
import type { DelegationCaveat } from './types'

export function encodeDelegationData(caveats: DelegationCaveat[]): string {
  const iface = new ethers.utils.Interface([
    'function grantDelegation(address delegate, bytes[] calldata caveats)'
  ])

  return iface.encodeFunctionData('grantDelegation', [
    caveats.map(caveat => ethers.utils.defaultAbiCoder.encode(
      ['string', 'bytes'],
      [caveat.type, ethers.utils.defaultAbiCoder.encode(['string'], [caveat.value])]
    ))
  ])
}