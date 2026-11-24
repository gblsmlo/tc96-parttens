import {
  List2,
  type List2Props,
  type List2Range,
} from '@tc96/blocks/application/list/list-2'
import { useEffect, useState } from 'react'
import { entriesByRange } from '../fixtures/list-2.ts'
import type { List2Controls } from './list-2-controls.ts'

interface ComposedList2Props extends List2Controls {
  onRangeChange?: List2Props['onRangeChange']
}

export const ComposedList2 = ({
  currency,
  empty,
  onRangeChange,
  range: initialRange,
  title,
}: Readonly<ComposedList2Props>) => {
  const [range, setRange] = useState<List2Range>(initialRange)

  useEffect(() => setRange(initialRange), [initialRange])

  return (
    <List2
      currency={currency}
      entries={empty ? [] : entriesByRange[range]}
      labels={{ title }}
      onRangeChange={(next) => {
        setRange(next)
        onRangeChange?.(next)
      }}
      range={range}
    />
  )
}
