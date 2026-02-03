"use client";

import { Badge } from "@/components/ui/badge";
import { Package, Building2 } from "lucide-react";
import type { AssetType } from "@/types";

interface AssetTypeBadgeProps {
  assetType?: AssetType | null;
  className?: string;
  showIcon?: boolean;
}

export function AssetTypeBadge({ assetType, className, showIcon = true }: AssetTypeBadgeProps) {
  if (!assetType || assetType === "STOCK") return null;

  const config = {
    ETF: {
      label: "ETF",
      icon: Package,
      className: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20 dark:text-green-400",
    },
    MUTUAL_FUND: {
      label: "Mutual Fund",
      icon: Building2,
      className: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20 dark:text-purple-400",
    },
  };

  const { label, icon: Icon, className: badgeClassName } = config[assetType];

  return (
    <Badge variant="outline" className={`${badgeClassName} ${className || ""}`}>
      {showIcon && <Icon className="h-3 w-3 mr-1.5" />}
      {label}
    </Badge>
  );
}
