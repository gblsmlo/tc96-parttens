import { Badge } from '@tc96/ui/badge'
import type { GridFormatter } from '../shared/format'
import type { DataGrid6Labels, DataGrid6Summary } from './types'

export function DataGrid6Kpis({
  formatter,
  labels,
  summary,
}: Readonly<{
  formatter: GridFormatter
  labels: DataGrid6Labels
  summary: DataGrid6Summary
}>) {
  const kpis = [
    {
      id: 'total-arr',
      label: labels.totalArr,
      tone: 'outline',
      value: formatter.compactMoney(summary.totalArr),
    },
    {
      id: 'portfolio-nrr',
      label: labels.portfolioNrr,
      tone: summary.portfolioNrr < 1 ? 'error' : 'success',
      value: formatter.percent(summary.portfolioNrr),
    },
    {
      id: 'at-risk-arr',
      label: labels.atRiskArr,
      tone: 'error',
      value: formatter.compactMoney(summary.atRiskArr),
    },
  ] as const

  return (
    <dl
      aria-label={labels.kpis}
      className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 divide-x"
      data-slot="data-grid-6-kpis"
    >
      {kpis.map((kpi) => (
        <div
          className="flex items-center gap-2 pe-3 last:pe-0"
          data-kpi={kpi.id}
          key={kpi.id}
        >
          <dt className="text-muted-foreground text-xs">{kpi.label}</dt>
          <dd className="m-0">
            <Badge className="tabular-nums" variant={kpi.tone}>
              {kpi.value}
            </Badge>
          </dd>
        </div>
      ))}
    </dl>
  )
}
