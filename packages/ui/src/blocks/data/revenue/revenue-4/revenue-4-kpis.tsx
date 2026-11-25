import { Badge } from '@tc96/ui/badge'
import type { TableFormatter } from '../../shared/table/format'
import type { Revenue4Labels, Revenue4Summary } from './types'

export function Revenue4Kpis({
  formatter,
  labels,
  summary,
}: Readonly<{
  formatter: TableFormatter
  labels: Revenue4Labels
  summary: Revenue4Summary
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
      data-slot="revenue-4-kpis"
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
