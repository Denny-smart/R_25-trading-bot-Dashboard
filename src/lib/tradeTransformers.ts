/**
 * Transforms trade data from backend API format to frontend interface format
 */

export interface BackendTrade {
  contract_id: string;
  direction: 'BUY' | 'SELL';
  stake: number;
  entry_price: number;
  take_profit?: number;
  stop_loss?: number;
  status: 'open' | 'closed' | 'win' | 'loss';
  pnl: number | null;
  exit_price?: number;
  time?: string;
}

export interface FrontendTrade {
  id: string;
  time: string;
  direction: 'RISE' | 'FALL';
  entry_price: number;
  exit_price?: number;
  stake: number;
  profit?: number;
  profit_percent?: number;
  duration?: number;
  status: 'open' | 'win' | 'loss' | 'closed';
}

export interface BackendTradeStats {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  total_pnl: number;
  daily_pnl: number;
}

export interface FrontendTradeStats {
  total_trades: number;
  win_rate: number;
  total_profit: number;
  avg_win: number;
  avg_loss: number;
  largest_win: number;
  largest_loss: number;
  avg_duration: number;
  profit_factor: number;
}

/**
 * Transforms a single backend trade to frontend format
 */
export function transformTrade(backendTrade: BackendTrade | any, index: number = 0): FrontendTrade {
  // Ensure we have valid trade data
  if (!backendTrade || typeof backendTrade !== 'object') {
    console.warn('Invalid trade data received:', backendTrade);
    return {
      id: `unknown-${index}`,
      time: new Date().toISOString(),
      direction: 'RISE',
      entry_price: 0,
      stake: 0,
      status: 'open',
    };
  }

  const direction = (backendTrade.direction === 'BUY' || backendTrade.direction === 'RISE') ? 'RISE' : 'FALL';
  const time = backendTrade.time || backendTrade.timestamp || new Date().toISOString();
  
  // Determine status based on pnl for history trades
  let status: 'open' | 'win' | 'loss' | 'closed' = backendTrade.status as any;
  if (backendTrade.pnl !== null && backendTrade.pnl !== undefined && backendTrade.status === 'open') {
    status = backendTrade.pnl > 0 ? 'win' : backendTrade.pnl < 0 ? 'loss' : 'closed';
  }

  const transformed: FrontendTrade = {
    id: backendTrade.contract_id || backendTrade.id || `trade-${index}`,
    time,
    direction,
    entry_price: Number(backendTrade.entry_price) || 0,
    exit_price: backendTrade.exit_price ? Number(backendTrade.exit_price) : undefined,
    stake: Number(backendTrade.stake) || 0,
    profit: backendTrade.pnl !== null && backendTrade.pnl !== undefined ? Number(backendTrade.pnl) : undefined,
    profit_percent: backendTrade.pnl ? (Number(backendTrade.pnl) / Number(backendTrade.stake)) * 100 : undefined,
    duration: undefined,
    status,
  };

  return transformed;
}

/**
 * Transforms backend trades array to frontend format
 */
export function transformTrades(backendTrades: (BackendTrade | any)[] | any): FrontendTrade[] {
  // Handle case where backendTrades is not an array
  if (!Array.isArray(backendTrades)) {
    console.warn('Expected array of trades, got:', typeof backendTrades);
    return [];
  }

  return backendTrades.map((trade, index) => transformTrade(trade, index));
}

/**
 * Transforms backend trade stats to frontend format
 */
export function transformTradeStats(backendStats: BackendTradeStats): FrontendTradeStats {
  const avgWin = backendStats.winning_trades > 0 
    ? backendStats.total_pnl / backendStats.winning_trades 
    : 0;
  
  const avgLoss = backendStats.losing_trades > 0 
    ? backendStats.total_pnl / backendStats.losing_trades 
    : 0;

  const profitFactor = avgLoss !== 0 && avgLoss < 0 
    ? Math.abs(avgWin / avgLoss) 
    : avgWin > 0 ? Infinity : 0;

  return {
    total_trades: backendStats.total_trades,
    win_rate: backendStats.win_rate,
    total_profit: backendStats.total_pnl,
    avg_win: avgWin,
    avg_loss: Math.abs(avgLoss),
    largest_win: backendStats.total_pnl, // Placeholder - backend should provide this
    largest_loss: -backendStats.total_pnl, // Placeholder - backend should provide this
    avg_duration: 0, // Backend doesn't provide this yet
    profit_factor: profitFactor,
  };
}
