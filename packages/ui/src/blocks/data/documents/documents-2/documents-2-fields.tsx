import { PushPinIcon } from '@phosphor-icons/react'
import { formatMediumDate, parseIsoDate } from '@tc96/ui/helpers/date'
import { IconFrame, type IconFrameSize } from '@tc96/ui/icon-frame'
import { DataOwner } from '../../shared/properties/data-properties'
import { documents2TypeIcons } from './documents-2-options'
import type {
  Documents2Labels,
  Documents2Person,
  Documents2Record,
  Documents2TypeColors,
} from './types'

export interface Documents2FieldContext {
  labels: Documents2Labels
  locale: string
  onDelete?: (recordId: string) => void
  onDownload?: (recordId: string) => void
  onOpen?: (recordId: string) => void
  onPinnedChange?: (recordId: string, pinned: boolean) => void
  onSelectedChange?: (recordId: string, selected: boolean) => void
  people: readonly Documents2Person[]
  selectedIds: ReadonlySet<string>
  timeZone: string
  typeColors?: Documents2TypeColors
}

interface FieldProps {
  context: Documents2FieldContext
  item: Documents2Record
}

export function formatDocuments2Updated(
  value: string,
  locale: string,
  timeZone: string,
): string {
  const date = parseIsoDate(value)
  if (!date) return value
  return formatMediumDate(date, locale, timeZone)
}

export function Documents2TypeIcon({
  context,
  item,
  size = 'xs',
}: FieldProps & { size?: IconFrameSize }) {
  const TypeIcon = documents2TypeIcons[item.type]
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

export function Documents2PinnedMark({ context, item }: FieldProps) {
  if (!item.pinned) return null
  return (
    <span
      aria-label={context.labels.pinnedMark}
      className="inline-flex shrink-0 text-muted-foreground"
      data-slot="documents-2-pinned-mark"
      role="img"
    >
      <PushPinIcon aria-hidden="true" className="size-3.5" />
    </span>
  )
}

export function Documents2OwnerField({
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

export function Documents2UpdatedField({ context, item }: FieldProps) {
  const { locale, timeZone } = context
  return (
    <time
      className="whitespace-nowrap text-muted-foreground text-sm tabular-nums"
      dateTime={item.updatedAt}
    >
      {formatDocuments2Updated(item.updatedAt, locale, timeZone)}
    </time>
  )
}

export function Documents2SizeField({ context, item }: FieldProps) {
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

export function Documents2TypeField({ context, item }: FieldProps) {
  const TypeIcon = documents2TypeIcons[item.type]
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <TypeIcon aria-hidden="true" className="size-4 text-muted-foreground" />
      {context.labels.types[item.type]}
    </span>
  )
}
