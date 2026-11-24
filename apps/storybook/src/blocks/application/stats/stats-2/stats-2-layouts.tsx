import {
  Stats2,
  type Stats2Props,
} from '@tc96/blocks/application/stats/stats-2'
import { quotaUsage } from '../fixtures/stats-2.ts'
import type { Stats2Controls } from './stats-2-controls.ts'

interface ComposedStats2Props extends Stats2Controls {
  onUpgrade?: Stats2Props['onUpgrade']
}

const ignore = () => undefined

export const ComposedStats2 = ({
  limit,
  onUpgrade = ignore,
  quota,
  title,
  upgrade,
  used,
  withUpgrade,
}: Readonly<ComposedStats2Props>) => (
  <Stats2
    className="mx-auto max-w-md"
    cost={quotaUsage.cost}
    labels={{ quota, title, upgrade }}
    limit={limit}
    onUpgrade={withUpgrade ? onUpgrade : undefined}
    renewsAt={new Date(quotaUsage.renewsAt)}
    timeZone="UTC"
    used={used}
  />
)
