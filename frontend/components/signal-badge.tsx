import { Badge } from "@/components/ui/badge";
import type { SignalType } from "@/types";
import { cn } from "@/lib/utils";

interface SignalBadgeProps {
  signal: SignalType;
  confidence?: number;
  className?: string;
}

export function SignalBadge({ signal, confidence, className }: SignalBadgeProps) {
  const getVariant = (): "success" | "warning" | "danger" | "secondary" => {
    switch (signal) {
      case "BUY":
        return "success";
      case "SELL":
        return "danger";
      case "HOLD":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Badge variant={getVariant()} className={cn("text-sm px-3 py-1", className)}>
      {signal}
      {confidence !== undefined && (
        <span className="ml-2 opacity-90">({confidence}%)</span>
      )}
    </Badge>
  );
}
