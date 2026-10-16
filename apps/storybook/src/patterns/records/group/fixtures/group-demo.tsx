import {
  DateProperty,
  RecordGroup,
  RecordGroupAction,
  RecordGroupRow,
  type RecordGroupRowAlign,
  type RecordGroupVariant,
  TextProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  CalendarDaysIcon,
  HashIcon,
  PlusIcon,
  ShapesIcon,
  UserIcon,
} from 'lucide-react'

interface RowFixture {
  icon: typeof ShapesIcon
  kind: 'date' | 'text'
  label: string
  value: string
}

export const detailRows: RowFixture[] = [
  { icon: ShapesIcon, kind: 'text', label: 'Type', value: 'Document request' },
  { icon: UserIcon, kind: 'text', label: 'Owner', value: 'Mariana Souza' },
  { icon: HashIcon, kind: 'text', label: 'Reference code', value: 'REQ-1042' },
  { icon: CalendarDaysIcon, kind: 'date', label: 'Due', value: '2026-10-21' },
]

export const longLabelRows: RowFixture[] = [
  { icon: ShapesIcon, kind: 'text', label: 'Type', value: 'Document request' },
  {
    icon: CalendarDaysIcon,
    kind: 'date',
    label:
      'Expected delivery date agreed with the customer after the second review',
    value: '2026-10-21',
  },
]

export const longValueRows: RowFixture[] = [
  { icon: ShapesIcon, kind: 'text', label: 'Type', value: 'Document request' },
  {
    icon: UserIcon,
    kind: 'text',
    label: 'Owner',
    value:
      'Mariana de Souza Albuquerque Figueiredo e Silva, Customer Success Department',
  },
]

interface RecordGroupDemoProps {
  actionLabel?: string
  align?: RecordGroupRowAlign
  defaultOpen?: boolean
  empty?: boolean
  emptyMessage?: string
  footerLabel?: string
  onAction?: () => void
  rows?: RowFixture[]
  title: string
  variant?: RecordGroupVariant
}

export function RecordGroupDemo({
  actionLabel,
  align = 'start',
  defaultOpen,
  empty = false,
  emptyMessage = 'No properties yet',
  footerLabel,
  onAction,
  rows = detailRows,
  title,
  variant,
}: Readonly<RecordGroupDemoProps>) {
  return (
    <RecordGroup
      actions={
        actionLabel ? (
          <RecordGroupAction
            icon={PlusIcon}
            label={actionLabel}
            onClick={onAction}
          />
        ) : undefined
      }
      defaultOpen={defaultOpen}
      empty={empty}
      footer={
        footerLabel ? <Button variant="ghost">{footerLabel}</Button> : undefined
      }
      title={title}
      variant={variant}
    >
      {empty ? (
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      ) : (
        rows.map((row) => (
          <RecordGroupRow
            align={align}
            key={row.label}
            label={row.label}
            leading={<row.icon aria-hidden="true" />}
          >
            {row.kind === 'date' ? (
              <DateProperty readOnly value={row.value} variant="plain" />
            ) : (
              <TextProperty value={row.value} variant="plain" />
            )}
          </RecordGroupRow>
        ))
      )}
    </RecordGroup>
  )
}
