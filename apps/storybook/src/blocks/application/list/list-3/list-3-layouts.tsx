import {
  List3,
  type List3Period,
  type List3Props,
} from '@tc96/ui/blocks/application/list/list-3'
import { useEffect, useState } from 'react'
import { transactionsByPeriod } from '../fixtures/list-3.ts'
import type { List3Controls } from './list-3-controls.ts'

interface ComposedList3Props extends List3Controls {
  onPeriodChange?: List3Props['onPeriodChange']
}

export const ComposedList3 = ({
  currency,
  empty,
  onPeriodChange,
  period: initialPeriod,
  title,
}: Readonly<ComposedList3Props>) => {
  const [period, setPeriod] = useState<List3Period>(initialPeriod)

  useEffect(() => setPeriod(initialPeriod), [initialPeriod])

  return (
    <List3
      currency={currency}
      labels={{ title }}
      onPeriodChange={(next) => {
        setPeriod(next)
        onPeriodChange?.(next)
      }}
      period={period}
      transactions={empty ? [] : transactionsByPeriod[period]}
    />
  )
}
