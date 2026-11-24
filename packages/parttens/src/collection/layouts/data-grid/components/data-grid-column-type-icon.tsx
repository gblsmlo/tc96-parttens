'use client'

import {
  ArrowSquareOutIcon,
  CalculatorIcon,
  CalendarBlankIcon,
  CalendarPlusIcon,
  CheckSquareIcon,
  ClockCounterClockwiseIcon,
  CursorClickIcon,
  EnvelopeSimpleIcon,
  FingerprintIcon,
  HashIcon,
  LinkSimpleIcon,
  ListBulletsIcon,
  MapPinIcon,
  PaperclipIcon,
  PhoneIcon,
  type Icon as PhosphorIcon,
  RadioButtonIcon,
  SigmaIcon,
  TagSimpleIcon,
  TextHOneIcon,
  TextTIcon,
  UserGearIcon,
  UserIcon,
  UserPlusIcon,
} from '@phosphor-icons/react'
import type { DataGridColumnType } from '../types'

export const DATA_GRID_COLUMN_TYPE_ICONS = {
  title: TextHOneIcon,
  text: TextTIcon,
  number: HashIcon,
  select: ListBulletsIcon,
  'multi-select': TagSimpleIcon,
  status: RadioButtonIcon,
  date: CalendarBlankIcon,
  formula: SigmaIcon,
  relation: LinkSimpleIcon,
  rollup: CalculatorIcon,
  person: UserIcon,
  file: PaperclipIcon,
  checkbox: CheckSquareIcon,
  url: ArrowSquareOutIcon,
  email: EnvelopeSimpleIcon,
  phone: PhoneIcon,
  'created-time': CalendarPlusIcon,
  'created-by': UserPlusIcon,
  'last-edited-time': ClockCounterClockwiseIcon,
  'last-edited-by': UserGearIcon,
  button: CursorClickIcon,
  id: FingerprintIcon,
  place: MapPinIcon,
} satisfies Record<DataGridColumnType, PhosphorIcon>

export function DataGridColumnTypeIcon({ type }: { type: DataGridColumnType }) {
  const Icon = DATA_GRID_COLUMN_TYPE_ICONS[type]

  return (
    <Icon
      aria-hidden="true"
      className="size-3.5 shrink-0 text-muted-foreground"
      data-column-type={type}
      data-slot="data-grid-column-type-icon"
    />
  )
}
