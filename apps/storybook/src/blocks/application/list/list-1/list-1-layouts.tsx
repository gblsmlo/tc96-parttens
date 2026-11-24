import { List1 } from '@tc96/blocks/application/list/list-1'
import { metrics } from '../fixtures/list-1.ts'
import type { List1Controls } from './list-1-controls.ts'

export const ComposedList1 = ({
  currency,
  empty,
  showTrend,
  title,
}: Readonly<List1Controls>) => (
  <List1
    currency={currency}
    labels={{ title }}
    metrics={
      empty
        ? []
        : metrics.map((metric) =>
            showTrend ? metric : { ...metric, change: undefined },
          )
    }
  />
)
