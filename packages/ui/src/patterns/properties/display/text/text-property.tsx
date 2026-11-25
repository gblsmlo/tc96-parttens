'use client'

import { CopyIcon, PlusIcon } from '@phosphor-icons/react'
import { copyToClipboard } from '@tc96/ui/helpers/clipboard'
import { cn } from '@tc96/utils'
import { useState } from 'react'
import type { PropertyIcon } from '../../shared/property-catalog'
import {
  defaultPropertyLabels,
  resolvePropertyLabels,
  type TextPropertyLabels,
} from '../../shared/property-labels'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import { EditableText } from '../editable-text/index'
import {
  IconLabelProperty,
  type IconLabelPropertyTrailingVisibility,
} from '../icon-label/icon-label-property'

export type TextPropertyEditing = 'inline' | 'trigger'

export interface TextPropertyProps {
  value: string | null
  ariaLabel?: string
  className?: string
  copyable?: boolean
  disabled?: boolean
  editing?: TextPropertyEditing
  icon?: PropertyIcon
  iconClassName?: string
  labels?: Partial<TextPropertyLabels>
  trailingVisibility?: IconLabelPropertyTrailingVisibility
  variant?: PropertyVariant
  onCommit?: (value: string | null) => void
}

export function TextProperty({
  ariaLabel,
  className,
  copyable = false,
  disabled = false,
  editing = 'trigger',
  icon: Icon,
  iconClassName,
  labels: labelOverrides,
  trailingVisibility,
  value,
  variant = 'badge',
  onCommit,
}: Readonly<TextPropertyProps>) {
  const [editingInline, setEditingInline] = useState(false)
  const labels = resolvePropertyLabels(
    defaultPropertyLabels.text,
    labelOverrides,
  )
  const { fallback } = labels
  const text = value?.trim() || null
  const copiable = copyable && Boolean(text)
  const editable = Boolean(onCommit) && !disabled

  const commit = (next: string | null) => {
    setEditingInline(false)
    onCommit?.(next)
  }

  if (editable && !text && editing === 'trigger' && !editingInline) {
    return (
      <PropertySurface
        aria-label={labels.add ?? fallback}
        className={cn('gap-1', className)}
        muted
        onClick={() => setEditingInline(true)}
        render={<button type="button" />}
      >
        <PlusIcon aria-hidden="true" className="size-4" />
        {fallback}
      </PropertySurface>
    )
  }

  const copyAffordance =
    copiable && text ? (
      <button
        aria-label={labels.copy}
        className="h-full shrink-0 cursor-pointer px-1.5 opacity-80 transition-opacity hover:opacity-100"
        data-slot="text-property-copy"
        onClick={() => void copyToClipboard(text)?.catch(() => undefined)}
        type="button"
      >
        <CopyIcon aria-hidden="true" className="size-4" />
      </button>
    ) : null

  const label =
    editable && (editing === 'inline' || editingInline) ? (
      <EditableText
        ariaLabel={ariaLabel ?? fallback}
        autoFocus={editingInline}
        className="field-sizing-content w-auto min-w-[1ch] max-w-full"
        onCommit={commit}
        placeholder={labels.inputPlaceholder ?? fallback}
        size="sm"
        value={text}
      />
    ) : (
      (text ?? fallback)
    )

  return (
    <IconLabelProperty
      ariaLabel={typeof label === 'string' ? ariaLabel : undefined}
      className={cn(copiable && 'pe-0', className)}
      icon={Icon}
      iconClassName={iconClassName}
      label={label}
      muted={!text}
      trailing={copyAffordance}
      trailingVisibility={trailingVisibility}
      variant={variant}
    />
  )
}
