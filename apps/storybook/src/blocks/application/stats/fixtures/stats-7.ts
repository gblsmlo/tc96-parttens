import type { Stats7Metric } from '@tc96/ui/blocks/application/stats/stats-7'
import { metrics } from '../../dashboard/fixtures/dashboard-4.ts'

export const stats7Metrics: Stats7Metric[] = metrics.map(
  ({ format, ...metric }) => ({ ...metric, kind: format }),
)
