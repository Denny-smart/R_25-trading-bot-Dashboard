import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';

interface ProfitData {
  time: string;
  profit: number;
}

interface ProfitChartProps {
  data: ProfitData[];
}

export function ProfitChart({ data }: ProfitChartProps) {
  const isProfit = data.length > 0 && data[data.length - 1].profit >= 0;

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="font-semibold text-foreground">Profit Over Time</h3>
        <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md">Last 24 hours</span>
      </div>

      <div className="flex-1 min-h-0">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed border-white/5 rounded-xl bg-white/5/20">
            <span className="opacity-50">No data available</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isProfit ? 'hsl(150, 100%, 50%)' : 'hsl(0, 100%, 60%)'}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={isProfit ? 'hsl(150, 100%, 50%)' : 'hsl(0, 100%, 60%)'}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.2)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="rgba(255,255,255,0.2)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                dx={-10}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-2xl min-w-[150px]">
                        <p className="text-xs text-muted-foreground mb-2 pb-2 border-b border-white/10">
                          {payload[0].payload.time}
                        </p>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs font-medium text-foreground">Profit:</span>
                          <span
                            className={`font-mono font-bold text-sm ${payload[0].value && Number(payload[0].value) >= 0
                              ? 'text-success'
                              : 'text-destructive'
                              }`}
                          >
                            {formatCurrency(Number(payload[0].value) || 0)}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke={isProfit ? 'hsl(150, 100%, 50%)' : 'hsl(0, 100%, 60%)'}
                strokeWidth={2}
                fill="url(#profitGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
