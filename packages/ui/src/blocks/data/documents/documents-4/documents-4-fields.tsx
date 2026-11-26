import { PushPinIcon } from '@phosphor-icons/react'
import { formatMediumDate, parseIsoDate } from '@tc96/ui/helpers/date'
import { IconFrame, type IconFrameSize } from '@tc96/ui/icon-frame'
import { DataOwner } from '../../shared/properties/data-properties'
import { documents4TypeIcons } from './documents-4-options'
import type {
  Documents4Labels,
  Documents4Person,
  Documents4Record,
  Documents4TypeColors,
} from './types'

export interface Documents4FieldContext {
  labels: Documents4Labels
  locale: string
  onDelete?: (recordId: string) => void
  onDownload?: (recordId: string) => void
  onOpen?: (recordId: string) => void
  onPinnedChange?: (recordId: string, pinned: boolean) => void
  onSelectedChange?: (recordId: string, selected: boolean) => void
  people: readonly Documents4Person[]
  pinnedOrder: ReadonlyMap<string, number>
  selectedIds: ReadonlySet<string>
  timeZone: string
  typeColors?: Documents4TypeColors
}

interface FieldProps {
  context: Documents4FieldContext
  item: Documents4Record
}

export function formatDocuments4Updated(
  value: string,
  locale: string,
  timeZone: string,
): string {
  const date = parseIsoDate(value)
  if (!date) return value
  return formatMediumDate(date, locale, timeZone)
}

export function Documents4TypeIcon({
  context,
  item,
  size = 'xs',
}: FieldProps & { size?: IconFrameSize }) {
  const TypeIcon = documents4TypeIcons[item.type]
  return (
    <IconFrame
      color={context.typeColors?.[item.type]}
      data-type={item.type}
      shape="rounded"
      size={size}
    >
      <TypeIcon aria-hidden="true" />
    </IconFrame>
  )
}

export function Documents4PinnedMark({ context, item }: FieldProps) {
  if (!item.pinned) return null
  return (
    <span
      aria-label={context.labels.pinnedMark}
      className="inline-flex shrink-0 text-muted-foreground"
      data-slot="documents-4-pinned-mark"
      role="img"
    >
      <PushPinIcon aria-hidden="true" className="size-3.5" />
    </span>
  )
}

export function Documents4OwnerField({
  avatarOnly,
  context,
  item,
}: FieldProps & { avatarOnly?: boolean }) {
  const { labels, people } = context
  return (
    <DataOwner
      ariaLabel={labels.columns.owner}
      avatarOnly={avatarOnly}
      owners={people}
      placeholder={labels.noOwner}
      value={item.ownerId}
    />
  )
}

export function Documents4UpdatedField({ context, item }: FieldProps) {
  const { locale, timeZone } = context
  return (
    <time
      className="whitespace-nowrap text-muted-foreground text-sm tabular-nums"
      dateTime={item.updatedAt}
    >
      {formatDocuments4Updated(item.updatedAt, locale, timeZone)}
    </time>
  )
}

export function Documents4SizeField({ context, item }: FieldProps) {
  return (
    <span
      className={
        item.size
          ? 'whitespace-nowrap tabular-nums'
          : 'whitespace-nowrap text-muted-foreground'
      }
    >
      {item.size ?? context.labels.noSize}
    </span>
  )
}

export function Documents4TypeField({ context, item }: FieldProps) {
  const TypeIcon = documents4TypeIcons[item.type]
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <TypeIcon aria-hidden="true" className="size-4 text-muted-foreground" />
      {context.labels.types[item.type]}
    </span>
  )
}
