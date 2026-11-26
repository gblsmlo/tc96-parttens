import { PushPinIcon } from '@phosphor-icons/react'
import { formatMediumDate, parseIsoDate } from '@tc96/ui/helpers/date'
import { IconFrame, type IconFrameSize } from '@tc96/ui/icon-frame'
import { DataOwner } from '../../shared/properties/data-properties'
import { documents5TypeIcons } from './documents-5-options'
import type {
  Documents5Labels,
  Documents5Person,
  Documents5Record,
  Documents5TypeColors,
} from './types'

export interface Documents5FieldContext {
  labels: Documents5Labels
  locale: string
  onDelete?: (recordId: string) => void
  onDownload?: (recordId: string) => void
  onOpen?: (recordId: string) => void
  onPinnedChange?: (recordId: string, pinned: boolean) => void
  onSelectedChange?: (recordId: string, selected: boolean) => void
  people: readonly Documents5Person[]
  selectedIds: ReadonlySet<string>
  timeZone: string
  typeColors?: Documents5TypeColors
}

interface FieldProps {
  context: Documents5FieldContext
  item: Documents5Record
}

export function formatDocuments5Updated(
  value: string,
  locale: string,
  timeZone: string,
): string {
  const date = parseIsoDate(value)
  if (!date) return value
  return formatMediumDate(date, locale, timeZone)
}

export function Documents5TypeIcon({
  context,
  item,
  size = 'xs',
}: FieldProps & { size?: IconFrameSize }) {
  const TypeIcon = documents5TypeIcons[item.type]
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

export function Documents5PinnedMark({ context, item }: FieldProps) {
  if (!item.pinned) return null
  return (
    <span
      aria-label={context.labels.pinnedMark}
      className="inline-flex shrink-0 text-muted-foreground"
      data-slot="documents-5-pinned-mark"
      role="img"
    >
      <PushPinIcon aria-hidden="true" className="size-3.5" />
    </span>
  )
}

export function Documents5OwnerField({
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

export function Documents5UpdatedField({ context, item }: FieldProps) {
  const { locale, timeZone } = context
  return (
    <time
      className="whitespace-nowrap text-muted-foreground text-sm tabular-nums"
      dateTime={item.updatedAt}
    >
      {formatDocuments5Updated(item.updatedAt, locale, timeZone)}
    </time>
  )
}

export function Documents5SizeField({ context, item }: FieldProps) {
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

export function Documents5TypeField({ context, item }: FieldProps) {
  const TypeIcon = documents5TypeIcons[item.type]
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <TypeIcon aria-hidden="true" className="size-4 text-muted-foreground" />
      {context.labels.types[item.type]}
    </span>
  )
}
