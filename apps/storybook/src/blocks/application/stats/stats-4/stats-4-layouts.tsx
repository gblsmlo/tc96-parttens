import {
  Stats4,
  type Stats4Props,
  type Stats4Range,
} from '@tc96/blocks/application/stats/stats-4'
import { useEffect, useState } from 'react'
import { leadsOverview } from '../fixtures/stats-4.ts'
import type { Stats4Controls } from './stats-4-controls.ts'

interface ComposedStats4Props extends Stats4Controls {
  onRangeChange?: Stats4Props['onRangeChange']
}

export const ComposedStats4 = ({
  empty,
  goal,
  onRangeChange,
  range: initialRange,
  title,
  total,
}: Readonly<ComposedStats4Props>) => {
  const [range, setRange] = useState<Stats4Range>(initialRange)

  useEffect(() => setRange(initialRange), [initialRange])

  return (
    <Stats4
      goal={goal}
      labels={{ title }}
      onRangeChange={(next) => {
        setRange(next)
        onRangeChange?.(next)
      }}
      range={range}
      sources={empty ? [] : leadsOverview.sources}
      total={total}
    />
  )
}
