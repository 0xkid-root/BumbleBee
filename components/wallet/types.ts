import { DelegationAccount } from '@/lib/types';

export interface SendAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: DelegationAccount | null;
}

export interface ReceiveAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: DelegationAccount | null;
}

export interface SwapAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: DelegationAccount | null;
}

export interface SectionTitleProps {
  title: string;
  subtitle: string;
}