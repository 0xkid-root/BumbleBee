"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart2,
  DollarSign,
  Users,
  Zap,
  TrendingUp,
  Tag,
} from "lucide-react";

interface StatsSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    totalActive: number;
    totalPaused: number;
    totalExpiring: number;
    totalShared: number;
    totalMonthly: string;
    totalYearly: string;
    topCategory: string;
    erc7715Count: number;
    categoryCounts: { [key: string]: number };
  };
}

export function StatsSubscriptionModal({
  isOpen,
  onClose,
  stats,
}: StatsSubscriptionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Subscription Statistics</DialogTitle>
          <DialogDescription>
            Overview of your subscription portfolio
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Monthly Spend
                  </p>
                  <p className="text-2xl font-bold">${stats.totalMonthly}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Yearly Spend
                  </p>
                  <p className="text-2xl font-bold">${stats.totalYearly}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Subscription Status
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">{stats.totalActive} Active</Badge>
                    <Badge variant="secondary">{stats.totalPaused} Paused</Badge>
                    <Badge variant="destructive">
                      {stats.totalExpiring} Expiring
                    </Badge>
                    <Badge variant="outline">{stats.totalShared} Shared</Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Top Category
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{stats.topCategory}</p>
                    <Badge variant="outline">
                      {stats.categoryCounts[stats.topCategory] || 0} subscriptions
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Tag className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Shared Subscriptions
                  </p>
                  <p className="text-2xl font-bold">{stats.totalShared}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    ERC-7715 Subscriptions
                  </p>
                  <p className="text-2xl font-bold">{stats.erc7715Count}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}