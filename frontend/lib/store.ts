import { create } from "zustand";

interface WatchlistStore {
  watchlist: string[]; // Stock symbols
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
}

export const useWatchlistStore = create<WatchlistStore>((set, get) => ({
  watchlist: [],
  addToWatchlist: (symbol) =>
    set((state) => ({
      watchlist: state.watchlist.includes(symbol) ? state.watchlist : [...state.watchlist, symbol],
    })),
  removeFromWatchlist: (symbol) =>
    set((state) => ({
      watchlist: state.watchlist.filter((s) => s !== symbol),
    })),
  isInWatchlist: (symbol) => get().watchlist.includes(symbol),
}));
