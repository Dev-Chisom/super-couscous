"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignalBadge } from "@/components/signal-badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Globe, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { Market } from "@/types";

export default function MarketPage() {
  const params = useParams();
  const market = (params.market as string).toUpperCase() as Market;

  const { data: stocks, isLoading } = useQuery({
    queryKey: ["market-stocks", market],
    queryFn: () => api.markets.getStocks(market),
    enabled: market === "US" || market === "NGX",
  });

  const { data: signals } = useQuery({
    queryKey: ["market-signals", market],
    queryFn: () => api.signals.getTop({ market, limit: 100 }),
    enabled: market === "US" || market === "NGX",
  });

  const signalsMap = new Map(
    (Array.isArray(signals) ? signals : []).map((signal) => [signal.stock_id, signal])
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground mt-4">Loading {market} stocks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {market} Market
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse all stocks and AI signals for the {market} market
            </p>
          </div>
        </div>
      </div>

      {Array.isArray(stocks) && stocks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stocks.map((stock) => {
            const signal = signalsMap.get(stock.symbol);
            return (
              <Card key={stock.id} className="group hover:shadow-lg transition-all hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">
                        {stock.symbol}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {stock.name}
                      </p>
                    </div>
                    {signal && (
                      <SignalBadge
                        signal={signal.signal_type}
                        confidence={signal.confidence_score}
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {stock.sector ? (
                      <Badge variant="secondary" className="text-xs">
                        {stock.sector}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                    <Link href={`/stocks/${stock.symbol}`}>
                      <Button variant="outline" size="sm" className="group/btn">
                        View
                        <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              icon={TrendingUp}
              title={`No stocks found for ${market} market`}
              description="Stocks will appear here once available"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
