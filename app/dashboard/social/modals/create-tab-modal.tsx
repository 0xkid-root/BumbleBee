"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CreateTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tabName: string) => Promise<void>;
}

export function CreateTabModal({ isOpen, onClose, onSubmit }: CreateTabModalProps) {
  const [tabName, setTabName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tabName.trim()) return;
    setLoading(true);
    try {
      await onSubmit(tabName);
      setTabName("");
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
            <h2 className="text-xl font-semibold mb-4">Create New Tab</h2>
            <div className="space-y-4">
              <div>
                <Label>Tab Name</Label>
                <Input
                  value={tabName}
                  onChange={(e) => setTabName(e.target.value)}
                  placeholder="e.g., Vacation Fund"
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
                disabled={loading || !tabName.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Tab"
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 