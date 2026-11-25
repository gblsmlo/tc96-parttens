'use client'

import { PlusIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { PopoverPopup } from '@tc96/ui/popover'
import type { FormEvent, KeyboardEventHandler, ReactNode } from 'react'
import type { PropertyEntryListLabels } from './property-labels'

export interface PropertyEntryField {
  ariaLabel: string
  draft: string
  index: number
  invalid: boolean
  onChange: (next: string) => void
  onKeyDown: KeyboardEventHandler<HTMLInputElement>
}

export interface PropertyEntryFormProps {
  canAddAnother: boolean
  drafts: readonly string[]
  errors: readonly (string | null)[]
  labels: Pick<
    PropertyEntryListLabels,
    'add' | 'addAnother' | 'entries' | 'removeEntry' | 'save'
  >
  onAdd: () => void
  onChange: (index: number, next: string) => void
  onRemove: (index: number) => void
  onSave: () => void
  renderField: (field: PropertyEntryField) => ReactNode
  errorMessage?: string | null
}

export function PropertyEntryForm({
  canAddAnother,
  drafts,
  errorMessage = null,
  errors,
  labels,
  onAdd,
  onChange,
  onRemove,
  onSave,
  renderField,
}: Readonly<PropertyEntryFormProps>) {
  const entryLabels = labels.entries
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave()
  }

  const saveOnEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    event.stopPropagation()
    onSave()
  }

  return (
    <PopoverPopup align="start" aria-label={labels.add} className="w-80">
      <form className="grid gap-3 p-1" noValidate onSubmit={submit}>
        {drafts.map((draft, index) => (
          <div
            className="group/entry grid gap-1"
            key={entryLabels[index] ?? index}
          >
            {drafts.length > 1 || entryLabels.length > 1 ? (
              <span className="font-medium text-muted-foreground text-xs">
                {entryLabels[index] ?? `${index + 1}`}
              </span>
            ) : null}
            <div className="flex items-center gap-1">
              {renderField({
                ariaLabel: entryLabels[index] ?? labels.add,
                draft,
                index,
                invalid: Boolean(errors[index]),
                onChange: (next) => onChange(index, next),
                onKeyDown: saveOnEnter,
              })}
              {drafts.length > 1 ? (
                <Button
                  aria-label={labels.removeEntry(entryLabels[index] ?? '')}
                  className="opacity-0 transition-opacity focus-visible:opacity-100 group-focus-within/entry:opacity-100 group-hover/entry:opacity-100"
                  onClick={() => onRemove(index)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <XIcon aria-hidden="true" />
                </Button>
              ) : null}
            </div>
            {errors[index] ? (
              <p className="text-destructive-foreground text-xs" role="alert">
                {errors[index]}
              </p>
            ) : null}
          </div>
        ))}
        {errorMessage ? (
          <p className="text-destructive-foreground text-xs" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <Button
            disabled={!canAddAnother}
            onClick={onAdd}
            size="sm"
            type="button"
            variant="ghost"
          >
            <PlusIcon aria-hidden="true" />
            {labels.addAnother}
          </Button>
          <Button size="sm" type="submit" variant="secondary">
            {labels.save}
          </Button>
        </div>
      </form>
    </PopoverPopup>
  )
}
