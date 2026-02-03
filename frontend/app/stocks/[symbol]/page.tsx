"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignalBadge } from "@/components/signal-badge";
import { StockChart } from "@/components/stock-chart";
import { StockTypeBadge } from "@/components/stock-type-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWatchlistStore } from "@/lib/store";
import { Star, ArrowLeft, TrendingUp, AlertTriangle, Info, BarChart3, DollarSign } from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EmptyState } from "@/components/empty-state";

export default function StockDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();

  const { data: stock, isLoading: stockLoading } = useQuery({
    queryKey: ["stock", symbol],
    queryFn: () => api.stocks.get(symbol),
    enabled: !!symbol,
  });

  const { data: prices, isLoading: pricesLoading } = useQuery({
    queryKey: ["prices", symbol],
    queryFn: () => api.stocks.getPrices(symbol, { interval: "1d" }),
    enabled: !!symbol,
  });

  const { data: signal, isLoading: signalLoading } = useQuery({
    queryKey: ["signal", symbol],
    queryFn: () => api.signals.get(symbol),
    enabled: !!symbol,
  });

  const { data: fundamentals } = useQuery({
    queryKey: ["fundamentals", symbol],
    queryFn: () => api.stocks.getFundamentals(symbol),
    enabled: !!symbol,
  });

  const { data: indicators } = useQuery({
    queryKey: ["indicators", symbol],
    queryFn: () => api.stocks.getIndicators(symbol),
    enabled: !!symbol,
  });

  const { data: backtest } = useQuery({
    queryKey: ["backtest", symbol],
    queryFn: () => api.backtest.get(symbol),
    enabled: !!symbol,
  });

  const inWatchlist = isInWatchlist(symbol);

  if (stockLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground mt-4">Loading stock data...</p>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Stock not found</h2>
          <Link href="/">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const latestPrice = prices && prices.length > 0 ? prices[prices.length - 1] : null;
  const latestIndicators = indicators && indicators.length > 0 ? indicators[indicators.length - 1] : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {stock.name}
              </h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="text-sm px-3 py-1">{stock.market}</Badge>
              {stock.sector && (
                <Badge variant="secondary" className="text-sm px-3 py-1">{stock.sector}</Badge>
              )}
              {stock.stock_type && (
                <StockTypeBadge stockType={stock.stock_type} />
              )}
              {latestPrice && (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {stock.currency} {latestPrice.close.toFixed(2)}
                  </span>
                  {prices && prices.length > 1 && prices[prices.length - 2] && (
                    <span className={`text-sm font-medium ${
                      latestPrice.close >= prices[prices.length - 2]!.close 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {latestPrice.close >= prices[prices.length - 2]!.close ? '+' : ''}
                      {((latestPrice.close - prices[prices.length - 2]!.close) / prices[prices.length - 2]!.close * 100).toFixed(2)}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <Button
            variant={inWatchlist ? "default" : "outline"}
            onClick={() => {
              if (inWatchlist) {
                removeFromWatchlist(symbol);
              } else {
                addToWatchlist(symbol);
              }
            }}
            className="w-full md:w-auto"
          >
            <Star
              className={`h-4 w-4 mr-2 ${inWatchlist ? "fill-yellow-500 text-yellow-500" : ""}`}
            />
            {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
          </Button>
        </div>
      </div>

      {signalLoading ? (
        <Card className="mb-6">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground mt-4">Loading signal...</p>
            </div>
          </CardContent>
        </Card>
      ) : signal ? (
        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>AI Investment Signal</CardTitle>
                  <CardDescription>Current recommendation based on AI analysis</CardDescription>
                </div>
              </div>
              <SignalBadge signal={signal.signal_type} confidence={signal.confidence_score} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Confidence</div>
                <div className="text-3xl font-bold">{signal.confidence_score}%</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Risk Level</div>
                <Badge variant="outline" className="text-base px-3 py-1.5">
                  {signal.risk_level}
                </Badge>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Holding Period</div>
                <Badge variant="outline" className="text-base px-3 py-1.5">
                  {signal.holding_period}
                </Badge>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">Why {signal.signal_type}?</h3>
                    <p className="text-foreground leading-relaxed">{signal.explanation.summary}</p>
                  </div>
                </div>
              </div>

              {signal.explanation.triggers.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Key Triggers
                  </h3>
                  <ul className="space-y-2">
                    {signal.explanation.triggers.map((trigger, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-foreground">{trigger}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {signal.explanation.risks.length > 0 && (
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                    <AlertTriangle className="h-4 w-4" />
                    Risks to Consider
                  </h3>
                  <ul className="space-y-2">
                    {signal.explanation.risks.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-yellow-600 dark:text-yellow-500 mt-1">•</span>
                        <span className="text-foreground">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {signal.explanation.invalidation_conditions.length > 0 && (
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-600 dark:text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    Invalidation Conditions
                  </h3>
                  <ul className="space-y-2">
                    {signal.explanation.invalidation_conditions.map((condition, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-500 mt-1">•</span>
                        <span className="text-foreground">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {signal.explanation.stock_classification && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Investment Recommendation
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Stock Type</div>
                      <StockTypeBadge stockType={signal.explanation.stock_classification.stock_type} />
                    </div>
                    {signal.explanation.stock_classification.investor_recommendation.best_for.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Best For:</div>
                        <ul className="space-y-1">
                          {signal.explanation.stock_classification.investor_recommendation.best_for.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-1">•</span>
                              <span className="text-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {signal.explanation.stock_classification.investor_recommendation.strategy && (
                      <div>
                        <div className="text-sm font-medium mb-1">Strategy:</div>
                        <p className="text-sm text-foreground">
                          {signal.explanation.stock_classification.investor_recommendation.strategy}
                        </p>
                      </div>
                    )}
                    {signal.explanation.stock_classification.investor_recommendation.time_horizon && (
                      <div>
                        <div className="text-sm font-medium mb-1">Time Horizon:</div>
                        <p className="text-sm text-foreground">
                          {signal.explanation.stock_classification.investor_recommendation.time_horizon}
                        </p>
                      </div>
                    )}
                    {signal.explanation.stock_classification.investor_recommendation.action && (
                      <div className="pt-2 border-t">
                        <div className="text-sm font-medium mb-1">Recommended Action:</div>
                        <p className="text-sm font-semibold text-primary">
                          {signal.explanation.stock_classification.investor_recommendation.action}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Price Chart
            </CardTitle>
            <CardDescription>Historical price data</CardDescription>
          </CardHeader>
          <CardContent>
            {pricesLoading ? (
              <div className="h-[400px] flex flex-col items-center justify-center">
                <LoadingSpinner size="lg" />
                <p className="text-muted-foreground mt-4">Loading chart...</p>
              </div>
            ) : prices && prices.length > 0 ? (
              <StockChart data={prices} height={400} />
            ) : (
              <EmptyState
                icon={BarChart3}
                title="No price data available"
                description="Price data will appear here once available"
                className="h-[400px]"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Technical Indicators
            </CardTitle>
            <CardDescription>Latest technical analysis metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {latestIndicators ? (
              <div className="grid grid-cols-2 gap-4">
                {latestIndicators.rsi !== undefined && latestIndicators.rsi !== null && typeof latestIndicators.rsi === 'number' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">RSI</div>
                    <div className="text-2xl font-semibold">{latestIndicators.rsi.toFixed(2)}</div>
                  </div>
                )}
                {latestIndicators.macd !== undefined && latestIndicators.macd !== null && typeof latestIndicators.macd === 'number' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">MACD</div>
                    <div className="text-2xl font-semibold">{latestIndicators.macd.toFixed(2)}</div>
                  </div>
                )}
                {latestIndicators.sma_20 !== undefined && latestIndicators.sma_20 !== null && typeof latestIndicators.sma_20 === 'number' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">SMA 20</div>
                    <div className="text-2xl font-semibold">{latestIndicators.sma_20.toFixed(2)}</div>
                  </div>
                )}
                {latestIndicators.sma_50 !== undefined && latestIndicators.sma_50 !== null && typeof latestIndicators.sma_50 === 'number' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">SMA 50</div>
                    <div className="text-2xl font-semibold">{latestIndicators.sma_50.toFixed(2)}</div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                icon={BarChart3}
                title="No indicators available"
                description="Technical indicators will appear here once calculated"
              />
            )}
          </CardContent>
        </Card>

        {fundamentals && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Fundamentals
              </CardTitle>
              <CardDescription>Key financial metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {fundamentals.pe_ratio !== undefined && fundamentals.pe_ratio !== null && typeof fundamentals.pe_ratio === 'number' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">P/E Ratio</div>
                    <div className="text-2xl font-semibold">{fundamentals.pe_ratio.toFixed(2)}</div>
                  </div>
                )}
                {fundamentals.eps !== undefined && fundamentals.eps !== null && typeof fundamentals.eps === 'number' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">EPS</div>
                    <div className="text-2xl font-semibold">{fundamentals.eps.toFixed(2)}</div>
                  </div>
                )}
                {fundamentals.earnings_growth !== undefined && fundamentals.earnings_growth !== null && typeof fundamentals.earnings_growth === 'number' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Earnings Growth</div>
                    <div className={`text-2xl font-semibold ${
                      fundamentals.earnings_growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {fundamentals.earnings_growth >= 0 ? '+' : ''}{fundamentals.earnings_growth.toFixed(2)}%
                    </div>
                  </div>
                )}
                {fundamentals.revenue !== undefined && fundamentals.revenue !== null && typeof fundamentals.revenue === 'number' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Revenue</div>
                    <div className="text-2xl font-semibold">
                      {stock.currency} {(fundamentals.revenue / 1e9).toFixed(2)}B
                    </div>
                  </div>
                )}
              </div>
              {(fundamentals.dividend_yield !== undefined && fundamentals.dividend_yield !== null ||
                fundamentals.dividend_per_share !== undefined && fundamentals.dividend_per_share !== null ||
                fundamentals.dividend_payout_ratio !== undefined && fundamentals.dividend_payout_ratio !== null) && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Dividend Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {fundamentals.dividend_yield !== undefined && fundamentals.dividend_yield !== null && (
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-sm text-muted-foreground mb-1">Dividend Yield</div>
                        <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                          {typeof fundamentals.dividend_yield === 'number' ? fundamentals.dividend_yield.toFixed(2) : fundamentals.dividend_yield}%
                        </div>
                      </div>
                    )}
                    {fundamentals.dividend_per_share !== undefined && fundamentals.dividend_per_share !== null && (
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-sm text-muted-foreground mb-1">Dividend per Share</div>
                        <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                          {stock.currency} {typeof fundamentals.dividend_per_share === 'number' ? fundamentals.dividend_per_share.toFixed(2) : fundamentals.dividend_per_share}
                        </div>
                      </div>
                    )}
                    {fundamentals.dividend_payout_ratio !== undefined && fundamentals.dividend_payout_ratio !== null && (
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-sm text-muted-foreground mb-1">Payout Ratio</div>
                        <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                          {typeof fundamentals.dividend_payout_ratio === 'number' ? fundamentals.dividend_payout_ratio.toFixed(2) : fundamentals.dividend_payout_ratio}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {backtest && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Backtest Performance
              </CardTitle>
              <CardDescription>Historical signal performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {typeof backtest.total_return === 'number' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Total Return</div>
                    <div
                      className={`text-2xl font-semibold ${
                        backtest.total_return >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {backtest.total_return >= 0 ? "+" : ""}
                      {backtest.total_return.toFixed(2)}%
                    </div>
                  </div>
                )}
                {typeof backtest.win_rate === 'number' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                    <div className="text-2xl font-semibold">{(backtest.win_rate * 100).toFixed(1)}%</div>
                  </div>
                )}
                {typeof backtest.max_drawdown === 'number' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Max Drawdown</div>
                    <div className="text-2xl font-semibold text-red-600">
                      {backtest.max_drawdown.toFixed(2)}%
                    </div>
                  </div>
                )}
                {typeof backtest.sharpe_ratio === 'number' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Sharpe Ratio</div>
                    <div className="text-2xl font-semibold">{backtest.sharpe_ratio.toFixed(2)}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
