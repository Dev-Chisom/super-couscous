"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWatchlistStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { SuspenseFallback } from "@/components/suspense-fallback";
import { Star, Globe, Sparkles, ArrowRight } from "lucide-react";
import { TopSignals } from "@/components/top-signals";
import Link from "next/link";

export default function Dashboard() {
  const { watchlist, removeFromWatchlist } = useWatchlistStore();

  const { data: topSignals } = useQuery({
    queryKey: ["top-signals-count"],
    queryFn: () => api.signals.getTop({ limit: 100 }),
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
      <div className="mb-6 sm:mb-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Dashboard
          </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-0.5 sm:mt-1">
              AI-powered investment signals for US and Nigerian markets
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Signals Today */}
        <Suspense fallback={<SuspenseFallback message="Loading signals..." />}>
          <TopSignals />
        </Suspense>

        {/* Watchlist */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary fill-primary" />
              Watchlist
            </CardTitle>
            <CardDescription>Stocks you're tracking</CardDescription>
          </CardHeader>
          <CardContent>
            {watchlist.length > 0 ? (
              <div className="space-y-2">
                {watchlist.map((symbol) => (
                  <div
                    key={symbol}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors group"
                  >
                    <Link 
                      href={`/stocks/${symbol}`} 
                      className="font-medium hover:text-primary transition-colors flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                      aria-label={`View ${symbol} stock details`}
                    >
                      {symbol}
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWatchlist(symbol)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100"
                      aria-label={`Remove ${symbol} from watchlist`}
                    >
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" aria-hidden="true" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Star}
                title="Your watchlist is empty"
                description="Add stocks to track them here"
              />
            )}
          </CardContent>
        </Card>

        {/* Market Highlights */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              US Market Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Top Movers</span>
                <span className="text-lg font-semibold text-green-600">+2.3%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Active Signals</span>
                <span className="text-lg font-semibold">{topSignals?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              NGX Market Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Top Movers</span>
                <span className="text-lg font-semibold text-green-600">+1.8%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Active Signals</span>
                <span className="text-lg font-semibold">-</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to market pages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/markets/us">
              <Button variant="outline" className="w-full justify-between group">
                <span>Browse US Stocks</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/markets/ngx">
              <Button variant="outline" className="w-full justify-between group">
                <span>Browse NGX Stocks</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        </div>
    </div>
  );
}
