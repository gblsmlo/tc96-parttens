import { PushPinIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { IconFrame, type IconFrameSize } from '@tc96/ui/icon-frame'
import { Progress } from '@tc96/ui/progress'
import {
  DataDate,
  DataOwner,
  DataSelect,
} from '../../shared/properties/data-properties'
import type { DataPropertyVariant } from '../../shared/properties/types'
import {
  documents3Accesses,
  documents3AccessIcons,
  documents3TypeIcons,
  documents3TypeOf,
  documents3Types,
} from './documents-3-options'
import type {
  Documents3Labels,
  Documents3Person,
  Documents3Record,
  Documents3TypeColors,
  Documents3Upload,
} from './types'

export interface Documents3FieldContext {
  labels: Documents3Labels
  locale: string
  onDelete?: (recordId: string) => void
  onDownload?: (recordId: string) => void
  onOpen?: (recordId: string) => void
  onPinnedChange?: (recordId: string, pinned: boolean) => void
  onRename?: (recordId: string) => void
  onShare?: (recordId: string) => void
  people: readonly Documents3Person[]
  timeZone: string
  typeColors?: Documents3TypeColors
}

interface FieldProps {
  context: Documents3FieldContext
  item: Documents3Record
  variant?: DataPropertyVariant
}

export const documents3UploadOf = (
  item: Documents3Record,
): Documents3Upload | null =>
  item.kind === 'file' ? (item.upload ?? null) : null

export const documents3Opens = (item: Documents3Record) =>
  documents3UploadOf(item) === null

export function Documents3TypeIcon({
  context,
  item,
  size = 'xs',
}: FieldProps & { size?: IconFrameSize }) {
  const type = documents3TypeOf(item)
  const TypeIcon = documents3TypeIcons[type]
  return (
    <IconFrame
      color={context.typeColors?.[type]}
      data-type={type}
      shape="rounded"
      size={size}
    >
      <TypeIcon aria-hidden="true" />
    </IconFrame>
  )
}

export function Documents3PinnedBadge({ context, item }: FieldProps) {
  if (!item.pinned) return null
  return (
    <span
      aria-label={context.labels.pinned}
      className="absolute end-2 top-2 inline-flex"
      data-slot="documents-3-pinned-badge"
      role="img"
    >
      <IconFrame shape="circle" size="xs">
        <PushPinIcon aria-hidden="true" weight="fill" />
      </IconFrame>
    </span>
  )
}

export function Documents3PinnedMark({ context, item }: FieldProps) {
  if (!item.pinned) return null
  return (
    <span
      aria-label={context.labels.pinned}
      className="inline-flex shrink-0 text-muted-foreground"
      data-slot="documents-3-pinned"
      role="img"
    >
      <PushPinIcon aria-hidden="true" className="size-3.5" />
    </span>
  )
}

export function Documents3UploadState({ context, item }: FieldProps) {
  const upload = documents3UploadOf(item)
  const { labels } = context
  if (!upload) return null
  if (upload.status === 'failed')
    return (
      <span
        className="flex min-w-0 items-center gap-1.5 text-destructive-foreground text-xs"
        data-slot="documents-3-upload"
        data-status="failed"
      >
        <span
          aria-label={labels.uploadFailed}
          className="inline-flex shrink-0"
          role="img"
        >
          <WarningCircleIcon aria-hidden="true" className="size-3.5" />
        </span>
        <span className="min-w-0 truncate">{upload.error}</span>
      </span>
    )
  const progress = Math.min(100, Math.max(0, Math.round(upload.progress)))
  return (
    <span
      className="flex min-w-0 items-center gap-2 text-muted-foreground text-xs tabular-nums"
      data-slot="documents-3-upload"
      data-status="uploading"
    >
      <Progress
        aria-label={labels.uploadProgress(item.name)}
        className="w-32 shrink-0"
        value={progress}
      />
      <span className="whitespace-nowrap">{labels.uploading(progress)}</span>
    </span>
  )
}

export function Documents3NameField({ context, item }: FieldProps) {
  return (
    <span className="flex min-w-56 max-w-96 items-center gap-2">
      <Documents3TypeIcon context={context} item={item} />
      <span className="grid min-w-0 gap-1">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="min-w-0 truncate font-medium">{item.name}</span>
          <Documents3PinnedMark context={context} item={item} />
        </span>
        <Documents3UploadState context={context} item={item} />
      </span>
    </span>
  )
}

export function Documents3TypeField({ context, item, variant }: FieldProps) {
  const { labels } = context
  return (
    <DataSelect
      ariaLabel={labels.columns.type}
      options={documents3Types.map((type) => ({
        icon: documents3TypeIcons[type],
        label: labels.types[type],
        tone: 'neutral' as const,
        value: type,
      }))}
      value={documents3TypeOf(item)}
      variant={variant}
    />
  )
}

export function Documents3AccessField({ context, item, variant }: FieldProps) {
  const { labels } = context
  return (
    <DataSelect
      ariaLabel={labels.columns.access}
      options={documents3Accesses.map((access) => ({
        icon: documents3AccessIcons[access],
        label: labels.access[access],
        tone: 'neutral' as const,
        value: access,
      }))}
      value={item.access}
      variant={variant}
    />
  )
}

export function Documents3CreatedByField({
  avatarOnly,
  context,
  item,
  variant,
}: FieldProps & { avatarOnly?: boolean }) {
  const { labels, people } = context
  return (
    <DataOwner
      ariaLabel={labels.columns.createdBy}
      avatarOnly={avatarOnly}
      owners={people}
      placeholder={labels.noCreator}
      value={item.createdById}
      variant={variant}
    />
  )
}

export function Documents3CreatedAtField({
  context,
  item,
  variant,
}: FieldProps) {
  const { labels, locale, timeZone } = context
  return (
    <DataDate
      ariaLabel={labels.columns.createdAt}
      fallback={labels.noDate}
      locale={locale}
      timeZone={timeZone}
      value={item.createdAt}
      variant={variant}
    />
  )
}

export const documents3SizeOf = (item: Documents3Record) =>
  item.kind === 'file' ? item.size : null

export function Documents3SizeField({ context, item }: FieldProps) {
  const size = documents3SizeOf(item)
  return (
    <span
      className={
        size
          ? 'whitespace-nowrap tabular-nums'
          : 'whitespace-nowrap text-muted-foreground'
      }
    >
      {size ?? context.labels.noSize}
    </span>
  )
}

export function Documents3LinkedToField({ context, item }: FieldProps) {
  return (
    <span
      className={
        item.linkedTo
          ? 'block max-w-64 truncate'
          : 'block text-muted-foreground'
      }
    >
      {item.linkedTo ?? context.labels.noLink}
    </span>
  )
}
