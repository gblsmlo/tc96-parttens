import {
  Dashboard6,
  type Dashboard6Props,
} from '@tc96/ui/blocks/application/dashboard/dashboard-6'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import {
  crmPeriodOptions,
  initialCrmPeriod,
  lossReasons,
  stages,
  summary,
} from '../fixtures/dashboard-6.ts'
import { breadcrumbsFor } from '../fixtures/shared.ts'
import type { Dashboard6Controls } from './dashboard-6-controls.ts'

interface ComposedDashboard6Props extends Dashboard6Controls {
  onPeriodChange?: Dashboard6Props['onPeriodChange']
  onRetry?: Dashboard6Props['onRetry']
}

export const ComposedDashboard6 = ({
  empty,
  error,
  onPeriodChange,
  onRetry,
  pending,
  periodSelect,
  title,
}: Readonly<ComposedDashboard6Props>) => {
  const [period, setPeriod] = useState(initialCrmPeriod)

  return (
    <Dashboard6
      breadcrumbs={breadcrumbsFor(title)}
      error={error}
      labels={{ title }}
      lossReasons={empty ? [] : lossReasons}
      onPeriodChange={
        periodSelect
          ? (next) => {
              setPeriod(next)
              onPeriodChange?.(next)
            }
          : undefined
      }
      onRetry={onRetry}
      pending={pending}
      period={period}
      periodOptions={crmPeriodOptions}
      renderLink={renderAnchor}
      stages={empty ? [] : stages}
      summary={empty ? undefined : summary}
    />
  )
}
