// Export types
export * from './delegation-types';
export { DelegationCaveatsModal } from './delegation-caveats-modal';

// Re-export components with proper naming
import { AssetCard } from './asset-card';
import { ConnectWalletCard } from './connect-wallet-card';
import { ConnectWalletModal } from './connect-wallet-modal';
import { ReceiveAssetModal } from './receive-asset-modal';
import { SendAssetModal } from './send-asset-modal';
import { SwapAssetsModal } from './swap-assets-modal';

export {
  AssetCard,
  ConnectWalletCard,
  ConnectWalletModal,
  ReceiveAssetModal,
  SendAssetModal,
  SwapAssetsModal
};

// UI Components
import React from 'react';

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement('h2', { className: "text-xl font-semibold mb-4" }, children);
};

interface StepIndicatorProps {
  step: number;
  isActive: boolean;
  isComplete: boolean;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  step, 
  isActive, 
  isComplete 
}) => {
  return React.createElement(
    'div',
    { 
      className: `flex items-center justify-center w-8 h-8 rounded-full 
        ${isComplete ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-300'}
        text-white font-medium`
    },
    isComplete ? '✓' : step
  );
};

// Mock component for AccountDetailsModal until it's implemented
interface AccountDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  account: any;
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  isOpen,
  onOpenChange,
  account
}) => {
  return React.createElement(
    'div',
    { 
      className: `fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`
    },
    React.createElement(
      'div',
      { className: "bg-white p-6 rounded-lg max-w-md w-full" },
      [
        React.createElement('h2', { className: "text-xl font-semibold mb-4", key: "title" }, "Account Details"),
        React.createElement('p', { key: "id" }, `Account ID: ${account?.id}`),
        React.createElement('p', { key: "address" }, `Address: ${account?.address}`),
        React.createElement('p', { key: "balance" }, `Balance: ${account?.balance} ETH`),
        React.createElement(
          'button',
          { 
            onClick: () => onOpenChange(false),
            className: "mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
            key: "close-btn"
          },
          "Close"
        )
      ]
    )
  );
};

// These interfaces are defined in their respective component files
export type { SendAssetModalProps } from './send-asset-modal';
export type { ReceiveAssetModalProps } from './receive-asset-modal';
export type { SwapAssetsModalProps } from './swap-assets-modal';

export interface SectionTitleProps {
  children: React.ReactNode;
}
