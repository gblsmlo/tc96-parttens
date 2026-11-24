import {
  Dashboard2,
  type Dashboard2Props,
  type Dashboard2Sort,
} from '@tc96/blocks/application/dashboard/dashboard-2'
import { useState } from 'react'
import {
  channels,
  initialSort,
  kpis,
  orders,
  sales,
  sortOrders,
} from '../fixtures/dashboard-2.ts'
import type { Dashboard2Controls } from './dashboard-2-controls.ts'

interface ComposedDashboard2Props extends Dashboard2Controls {
  onRetry?: Dashboard2Props['onRetry']
  onSortChange?: Dashboard2Props['onSortChange']
}

export const ComposedDashboard2 = ({
  empty,
  error,
  onRetry,
  onSortChange,
  pending,
  sparklines,
  title,
}: Readonly<ComposedDashboard2Props>) => {
  const [sort, setSort] = useState<Dashboard2Sort>(initialSort)

  return (
    <Dashboard2
      channels={channels}
      error={error}
      kpis={
        empty
          ? []
          : kpis.map((kpi) =>
              sparklines ? kpi : { ...kpi, sparkline: undefined },
            )
      }
      labels={{ title }}
      onRetry={onRetry}
      onSortChange={(next) => {
        setSort(next)
        onSortChange?.(next)
      }}
      orders={empty ? [] : sortOrders(orders, sort)}
      pending={pending}
      sales={empty ? [] : sales}
      sort={sort}
    />
  )
}
