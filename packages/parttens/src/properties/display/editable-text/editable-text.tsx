'use client'

import { cn } from '@tc96/utils'
import { useState } from 'react'
import { Editable, EditableField } from '../../../editable/index'

export type EditableTextSize = 'sm' | 'base' | 'lg' | 'xl'

export interface EditableTextProps {
  ariaLabel: string
  className?: string
  emptyValue?: string
  multiline?: boolean
  placeholder?: string
  readOnly?: boolean
  revertWhenEmpty?: boolean
  size?: EditableTextSize
  type?: 'email' | 'text'
  value: string | null
  onCommit: (value: string | null) => void
}

const sizeClassName: Record<EditableTextSize, string> = {
  base: 'text-base',
  lg: 'text-2xl',
  sm: 'text-sm',
  xl: 'text-[2rem]',
}

export function EditableText({
  ariaLabel,
  className,
  emptyValue,
  multiline = false,
  placeholder,
  readOnly = false,
  revertWhenEmpty = false,
  size = 'base',
  type = 'text',
  value,
  onCommit,
}: Readonly<EditableTextProps>) {
  const confirmed = value ?? ''
  const [draft, setDraft] = useState(confirmed)
  const [editing, setEditing] = useState(false)
  const [syncedValue, setSyncedValue] = useState(confirmed)

  if (!editing && confirmed !== syncedValue) {
    setSyncedValue(confirmed)
    setDraft(confirmed)
  }

  const showsEmptyValue = !draft || draft === emptyValue

  const submit = (next: string) => {
    const trimmed = next.trim()
    if (!trimmed && revertWhenEmpty) return setDraft(confirmed)
    if (trimmed !== confirmed) onCommit(trimmed || null)
  }

  return (
    <Editable
      className="contents"
      editing={editing}
      onEditingChange={setEditing}
      onSubmit={submit}
      onValueChange={setDraft}
      placeholder={placeholder}
      readOnly={readOnly}
      render={<span />}
      value={draft}
    >
      <EditableField
        aria-label={ariaLabel}
        className={cn(
          sizeClassName[size],
          showsEmptyValue && 'text-muted-foreground',
          className,
        )}
        data-slot="editable-text"
        emptyValue={emptyValue}
        multiline={multiline}
        type={type}
      />
    </Editable>
  )
}
