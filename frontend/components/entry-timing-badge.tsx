"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface EntryTimingBadgeProps {
  timing: "GOOD" | "FAIR" | "WAIT";
  className?: string;
  showIcon?: boolean;
}

export function EntryTimingBadge({ timing, className, showIcon = true }: EntryTimingBadgeProps) {
  const config = {
    GOOD: {
      label: "Good Entry",
      icon: CheckCircle2,
      className: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20 dark:text-green-400",
    },
    FAIR: {
      label: "Fair Entry",
      icon: AlertCircle,
      className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20 dark:text-yellow-400",
    },
    WAIT: {
      label: "Wait",
      icon: Clock,
      className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 dark:text-red-400",
    },
  };

  const { label, icon: Icon, className: badgeClassName } = config[timing];

  return (
    <Badge variant="outline" className={`${badgeClassName} ${className || ""}`}>
      {showIcon && <Icon className="h-3 w-3 mr-1.5" />}
      {label}
    </Badge>
  );
}
