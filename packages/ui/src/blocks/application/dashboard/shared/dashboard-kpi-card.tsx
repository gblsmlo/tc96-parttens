import { CardPanel } from '@tc96/ui/card'
import { WidgetShell } from '@tc96/ui/patterns/widgets/shared/widget-shell'
import { cn } from '@tc96/utils'
import { Line, LineChart, YAxis } from 'recharts'
import type { DashboardFormatter } from './format'
import type { DashboardKpi, DashboardTrend } from './types'

const trendClassNames: Record<DashboardTrend, string> = {
  negative: 'text-destructive-foreground',
  neutral: 'text-muted-foreground',
  positive: 'text-success-foreground',
}

export interface DashboardKpiCardProps {
  formatter: DashboardFormatter
  kpi: DashboardKpi
}

export function DashboardKpiCard({
  formatter,
  kpi,
}: Readonly<DashboardKpiCardProps>) {
  const points = kpi.sparkline?.map((value, index) => ({ index, value }))

  return (
    <WidgetShell data-kpi={kpi.id}>
      <CardPanel className="grid gap-2 p-5">
        <p className="text-muted-foreground text-sm">{kpi.label}</p>
        <div className="flex items-end justify-between gap-3">
          <div className="grid gap-1">
            <p className="font-semibold text-2xl tabular-nums">
              {formatter.value(kpi.value, kpi.format)}
            </p>
            {kpi.delta === undefined ? null : (
              <p
                className={cn(
                  'text-xs tabular-nums',
                  trendClassNames[kpi.trend ?? 'neutral'],
                )}
                data-slot="dashboard-kpi-delta"
              >
                {formatter.delta(kpi.delta)}
              </p>
            )}
          </div>
          {points?.length ? (
            <div aria-hidden="true" className="h-10 w-24 shrink-0">
              <LineChart
                accessibilityLayer={false}
                data={points}
                height={40}
                margin={{ bottom: 2, left: 2, right: 2, top: 2 }}
                width={96}
              >
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Line
                  dataKey="value"
                  dot={false}
                  isAnimationActive={false}
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </div>
          ) : null}
        </div>
      </CardPanel>
    </WidgetShell>
  )
}
