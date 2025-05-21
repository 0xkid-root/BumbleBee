import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CaveatType, DelegationCaveat } from './delegation-types';
import { Address } from 'viem';

interface DelegationCaveatsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (caveats: DelegationCaveat[]) => void;
  initialCaveats?: DelegationCaveat[];
}

export function DelegationCaveatsModal({
  isOpen,
  onOpenChange,
  onSave,
  initialCaveats = []
}: DelegationCaveatsModalProps) {
  const [caveats, setCaveats] = useState<DelegationCaveat[]>(initialCaveats);
  const [selectedCaveatType, setSelectedCaveatType] = useState<CaveatType | null>(null);
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [timeLimit, setTimeLimit] = useState<string>('');
  const [maxTransactions, setMaxTransactions] = useState<string>('');
  const [whitelistedAddresses, setWhitelistedAddresses] = useState<string>('');
  const [blacklistedAddresses, setBlacklistedAddresses] = useState<string>('');
  const [requireConfirmation, setRequireConfirmation] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && initialCaveats) {
      setCaveats(initialCaveats);
      
      // Initialize form fields based on existing caveats
      initialCaveats.forEach(caveat => {
        switch (caveat.type) {
          case CaveatType.MaxAmount:
            setMaxAmount(caveat.value.toString());
            break;
          case CaveatType.TimeLimit:
            setTimeLimit(caveat.value.toString());
            break;
          case CaveatType.MaxTransactionsPerDay:
            setMaxTransactions(caveat.value.toString());
            break;
          case CaveatType.WhitelistedAddresses:
            setWhitelistedAddresses(caveat.value.join(', '));
            break;
          case CaveatType.BlacklistedAddresses:
            setBlacklistedAddresses(caveat.value.join(', '));
            break;
          case CaveatType.RequireConfirmation:
            setRequireConfirmation(caveat.value);
            break;
        }
      });
    }
  }, [isOpen, initialCaveats]);

  const handleAddCaveat = () => {
    if (!selectedCaveatType) return;

    let newCaveat: DelegationCaveat | null = null;

    switch (selectedCaveatType) {
      case CaveatType.MaxAmount:
        if (!maxAmount) return;
        newCaveat = {
          id: `caveat-${Date.now()}`,
          type: CaveatType.MaxAmount,
          value: parseFloat(maxAmount),
          description: `Maximum transaction amount: ${maxAmount} ETH`
        };
        break;
      case CaveatType.TimeLimit:
        if (!timeLimit) return;
        newCaveat = {
          id: `caveat-${Date.now()}`,
          type: CaveatType.TimeLimit,
          value: parseInt(timeLimit),
          description: `Time limit: ${timeLimit} days`
        };
        break;
      case CaveatType.MaxTransactionsPerDay:
        if (!maxTransactions) return;
        newCaveat = {
          id: `caveat-${Date.now()}`,
          type: CaveatType.MaxTransactionsPerDay,
          value: parseInt(maxTransactions),
          description: `Maximum transactions per day: ${maxTransactions}`
        };
        break;
      case CaveatType.WhitelistedAddresses:
        if (!whitelistedAddresses) return;
        const whitelist = whitelistedAddresses.split(',').map(addr => addr.trim());
        newCaveat = {
          id: `caveat-${Date.now()}`,
          type: CaveatType.WhitelistedAddresses,
          value: whitelist,
          description: `Whitelisted addresses: ${whitelist.length} addresses`
        };
        break;
      case CaveatType.BlacklistedAddresses:
        if (!blacklistedAddresses) return;
        const blacklist = blacklistedAddresses.split(',').map(addr => addr.trim());
        newCaveat = {
          id: `caveat-${Date.now()}`,
          type: CaveatType.BlacklistedAddresses,
          value: blacklist,
          description: `Blacklisted addresses: ${blacklist.length} addresses`
        };
        break;
      case CaveatType.RequireConfirmation:
        newCaveat = {
          id: `caveat-${Date.now()}`,
          type: CaveatType.RequireConfirmation,
          value: requireConfirmation,
          description: `Require confirmation for all transactions: ${requireConfirmation ? 'Yes' : 'No'}`
        };
        break;
    }

    if (newCaveat) {
      // Remove any existing caveat of the same type
      const filteredCaveats = caveats.filter(c => c.type !== newCaveat!.type);
      setCaveats([...filteredCaveats, newCaveat]);
      
      // Reset form
      setSelectedCaveatType(null);
    }
  };

  const handleRemoveCaveat = (id: string) => {
    setCaveats(caveats.filter(c => c.id !== id));
  };

  const handleSave = () => {
    onSave(caveats);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure Delegation Caveats</DialogTitle>
          <DialogDescription>
            Set limits and permissions for your AI assistant's actions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="caveat-type">Add a new caveat</Label>
            <Select 
              value={selectedCaveatType || ''} 
              onValueChange={(value) => setSelectedCaveatType(value as CaveatType)}
            >
              <SelectTrigger id="caveat-type">
                <SelectValue placeholder="Select caveat type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CaveatType.MaxAmount}>Maximum Transaction Amount</SelectItem>
                <SelectItem value={CaveatType.TimeLimit}>Time Limit</SelectItem>
                <SelectItem value={CaveatType.MaxTransactionsPerDay}>Maximum Transactions Per Day</SelectItem>
                <SelectItem value={CaveatType.WhitelistedAddresses}>Whitelisted Addresses</SelectItem>
                <SelectItem value={CaveatType.BlacklistedAddresses}>Blacklisted Addresses</SelectItem>
                <SelectItem value={CaveatType.RequireConfirmation}>Require Confirmation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedCaveatType === CaveatType.MaxAmount && (
            <div className="space-y-2">
              <Label htmlFor="max-amount">Maximum Amount (ETH)</Label>
              <Input
                id="max-amount"
                type="number"
                step="0.001"
                min="0"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="0.1"
              />
            </div>
          )}

          {selectedCaveatType === CaveatType.TimeLimit && (
            <div className="space-y-2">
              <Label htmlFor="time-limit">Time Limit (days)</Label>
              <Input
                id="time-limit"
                type="number"
                min="1"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="30"
              />
            </div>
          )}

          {selectedCaveatType === CaveatType.MaxTransactionsPerDay && (
            <div className="space-y-2">
              <Label htmlFor="max-transactions">Maximum Transactions Per Day</Label>
              <Input
                id="max-transactions"
                type="number"
                min="1"
                value={maxTransactions}
                onChange={(e) => setMaxTransactions(e.target.value)}
                placeholder="5"
              />
            </div>
          )}

          {selectedCaveatType === CaveatType.WhitelistedAddresses && (
            <div className="space-y-2">
              <Label htmlFor="whitelist">Whitelisted Addresses (comma separated)</Label>
              <Input
                id="whitelist"
                value={whitelistedAddresses}
                onChange={(e) => setWhitelistedAddresses(e.target.value)}
                placeholder="0x1234..., 0x5678..."
              />
            </div>
          )}

          {selectedCaveatType === CaveatType.BlacklistedAddresses && (
            <div className="space-y-2">
              <Label htmlFor="blacklist">Blacklisted Addresses (comma separated)</Label>
              <Input
                id="blacklist"
                value={blacklistedAddresses}
                onChange={(e) => setBlacklistedAddresses(e.target.value)}
                placeholder="0x1234..., 0x5678..."
              />
            </div>
          )}

          {selectedCaveatType === CaveatType.RequireConfirmation && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="require-confirmation" 
                checked={requireConfirmation}
                onCheckedChange={(checked) => setRequireConfirmation(checked as boolean)}
              />
              <Label htmlFor="require-confirmation">
                Require confirmation for all transactions
              </Label>
            </div>
          )}

          {selectedCaveatType && (
            <Button onClick={handleAddCaveat}>Add Caveat</Button>
          )}

          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Current Caveats</h4>
            {caveats.length === 0 ? (
              <p className="text-sm text-muted-foreground">No caveats added yet.</p>
            ) : (
              <div className="space-y-2">
                {caveats.map((caveat) => (
                  <div key={caveat.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                    <span className="text-sm">{caveat.description}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveCaveat(caveat.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Caveats</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
