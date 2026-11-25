import {
  ArchiveIcon,
  CheckCircleIcon,
  PencilSimpleIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Inventory1Status } from './types'

export const inventory1Statuses: readonly Inventory1Status[] = [
  'active',
  'draft',
  'archived',
]

export const inventory1StatusAppearance = {
  active: { icon: CheckCircleIcon, tone: 'success' },
  archived: { icon: ArchiveIcon, tone: 'danger' },
  draft: { icon: PencilSimpleIcon, tone: 'warning' },
} as const satisfies Record<Inventory1Status, DataOptionAppearance>
