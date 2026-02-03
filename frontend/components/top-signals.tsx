"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignalBadge } from "@/components/signal-badge";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EmptyState } from "@/components/empty-state";
import { Zap, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export function TopSignals() {
  const { data: topSignals, isLoading } = useQuery({
    queryKey: ["top-signals"],
    queryFn: () => api.signals.getTop({ limit: 10 }),
  });

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
              Top Signals Today
            </CardTitle>
            <CardDescription className="mt-1">Highest confidence investment signals</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground mt-4">Loading signals...</p>
          </div>
        ) : Array.isArray(topSignals) && topSignals.length > 0 ? (
          <div className="space-y-3" role="list" aria-label="Top investment signals">
            {topSignals.map((signal) => (
              <Link
                key={signal.id}
                href={`/stocks/${signal.stock_id}`}
                className="group block p-4 border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                role="listitem"
                aria-label={`${signal.stock_id} - ${signal.signal_type} signal with ${signal.confidence_score}% confidence`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {signal.stock_id}
                      </h3>
                      <SignalBadge signal={signal.signal_type} confidence={signal.confidence_score} />
                      <time 
                        className="text-xs text-muted-foreground"
                        dateTime={signal.created_at}
                        aria-label={`Signal generated on ${format(new Date(signal.created_at), "MMMM d, yyyy 'at' h:mm a")}`}
                      >
                        {format(new Date(signal.created_at), "MMM d, HH:mm")}
                      </time>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                      {signal.explanation.summary}
                    </p>
                  </div>
                  <ArrowRight 
                    className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" 
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="No signals available"
            description="Check back later for new investment signals"
          />
        )}
      </CardContent>
    </Card>
  );
}
