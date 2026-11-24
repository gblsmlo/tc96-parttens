import {
  Stats1,
  type Stats1Props,
} from '@tc96/blocks/application/stats/stats-1'
import { stats } from '../fixtures/stats-1.ts'
import type { Stats1Controls } from './stats-1-controls.ts'

interface ComposedStats1Props extends Stats1Controls {
  onStatAction?: Stats1Props['onStatAction']
}

const ignore = () => undefined

export const ComposedStats1 = ({
  details,
  empty,
  export: exportLabel,
  onStatAction = ignore,
  title,
  withActions,
}: Readonly<ComposedStats1Props>) => (
  <Stats1
    labels={{ details, export: exportLabel, title }}
    onStatAction={withActions ? onStatAction : undefined}
    stats={empty ? [] : stats}
  />
)
