"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Tab {
  id: string;
  name: string;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tabId: string, memberAddress: string) => Promise<void>;
  tabs: Tab[];
  selectedTabId: string | null;
}

export function AddMemberModal({
  isOpen,
  onClose,
  onSubmit,
  tabs,
  selectedTabId,
}: AddMemberModalProps) {
  const [memberAddress, setMemberAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTabId, setCurrentTabId] = useState(selectedTabId || "");

  const handleSubmit = async () => {
    if (!currentTabId || !memberAddress) return;
    setLoading(true);
    try {
      await onSubmit(currentTabId, memberAddress);
      setMemberAddress("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4">Add Member</h2>
            <div className="space-y-4">
              <div>
                <Label>Select Tab</Label>
                <Select
                  onValueChange={setCurrentTabId}
                  value={currentTabId}
                >
                  <SelectTrigger className="border-amber-200 dark:border-amber-500/30">
                    <SelectValue placeholder="Select a tab" />
                  </SelectTrigger>
                  <SelectContent>
                    {tabs.map((tab) => (
                      <SelectItem key={tab.id} value={tab.id}>
                        {tab.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Member Address</Label>
                <Input
                  value={memberAddress}
                  onChange={(e) => setMemberAddress(e.target.value)}
                  placeholder="0x..."
                  className="border-indigo-200 dark:border-indigo-800/30"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !currentTabId || !memberAddress}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Member"
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 