'use client'

import { XIcon } from '@phosphor-icons/react'
import { Input } from '@tc96/ui/input'
import { Popover, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { useState } from 'react'
import { useEntryListEditor } from '../../hooks/use-entry-list-editor'
import { createEntryParser } from '../../shared/lib/entry-parser'
import { emitChange, isEditable } from '../../shared/lib/property-change'
import { PropertyAddTrigger } from '../../shared/property-add-trigger'
import type { PropertyListChangeContext } from '../../shared/property-catalog'
import { propertyDisplayIcons } from '../../shared/property-display-meta'
import { PropertyEntryForm } from '../../shared/property-entry-form'
import {
  defaultPropertyAriaLabels,
  defaultPropertyLabels,
  defaultPropertyPlaceholders,
  type EmailPropertyLabels,
  resolvePropertyLabels,
} from '../../shared/property-labels'
import { PropertyRow } from '../../shared/property-row'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import { EditableText } from '../editable-text/index'
import { IconLabelProperty } from '../icon-label/icon-label-property'
import { emailAddressSchema } from './email-address'

const EmailIcon = propertyDisplayIcons.email

type EmailChangeContext = PropertyListChangeContext<string, string>

export interface EmailPropertyProps {
  value: readonly string[]
  action?: (value: readonly string[], context: EmailChangeContext) => void
  addDisabled?: boolean
  ariaLabel?: string
  className?: string
  disabled?: boolean
  display?: 'chips' | 'trigger'
  editing?: 'inline' | 'popover'
  errorMessage?: string | null
  labels?: Partial<EmailPropertyLabels>
  placeholder?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: readonly string[]) => void
}

export function EmailProperty({
  action,
  addDisabled = false,
  ariaLabel = defaultPropertyAriaLabels.email,
  className,
  disabled = false,
  display = 'chips',
  editing = 'popover',
  errorMessage = null,
  labels: labelOverrides,
  onValueChange,
  placeholder = defaultPropertyPlaceholders.email,
  readOnly = false,
  value,
  variant = 'plain',
}: Readonly<EmailPropertyProps>) {
  const [editingInline, setEditingInline] = useState(false)
  const [inlineDraft, setInlineDraft] = useState<string | null>(null)
  const [formatError, setFormatError] = useState<string | null>(null)
  const labels = resolvePropertyLabels(
    defaultPropertyLabels.email,
    labelOverrides,
  )
  const parseEmail = createEntryParser(
    emailAddressSchema(labels.invalid),
    labels.invalid,
  )

  const commit = (next: readonly string[], context: EmailChangeContext) =>
    emitChange({ action, onValueChange }, next, context)

  const editor = useEntryListEditor({
    duplicateMessage: labels.duplicate,
    limit: labels.entries.length,
    onCommit: commit,
    parse: parseEmail,
    value,
  })

  const addEmail = (candidate: string): boolean => {
    const parsed = parseEmail(candidate.trim())
    if (!parsed.success) {
      setFormatError(parsed.message)
      return false
    }

    if (value.includes(parsed.value)) {
      setFormatError(labels.duplicate)
      return false
    }

    commit([...value, parsed.value], {
      added: parsed.value,
      previousValue: value,
      removed: null,
    })
    return true
  }

  const removeEmail = (email: string) =>
    commit(
      value.filter((current) => current !== email),
      { added: null, previousValue: value, removed: email },
    )

  if (!isEditable({ action, onValueChange, readOnly })) {
    return (
      <PropertyRow
        ariaLabel={ariaLabel}
        className={cn('flex flex-wrap gap-1', className)}
        slot="email-property"
        variant={variant}
      >
        {value.length > 0 ? (
          value.map((email) => (
            <IconLabelProperty
              icon={EmailIcon}
              key={email}
              label={email}
              variant={variant}
            />
          ))
        ) : (
          <PropertySurface muted variant={variant}>
            {placeholder}
          </PropertySurface>
        )}
      </PropertyRow>
    )
  }

  const entryForm = (
    <PropertyEntryForm
      canAddAnother={editor.canAddAnother}
      drafts={editor.drafts}
      errorMessage={errorMessage}
      errors={editor.errors}
      labels={labels}
      onAdd={editor.addDraft}
      onChange={editor.setDraft}
      onRemove={editor.removeDraft}
      onSave={editor.save}
      renderField={(field) => (
        <Input
          aria-invalid={field.invalid || undefined}
          aria-label={field.ariaLabel}
          nativeInput
          onChange={(event) => field.onChange(event.target.value)}
          onKeyDown={field.onKeyDown}
          placeholder={labels.inputPlaceholder}
          type="email"
          value={field.draft}
        />
      )}
    />
  )

  const summary =
    value.length > 1
      ? `${value[0]} +${value.length - 1}`
      : (value[0] ?? placeholder)

  if (display === 'trigger') {
    return (
      <Popover onOpenChange={editor.onOpenChange} open={editor.open}>
        <PopoverTrigger
          render={
            <PropertySurface
              aria-label={
                value.length > 0 ? `${ariaLabel}: ${summary}` : ariaLabel
              }
              className={cn('max-w-full', className)}
              muted={value.length === 0}
              render={<button disabled={disabled} type="button" />}
              variant={variant === 'plain' ? 'plain' : 'badge'}
            >
              <EmailIcon
                aria-hidden="true"
                className="size-4"
                data-slot="property-icon"
              />
              <span className="truncate">{summary}</span>
            </PropertySurface>
          }
        />
        {entryForm}
      </Popover>
    )
  }

  return (
    <PropertyRow
      ariaLabel={ariaLabel}
      className={cn('flex flex-wrap items-center gap-1', className)}
      data-editing={editing}
      slot="email-property"
      variant={variant}
    >
      {value.map((email) => (
        <IconLabelProperty
          className="pe-0"
          icon={EmailIcon}
          key={email}
          label={email}
          trailing={
            <button
              aria-label={`${labels.remove} ${email}`}
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              disabled={disabled}
              onClick={() => removeEmail(email)}
              type="button"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </button>
          }
        />
      ))}

      {addDisabled ? null : editing === 'inline' ? (
        editingInline ? (
          <span className="inline-flex min-w-0 flex-col gap-0.5">
            <PropertySurface className="w-48">
              <EditableText
                ariaLabel={labels.add}
                className="text-sm"
                onCommit={(next) => {
                  const candidate = next?.trim() ?? ''
                  if (!candidate) {
                    setInlineDraft(null)
                    setFormatError(null)
                    setEditingInline(false)
                    return
                  }
                  if (addEmail(candidate)) {
                    setInlineDraft(null)
                    setEditingInline(false)
                    return
                  }
                  setInlineDraft(candidate)
                }}
                placeholder={labels.inputPlaceholder}
                size="sm"
                type="email"
                value={inlineDraft}
              />
            </PropertySurface>
            {(formatError ?? errorMessage) ? (
              <span
                className="text-destructive-foreground text-xs"
                role="alert"
              >
                {formatError ?? errorMessage}
              </span>
            ) : null}
          </span>
        ) : (
          <PropertyAddTrigger
            addLabel={labels.add}
            disabled={disabled}
            hasValue={value.length > 0}
            icon={EmailIcon}
            onClick={() => {
              setFormatError(null)
              setEditingInline(true)
            }}
            placeholder={placeholder}
          />
        )
      ) : (
        <Popover onOpenChange={editor.onOpenChange} open={editor.open}>
          <PopoverTrigger
            render={
              <PropertyAddTrigger
                addLabel={labels.add}
                disabled={disabled}
                hasValue={value.length > 0}
                icon={EmailIcon}
                placeholder={placeholder}
              />
            }
          />
          {entryForm}
        </Popover>
      )}
    </PropertyRow>
  )
}
