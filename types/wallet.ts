export interface Asset {
  id: string | number
  name: string
  symbol: string
  amount?: number
  value?: number
  price?: number
  change24h?: number
  logo?: string
  balance?: number
  usdValue?: number
  icon?: string
}

export interface MockAsset {
  id: number
  name: string
  symbol: string
  balance: number
  usdValue: number
  icon: string
}

export interface ConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect?: () => Promise<void>
}

export interface ReceiveAssetModalProps {
  isOpen: boolean
  onClose: () => void
  asset: Asset | null
  walletAddress?: string | null
}

export interface SendAssetModalProps {
  isOpen: boolean
  onClose: () => void
  asset: Asset | null
}

export interface SwapAssetsModalProps {
  isOpen: boolean
  onClose: () => void
  fromAsset?: Asset | null
  asset?: never
}

export interface AssetCardProps {
  asset: Asset
  onSend: (asset: Asset) => void
  onReceive: (asset: Asset) => void
  onSwap: (asset: Asset) => void
  className?: string
}
