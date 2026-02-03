"use client";

import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Scale } from "lucide-react";
import type { StockType } from "@/types";

interface StockTypeBadgeProps {
  stockType: StockType | null | undefined;
  className?: string;
  showIcon?: boolean;
}

export function StockTypeBadge({ stockType, className, showIcon = true }: StockTypeBadgeProps) {
  if (!stockType) return null;

  const config = {
    GROWTH: {
      label: "Growth Stock",
      icon: TrendingUp,
      className: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20 dark:text-green-400",
    },
    DIVIDEND: {
      label: "Dividend Stock",
      icon: DollarSign,
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 dark:text-blue-400",
    },
    HYBRID: {
      label: "Hybrid Stock",
      icon: Scale,
      className: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20 dark:text-purple-400",
    },
  };

  const { label, icon: Icon, className: badgeClassName } = config[stockType];

  return (
    <Badge variant="outline" className={`${badgeClassName} ${className || ""}`}>
      {showIcon && <Icon className="h-3 w-3 mr-1.5" />}
      {label}
    </Badge>
  );
}
