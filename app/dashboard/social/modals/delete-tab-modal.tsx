"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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

interface DeleteTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tabId: string) => Promise<void>;
  tabs: Tab[];
  selectedTabId: string | null;
}

export function DeleteTabModal({
  isOpen,
  onClose,
  onSubmit,
  tabs,
  selectedTabId,
}: DeleteTabModalProps) {
  const [loading, setLoading] = useState(false);
  const [currentTabId, setCurrentTabId] = useState(selectedTabId || "");

  const handleSubmit = async () => {
    if (!currentTabId) return;
    setLoading(true);
    try {
      await onSubmit(currentTabId);
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
            <h2 className="text-xl font-semibold mb-4">Delete Tab</h2>
            <div className="space-y-4">
              <div>
                <Label>Select Tab to Delete</Label>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Warning: This action cannot be undone. All members and their data will be removed from this tab.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !currentTabId}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Tab"
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 