export type Market = "US" | "NGX";

export type SignalType = "BUY" | "HOLD" | "SELL" | "NO_SIGNAL";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type HoldingPeriod = "SHORT" | "MEDIUM" | "LONG";

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  market: Market;
  sector?: string;
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
  date: string;
}

export interface SignalExplanation {
  summary: string;
  factors: {
    technical?: Record<string, any>;
    fundamental?: Record<string, any>;
    trend?: Record<string, any>;
  };
  triggers: string[];
  risks: string[];
  invalidation_conditions: string[];
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
