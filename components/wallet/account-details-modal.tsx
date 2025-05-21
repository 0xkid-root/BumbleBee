import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { useClipboard } from '@/lib/hooks/use-clipboard';
import { formatAddress } from '@/lib/utils';
import { Address } from 'viem';

interface AccountDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  account: {
    id: string;
    address: string | Address;
    name: string;
    balance: number;
    createdAt: Date;
  } | null;
}

export function AccountDetailsModal({ 
  isOpen, 
  onOpenChange, 
  account 
}: AccountDetailsModalProps): React.ReactElement {
  const { copy, hasCopied } = useClipboard();

  if (!account) return <></>;

  const copyAddress = () => {
    copy(account.address);
  };

  const viewOnExplorer = () => {
    window.open(`https://sepolia.etherscan.io/address/${account.address}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Name</p>
            <p className="text-base font-semibold">{account.name}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
            <div className="flex items-center space-x-2">
              <p className="text-base font-mono">{formatAddress(account.address as string)}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyAddress}
                className="h-8 w-8"
              >
                {hasCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Balance</p>
            <p className="text-base font-semibold">{account.balance} ETH</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</p>
            <p className="text-base">{account.createdAt.toLocaleString()}</p>
          </div>
          
          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={viewOnExplorer}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Etherscan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
