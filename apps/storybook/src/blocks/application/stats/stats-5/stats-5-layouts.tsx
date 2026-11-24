import { Stats5 } from '@tc96/ui/blocks/application/stats/stats-5'
import { salesAndChurn } from '../fixtures/stats-5.ts'
import type { Stats5Controls } from './stats-5-controls.ts'

export const ComposedStats5 = ({
  churnTrend,
  currency,
  revenueTrend,
  title,
}: Readonly<Stats5Controls>) => (
  <Stats5
    currency={currency}
    items={salesAndChurn.map((item) => {
      if (item.id === 'revenue') return { ...item, trend: revenueTrend }
      if (item.id === 'churn') return { ...item, trend: churnTrend }
      return item
    })}
    labels={{ title }}
  />
)
