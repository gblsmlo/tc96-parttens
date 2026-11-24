import {
  Dashboard1,
  type Dashboard1Props,
} from '@tc96/blocks/application/dashboard/dashboard-1'
import { useState } from 'react'
import {
  capacity,
  exceptions,
  filterExceptions,
  filterOptions,
  kpis,
} from '../fixtures/dashboard-1.ts'
import type { Dashboard1Controls } from './dashboard-1-controls.ts'

interface ComposedDashboard1Props extends Dashboard1Controls {
  onFilterChange?: Dashboard1Props['onFilterChange']
  onRetry?: Dashboard1Props['onRetry']
}

export const ComposedDashboard1 = ({
  deltas,
  empty,
  error,
  onFilterChange,
  onRetry,
  pending,
  title,
}: Readonly<ComposedDashboard1Props>) => {
  const [filter, setFilter] = useState('all')

  return (
    <Dashboard1
      capacity={empty ? [] : capacity}
      error={error}
      exceptions={empty ? [] : filterExceptions(exceptions, filter)}
      filter={filter}
      filterOptions={filterOptions}
      kpis={
        empty
          ? []
          : kpis.map((kpi) => (deltas ? kpi : { ...kpi, delta: undefined }))
      }
      labels={{ title }}
      onFilterChange={(next) => {
        setFilter(next)
        onFilterChange?.(next)
      }}
      onRetry={onRetry}
      pending={pending}
    />
  )
}
