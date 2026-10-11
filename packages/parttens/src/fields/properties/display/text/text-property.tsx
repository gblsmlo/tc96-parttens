'use client'

import { copyToClipboard } from '@tc96/helpers/clipboard'
import { cn } from '@tc96/utils'
import { CopyIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import { EditableText } from '../editable-text/index'
import {
  IconLabelProperty,
  type IconLabelPropertyIcon,
  type IconLabelPropertyTrailingVisibility,
} from '../icon-label/icon-label-property'

export type TextPropertyIcon = IconLabelPropertyIcon

export type TextPropertyEditing = 'inline' | 'trigger'

export interface TextPropertyProps {
  value: string | null
  addLabel?: string
  ariaLabel?: string
  className?: string
  copyLabel?: string
  disabled?: boolean
  editing?: TextPropertyEditing
  fallback?: string
  icon?: TextPropertyIcon
  inputPlaceholder?: string
  iconClassName?: string
  trailingVisibility?: IconLabelPropertyTrailingVisibility
  variant?: PropertyVariant
  onCommit?: (value: string | null) => void
}

export function TextProperty({
  addLabel,
  ariaLabel,
  className,
  copyLabel,
  disabled = false,
  editing = 'trigger',
  fallback = 'Não informado',
  icon: Icon,
  iconClassName,
  inputPlaceholder,
  trailingVisibility,
  value,
  variant = 'badge',
  onCommit,
}: Readonly<TextPropertyProps>) {
  const [editingInline, setEditingInline] = useState(false)
  const text = value?.trim() || null
  const copiable = Boolean(copyLabel && text)
  const editable = Boolean(onCommit) && !disabled

  const commit = (next: string | null) => {
    setEditingInline(false)
    onCommit?.(next)
  }

  if (editable && !text && editing === 'trigger' && !editingInline) {
    return (
      <PropertySurface
        aria-label={addLabel ?? fallback}
        className={cn('gap-1', className)}
        muted
        onClick={() => setEditingInline(true)}
        render={<button type="button" />}
      >
        <PlusIcon aria-hidden="true" className="size-3.5" />
        {fallback}
      </PropertySurface>
    )
  }

  const copyAffordance =
    copiable && text ? (
      <button
        aria-label={copyLabel}
        className="h-full shrink-0 cursor-pointer px-1.5 opacity-80 transition-opacity hover:opacity-100"
        data-slot="text-property-copy"
        onClick={() => void copyToClipboard(text)?.catch(() => undefined)}
        type="button"
      >
        <CopyIcon aria-hidden="true" className="size-3" />
      </button>
    ) : null

  const label =
    editable && (editing === 'inline' || editingInline) ? (
      <EditableText
        ariaLabel={ariaLabel ?? fallback}
        className="field-sizing-content w-auto min-w-[1ch] max-w-full"
        onCommit={commit}
        placeholder={inputPlaceholder ?? fallback}
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
