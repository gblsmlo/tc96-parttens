import {
  ArchiveIcon,
  CheckCircleIcon,
  PencilSimpleIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Inventory2Status } from './types'

export const inventory2Statuses: readonly Inventory2Status[] = [
  'active',
  'draft',
  'archived',
]

export const inventory2StatusAppearance = {
  active: { icon: CheckCircleIcon, tone: 'success' },
  archived: { icon: ArchiveIcon, tone: 'danger' },
  draft: { icon: PencilSimpleIcon, tone: 'warning' },
} as const satisfies Record<Inventory2Status, DataOptionAppearance>
