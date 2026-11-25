import { PushPinIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { IconFrame } from '@tc96/ui/icon-frame'
import { Progress } from '@tc96/ui/progress'
import {
  DataDate,
  DataOwner,
  DataSelect,
} from '../../shared/properties/data-properties'
import type { DataPropertyVariant } from '../../shared/properties/types'
import {
  documents1Accesses,
  documents1AccessIcons,
  documents1TypeIcons,
  documents1TypeOf,
  documents1Types,
} from './documents-1-options'
import type {
  Documents1Labels,
  Documents1Person,
  Documents1Record,
  Documents1TypeColors,
  Documents1Upload,
} from './types'

export interface Documents1FieldContext {
  labels: Documents1Labels
  locale: string
  onDelete?: (recordId: string) => void
  onDownload?: (recordId: string) => void
  onOpen?: (recordId: string) => void
  onPinnedChange?: (recordId: string, pinned: boolean) => void
  onRename?: (recordId: string) => void
  onShare?: (recordId: string) => void
  people: readonly Documents1Person[]
  timeZone: string
  typeColors?: Documents1TypeColors
}

interface FieldProps {
  context: Documents1FieldContext
  item: Documents1Record
  variant?: DataPropertyVariant
}

export const documents1UploadOf = (
  item: Documents1Record,
): Documents1Upload | null =>
  item.kind === 'file' ? (item.upload ?? null) : null

export const documents1Opens = (item: Documents1Record) =>
  documents1UploadOf(item) === null

export function Documents1TypeIcon({ context, item }: FieldProps) {
  const type = documents1TypeOf(item)
  const TypeIcon = documents1TypeIcons[type]
  return (
    <IconFrame
      color={context.typeColors?.[type]}
      data-type={type}
      shape="rounded"
      size="xs"
    >
      <TypeIcon aria-hidden="true" />
    </IconFrame>
  )
}

export function Documents1PinnedMark({ context, item }: FieldProps) {
  if (!item.pinned) return null
  return (
    <span
      aria-label={context.labels.pinned}
      className="inline-flex shrink-0 text-muted-foreground"
      data-slot="documents-1-pinned"
      role="img"
    >
      <PushPinIcon aria-hidden="true" className="size-3.5" />
    </span>
  )
}

export function Documents1UploadState({ context, item }: FieldProps) {
  const upload = documents1UploadOf(item)
  const { labels } = context
  if (!upload) return null
  if (upload.status === 'failed')
    return (
      <span
        className="flex min-w-0 items-center gap-1.5 text-destructive-foreground text-xs"
        data-slot="documents-1-upload"
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
      data-slot="documents-1-upload"
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

export function Documents1NameField({ context, item }: FieldProps) {
  return (
    <span className="flex min-w-56 max-w-96 items-center gap-2">
      <Documents1TypeIcon context={context} item={item} />
      <span className="grid min-w-0 gap-1">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="min-w-0 truncate font-medium">{item.name}</span>
          <Documents1PinnedMark context={context} item={item} />
        </span>
        <Documents1UploadState context={context} item={item} />
      </span>
    </span>
  )
}

export function Documents1TypeField({ context, item, variant }: FieldProps) {
  const { labels } = context
  return (
    <DataSelect
      ariaLabel={labels.columns.type}
      options={documents1Types.map((type) => ({
        icon: documents1TypeIcons[type],
        label: labels.types[type],
        tone: 'neutral' as const,
        value: type,
      }))}
      value={documents1TypeOf(item)}
      variant={variant}
    />
  )
}

export function Documents1AccessField({ context, item, variant }: FieldProps) {
  const { labels } = context
  return (
    <DataSelect
      ariaLabel={labels.columns.access}
      options={documents1Accesses.map((access) => ({
        icon: documents1AccessIcons[access],
        label: labels.access[access],
        tone: 'neutral' as const,
        value: access,
      }))}
      value={item.access}
      variant={variant}
    />
  )
}

export function Documents1CreatedByField({
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

export function Documents1CreatedAtField({
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

export const documents1SizeOf = (item: Documents1Record) =>
  item.kind === 'file' ? item.size : null

export function Documents1SizeField({ context, item }: FieldProps) {
  const size = documents1SizeOf(item)
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

export function Documents1LinkedToField({ context, item }: FieldProps) {
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
