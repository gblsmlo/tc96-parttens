import { Stats3 } from '@tc96/blocks/application/stats/stats-3'
import { capacity } from '../fixtures/stats-3.ts'
import type { Stats3Controls } from './stats-3-controls.ts'

export const ComposedStats3 = ({
  segments,
  title,
}: Readonly<Stats3Controls>) => (
  <Stats3 items={capacity} labels={{ title }} segments={segments} />
)
