'use client'

import { Input } from '@tc96/ui/input'
import { Popover, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { MailIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { useEntryListEditor } from '../../hooks/use-entry-list-editor'
import { createEntryParser } from '../../shared/lib/entry-parser'
import { emitChange, isEditable } from '../../shared/lib/property-change'
import { PropertyAddTrigger } from '../../shared/property-add-trigger'
import { PropertyEntryForm } from '../../shared/property-entry-form'
import { PropertyRow } from '../../shared/property-row'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import { EditableText } from '../editable-text/index'
import { IconLabelProperty } from '../icon-label/icon-label-property'
import { emailAddressSchema } from './email-address'

const invalidEmailMessage = 'Informe um e-mail válido.'
const duplicateEmailMessage = 'Este e-mail já está na lista.'
const parseEmail = createEntryParser(emailAddressSchema, invalidEmailMessage)

export interface EmailPropertyActionContext {
  added: string | null
  previousValue: readonly string[]
  removed: string | null
}

export interface EmailPropertyProps {
  value: readonly string[]
  action?: (
    value: readonly string[],
    context: EmailPropertyActionContext,
  ) => void

  addDisabled?: boolean
  addLabel?: string
  ariaLabel?: string
  className?: string
  disabled?: boolean
  display?: 'chips' | 'trigger'
  editing?: 'inline' | 'popover'
  entryLabels?: readonly string[]
  errorMessage?: string | null
  inputPlaceholder?: string
  placeholder?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: readonly string[]) => void
}

export function EmailProperty({
  action,
  addDisabled = false,
  addLabel = 'Adicionar e-mail',
  ariaLabel = 'E-mails',
  className,
  disabled = false,
  display = 'chips',
  editing = 'popover',
  entryLabels = ['Principal', 'Secundário'],
  errorMessage = null,
  inputPlaceholder = 'nome@exemplo.com',
  onValueChange,
  placeholder = 'Sem e-mail',
  readOnly = false,
  value,
  variant = 'plain',
}: Readonly<EmailPropertyProps>) {
  const [editingInline, setEditingInline] = useState(false)
  const [inlineDraft, setInlineDraft] = useState<string | null>(null)
  const [formatError, setFormatError] = useState<string | null>(null)

  const commit = (
    next: readonly string[],
    context: EmailPropertyActionContext,
  ) => emitChange({ action, onValueChange }, next, context)

  const editor = useEntryListEditor({
    duplicateMessage: duplicateEmailMessage,
    limit: entryLabels.length,
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
      setFormatError(duplicateEmailMessage)
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
              icon={MailIcon}
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
      addLabel={addLabel}
      canAddAnother={editor.canAddAnother}
      drafts={editor.drafts}
      entryLabels={entryLabels}
      errorMessage={errorMessage}
      errors={editor.errors}
      onAdd={editor.addDraft}
      onChange={editor.setDraft}
      onRemove={editor.removeDraft}
      onSave={editor.save}
      removeLabel={(entryLabel) => `Remover ${entryLabel} e-mail`}
      renderField={(field) => (
        <Input
          aria-invalid={field.invalid || undefined}
          aria-label={field.ariaLabel}
          nativeInput
          onChange={(event) => field.onChange(event.target.value)}
          onKeyDown={field.onKeyDown}
          placeholder={inputPlaceholder}
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
              <MailIcon aria-hidden="true" className="size-3" />
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
          icon={MailIcon}
          key={email}
          label={email}
          trailing={
            <button
              aria-label={`Remover e-mail ${email}`}
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              disabled={disabled}
              onClick={() => removeEmail(email)}
              type="button"
            >
              <XIcon aria-hidden="true" className="size-3" />
            </button>
          }
        />
      ))}

      {addDisabled ? null : editing === 'inline' ? (
        editingInline ? (
          <span className="inline-flex min-w-0 flex-col gap-0.5">
            <PropertySurface className="w-48">
              <EditableText
                ariaLabel={addLabel}
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
                placeholder={inputPlaceholder}
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
            addLabel={addLabel}
            disabled={disabled}
            hasValue={value.length > 0}
            icon={MailIcon}
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
                addLabel={addLabel}
                disabled={disabled}
                hasValue={value.length > 0}
                icon={MailIcon}
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
