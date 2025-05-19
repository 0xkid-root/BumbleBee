import type { DelegationCaveat } from '../../../../components/wallet/delegation-types'

export function encodeDelegationData(caveats: DelegationCaveat[]): string {
  // Implementation...
}

export function calculateExpiryFromCaveats(caveats: DelegationCaveat[]): Date | undefined {
  // Implementation...
}