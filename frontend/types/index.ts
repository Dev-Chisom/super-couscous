export type Market = "US" | "NGX";

export type SignalType = "BUY" | "HOLD" | "SELL" | "NO_SIGNAL";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type HoldingPeriod = "SHORT" | "MEDIUM" | "LONG";

export type StockType = "GROWTH" | "DIVIDEND" | "HYBRID";

export type AssetType = "STOCK" | "ETF" | "MUTUAL_FUND";

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  market: Market;
  asset_type?: AssetType;
  sector?: string;
  stock_type?: StockType | null;
  currency: string;
  is_active: boolean;
  created_at: string;
}

export interface StockPrice {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi?: number;
  macd?: number;
  sma_20?: number;
  sma_50?: number;
  ema_12?: number;
  ema_26?: number;
  bollinger_upper?: number;
  bollinger_lower?: number;
  volume_avg?: number;
  date: string;
}

export interface Fundamental {
  revenue?: number;
  eps?: number;
  pe_ratio?: number;
  debt_ratio?: number;
  earnings_growth?: number;
  dividend_yield?: number;
  dividend_per_share?: number;
  dividend_payout_ratio?: number;
  date: string;
}

export interface InvestorRecommendation {
  best_for: string[];
  strategy: string;
  time_horizon: string;
  action: string;
}

export interface StockClassification {
  stock_type: StockType;
  investor_recommendation: InvestorRecommendation;
}

export interface DividendFactor {
  score?: number;
  dividend_yield?: number;
  dividend_per_share?: number;
  dividend_payout_ratio?: number;
  is_dividend_stock?: boolean;
}

export interface EntryTimingFactor {
  score?: number;
  timing: "GOOD" | "FAIR" | "WAIT";
}

export interface LongTermTrendFactor {
  score?: number;
  factors?: string[];
}

export interface InvestmentGuidance {
  when_to_buy: "GOOD" | "FAIR" | "WAIT" | string;
  how_long_to_hold: "SHORT" | "MEDIUM" | "LONG" | string;
  when_to_sell: string;
}

export interface SignalExplanation {
  summary: string;
  investment_focus?: boolean;
  factors: {
    technical?: Record<string, any>;
    fundamental?: Record<string, any>;
    trend?: Record<string, any>;
    dividend?: DividendFactor;
    entry_timing?: EntryTimingFactor;
    long_term_trend?: LongTermTrendFactor;
  };
  investment_guidance?: InvestmentGuidance;
  triggers: string[];
  risks: string[];
  invalidation_conditions: string[];
  stock_classification?: StockClassification;
}

export interface Signal {
  id: string;
  stock_id: string;
  signal_type: SignalType;
  confidence_score: number; // 0-100
  risk_level: RiskLevel;
  holding_period: HoldingPeriod;
  explanation: SignalExplanation;
  created_at: string;
}

export interface BacktestResult {
  total_return: number;
  win_rate: number;
  max_drawdown: number;
  sharpe_ratio: number;
  total_signals: number;
  profitable_signals: number;
  period_start: string;
  period_end: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    cache_hit?: boolean;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}
