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
  members: string[];
}

interface RemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tabId: string, memberAddress: string) => Promise<void>;
  tabs: Tab[];
  selectedTabId: string | null;
}

export function RemoveMemberModal({
  isOpen,
  onClose,
  onSubmit,
  tabs,
  selectedTabId,
}: RemoveMemberModalProps) {
  const [loading, setLoading] = useState(false);
  const [currentTabId, setCurrentTabId] = useState(selectedTabId || "");
  const [selectedMember, setSelectedMember] = useState("");

  const currentTab = tabs.find((tab) => tab.id === currentTabId);

  const handleSubmit = async () => {
    if (!currentTabId || !selectedMember) return;
    setLoading(true);
    try {
      await onSubmit(currentTabId, selectedMember);
      setSelectedMember("");
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
            <h2 className="text-xl font-semibold mb-4">Remove Member</h2>
            <div className="space-y-4">
              <div>
                <Label>Select Tab</Label>
                <Select
                  onValueChange={(value) => {
                    setCurrentTabId(value);
                    setSelectedMember("");
                  }}
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
              {currentTab && (
                <div>
                  <Label>Select Member</Label>
                  <Select
                    onValueChange={setSelectedMember}
                    value={selectedMember}
                  >
                    <SelectTrigger className="border-indigo-200 dark:border-indigo-800/30">
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentTab.members.map((member) => (
                        <SelectItem key={member} value={member}>
                          {member}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !currentTabId || !selectedMember}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Remove Member"
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 