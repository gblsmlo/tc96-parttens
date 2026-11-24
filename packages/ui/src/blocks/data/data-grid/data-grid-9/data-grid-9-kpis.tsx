import type { ReactNode } from 'react'
import type { GridFormatter } from '../shared/format'
import { DeltaText } from './data-grid-9-cells'
import type { DataGrid9Labels, DataGrid9Summary } from './types'

function Kpi({
  detail,
  id,
  label,
  value,
}: Readonly<{ detail: ReactNode; id: string; label: string; value: string }>) {
  return (
    <li
      className="grid min-w-0 content-start gap-1 bg-background p-4"
      data-kpi={id}
    >
      <span className="truncate text-muted-foreground text-xs">{label}</span>
      <span className="truncate font-semibold text-xl tabular-nums">
        {value}
      </span>
      <span className="truncate text-muted-foreground text-xs tabular-nums">
        {detail}
      </span>
    </li>
  )
}

export function DataGrid9Kpis({
  formatter,
  labels,
  summary,
  total,
}: Readonly<{
  formatter: GridFormatter
  labels: DataGrid9Labels
  summary: DataGrid9Summary
  total: number
}>) {
  const budgetShare = summary.budget > 0 ? summary.spend / summary.budget : 0

  return (
    <ul
      aria-label={labels.kpis}
      className="m-0 grid list-none grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border p-0 md:grid-cols-3 xl:grid-cols-6"
      data-slot="data-grid-9-kpis"
    >
      <Kpi
        detail={labels.ofBudget(formatter.percent(budgetShare))}
        id="spend"
        label={labels.kpiSpend}
        value={formatter.compactMoney(summary.spend)}
      />
      <Kpi
        detail={labels.ctr(formatter.percent(summary.ctr, 2))}
        id="impressions"
        label={labels.kpiImpressions}
        value={formatter.compact(summary.impressions)}
      />
      <Kpi
        detail={
          <DeltaText
            favorableWhen="up"
            formatter={formatter}
            labels={labels}
            value={summary.conversionsDelta}
          />
        }
        id="conversions"
        label={labels.kpiConversions}
        value={formatter.number(summary.conversions)}
      />
      <Kpi
        detail={
          <DeltaText
            favorableWhen="down"
            formatter={formatter}
            labels={labels}
            value={summary.averageCpaDelta}
          />
        }
        id="cpa"
        label={labels.kpiCpa}
        value={formatter.money(summary.averageCpa, 2)}
      />
      <Kpi
        detail={labels.roasTarget(
          `${formatter.number(summary.roasTarget, 1)}x`,
        )}
        id="roas"
        label={labels.kpiRoas}
        value={`${formatter.number(summary.averageRoas, 1)}x`}
      />
      <Kpi
        detail={labels.ofCampaigns(total)}
        id="below-target"
        label={labels.kpiBelowTarget}
        value={formatter.number(summary.belowTarget)}
      />
    </ul>
  )
}
