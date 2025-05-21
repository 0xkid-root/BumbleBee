"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, Shield, Users, Info } from "lucide-react";
import { motion } from "framer-motion";

// Define the delegation implementation types
export enum DelegationImplementation {
  Hybrid = "Hybrid",
  Multisig = "Multisig"
}

interface DelegationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: DelegationImplementation, signers?: string[], threshold?: number) => void;
  currentAddress: string;
}

export function DelegationTypeModal({
  isOpen,
  onClose,
  onSelect,
  currentAddress
}: DelegationTypeModalProps) {
  const [selectedType, setSelectedType] = useState<DelegationImplementation | null>(null);
  const [signers, setSigners] = useState<string[]>([currentAddress]);
  const [newSigner, setNewSigner] = useState<string>("");
  const [threshold, setThreshold] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedType(null);
      setSigners([currentAddress]);
      setNewSigner("");
      setThreshold(1);
      setError(null);
    }
  }, [isOpen, currentAddress]);

  // Add a new signer
  const handleAddSigner = () => {
    if (!newSigner || !newSigner.startsWith("0x") || newSigner.length !== 42) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    if (signers.includes(newSigner)) {
      setError("This address is already added as a signer");
      return;
    }

    setSigners([...signers, newSigner]);
    setNewSigner("");
    setError(null);
  };

  // Remove a signer
  const handleRemoveSigner = (address: string) => {
    // Don't allow removing the current user's address
    if (address === currentAddress) {
      setError("You cannot remove your own address from signers");
      return;
    }

    const newSigners = signers.filter(signer => signer !== address);
    setSigners(newSigners);
    
    // Adjust threshold if needed
    if (threshold > newSigners.length) {
      setThreshold(newSigners.length);
    }
  };

  // Update threshold
  const handleThresholdChange = (value: number) => {
    if (value < 1) {
      setThreshold(1);
    } else if (value > signers.length) {
      setThreshold(signers.length);
    } else {
      setThreshold(value);
    }
  };

  // Handle selection
  const handleSelect = () => {
    if (!selectedType) {
      setError("Please select a delegation type");
      return;
    }

    if (selectedType === DelegationImplementation.Multisig) {
      if (signers.length < threshold) {
        setError("Threshold cannot be greater than the number of signers");
        return;
      }
    }

    onSelect(
      selectedType, 
      selectedType === DelegationImplementation.Multisig ? signers : undefined,
      selectedType === DelegationImplementation.Multisig ? threshold : undefined
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Delegation Type</DialogTitle>
          <DialogDescription>
            Choose the type of delegation account you want to create.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border cursor-pointer ${selectedType === DelegationImplementation.Hybrid ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}
              onClick={() => setSelectedType(DelegationImplementation.Hybrid)}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <Shield className={`h-10 w-10 ${selectedType === DelegationImplementation.Hybrid ? 'text-amber-500' : 'text-gray-400'}`} />
                <h3 className="font-medium">Hybrid Delegation</h3>
                <p className="text-sm text-gray-500">Single owner account with passkey support</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border cursor-pointer ${selectedType === DelegationImplementation.Multisig ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
              onClick={() => setSelectedType(DelegationImplementation.Multisig)}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <Users className={`h-10 w-10 ${selectedType === DelegationImplementation.Multisig ? 'text-blue-500' : 'text-gray-400'}`} />
                <h3 className="font-medium">Multisig Delegation</h3>
                <p className="text-sm text-gray-500">Multiple signers with configurable threshold</p>
              </div>
            </motion.div>
          </div>

          {selectedType === DelegationImplementation.Multisig && (
            <div className="space-y-4 mt-4">
              <Separator />
              
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Configure Multisig</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="threshold">Threshold:</Label>
                  <Input
                    id="threshold"
                    type="number"
                    min={1}
                    max={signers.length}
                    value={threshold}
                    onChange={(e) => handleThresholdChange(parseInt(e.target.value))}
                    className="w-16"
                  />
                  <span className="text-sm text-gray-500">of {signers.length}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Info className="h-4 w-4 mr-1" />
                  <span>Requires {threshold} out of {signers.length} signers to approve transactions</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Signers</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {signers.map((signer, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono">
                          {signer === currentAddress ? 
                            <span className="text-green-600">{signer.slice(0, 6)}...{signer.slice(-4)} (You)</span> : 
                            <span>{signer.slice(0, 6)}...{signer.slice(-4)}</span>
                          }
                        </span>
                      </div>
                      {signer !== currentAddress && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSigner(signer)}
                          className="h-8 w-8 p-0"
                        >
                          <MinusCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add signer address (0x...)"
                  value={newSigner}
                  onChange={(e) => setNewSigner(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleAddSigner}
                  className="shrink-0"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSelect}
            disabled={!selectedType}
            className={selectedType === DelegationImplementation.Hybrid ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-500 hover:bg-blue-600'}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}