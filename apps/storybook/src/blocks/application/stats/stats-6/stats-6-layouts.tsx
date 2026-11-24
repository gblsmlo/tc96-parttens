import {
  Stats6,
  type Stats6Period,
  type Stats6Props,
} from '@tc96/blocks/application/stats/stats-6'
import { useEffect, useState } from 'react'
import { sleevesByPeriod } from '../fixtures/stats-6.ts'
import type { Stats6Controls } from './stats-6-controls.ts'

interface ComposedStats6Props extends Stats6Controls {
  onPeriodChange?: Stats6Props['onPeriodChange']
}

export const ComposedStats6 = ({
  currency,
  delta,
  onPeriodChange,
  period: initialPeriod,
  title,
}: Readonly<ComposedStats6Props>) => {
  const [period, setPeriod] = useState<Stats6Period>(initialPeriod)

  useEffect(() => setPeriod(initialPeriod), [initialPeriod])

  return (
    <Stats6
      currency={currency}
      labels={{ title }}
      onPeriodChange={(next) => {
        setPeriod(next)
        onPeriodChange?.(next)
      }}
      period={period}
      sleeves={sleevesByPeriod[period].map((sleeve, index) =>
        index === 0 ? { ...sleeve, delta } : sleeve,
      )}
    />
  )
}
