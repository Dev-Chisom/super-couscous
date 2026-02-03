import type {
  ApiResponse,
  ApiError,
  Stock,
  StockPrice,
  Signal,
  TechnicalIndicators,
  Fundamental,
  BacktestResult,
  Market,
} from "@/types";

function getApiBaseUrl(): string {
  let baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  if (!baseUrl) {
    baseUrl = "http://localhost:8000";
  }
  
  baseUrl = baseUrl.trim();
  
  if (baseUrl.endsWith('/api/v1')) {
    baseUrl = baseUrl.replace('/api/v1', '').replace(/\/$/, '');
  }
  
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = `https://${baseUrl}`;
  }
  
  return baseUrl;
}

const API_BASE_URL = getApiBaseUrl();

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = API_BASE_URL;
  const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}/api/v1${endpointPath}`;
  
  if (typeof window !== 'undefined' && !url.startsWith('http://') && !url.startsWith('https://')) {
    console.error('Invalid API URL:', url, 'API_BASE_URL:', baseUrl, 'env:', process.env.NEXT_PUBLIC_API_URL);
    throw new ApiClientError(`Invalid API URL configuration: ${url}`, 0, "CONFIG_ERROR");
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiClientError(
        errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.error?.code,
        errorData.error?.details
      );
    }

    const data: ApiResponse<T> | ApiError = await response.json();

    if (!data.success && 'error' in data) {
      throw new ApiClientError(
        data.error.message,
        response.status,
        data.error.code,
        data.error.details
      );
    }

    return data.data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ApiClientError(error.message, 0, "NETWORK_ERROR");
    }
    throw new ApiClientError("An unknown error occurred", 0, "UNKNOWN_ERROR");
  }
}

function buildQueryString(params?: Record<string, any>): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const api = {
  stocks: {
    list: async (params?: { market?: Market; sector?: string; stock_type?: string; asset_type?: string; page?: number; limit?: number }) => {
      const query = buildQueryString(params);
      return fetchApi<Stock[]>(`/stocks${query}`);
    },
    get: async (symbol: string) => {
      return fetchApi<Stock>(`/stocks/${symbol}`);
    },
    getPrices: async (symbol: string, params?: { start_date?: string; end_date?: string; interval?: string }) => {
      const query = buildQueryString(params);
      return fetchApi<StockPrice[]>(`/stocks/${symbol}/prices${query}`);
    },
    getFundamentals: async (symbol: string) => {
      return fetchApi<Fundamental>(`/stocks/${symbol}/fundamentals`);
    },
    getIndicators: async (symbol: string) => {
      return fetchApi<TechnicalIndicators[]>(`/stocks/${symbol}/indicators`);
    },
  },

  signals: {
    get: async (symbol: string) => {
      return fetchApi<Signal>(`/stocks/${symbol}/signal`);
    },
    getTop: async (params?: { market?: Market; limit?: number }) => {
      const query = buildQueryString(params);
      const data = await fetchApi<Signal[] | { items: Signal[] }>(`/signals/top${query}`);
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        return data.items;
      }
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    },
    getHistory: async (symbol: string) => {
      return fetchApi<Signal[]>(`/stocks/${symbol}/signal/history`);
    },
  },

  markets: {
    getStocks: async (market: Market, params?: { asset_type?: string }) => {
      const query = buildQueryString(params);
      const data = await fetchApi<Stock[] | { items: Stock[] }>(`/markets/${market}/stocks${query}`);
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        return data.items;
      }
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    },
    getHighlights: async (market: Market) => {
      return fetchApi<any>(`/markets/${market}/highlights`);
    },
  },

  backtest: {
    get: async (symbol: string) => {
      return fetchApi<BacktestResult>(`/stocks/${symbol}/backtest`);
    },
  },
};
