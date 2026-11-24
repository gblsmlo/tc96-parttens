import { Stats7 } from '@tc96/blocks/application/stats/stats-7'
import { stats7Metrics } from '../fixtures/stats-7.ts'
import type { Stats7Controls } from './stats-7-controls.ts'

export const ComposedStats7 = ({
  currency,
  empty,
  error,
  pending,
  title,
}: Readonly<Stats7Controls>) => (
  <Stats7
    currency={currency}
    error={error}
    labels={{ title }}
    metrics={empty ? [] : stats7Metrics}
    onRetry={() => undefined}
    pending={pending}
  />
)
