'use client'

import { cn } from '@tc96/utils'
import { type KeyboardEvent, useEffect, useRef, useState } from 'react'

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

const fieldClassName =
  'w-full bg-transparent outline-none placeholder:text-muted-foreground'

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
  const draftRef = useRef(draft)
  const draftAtFocus = useRef(draft)
  const isFocused = useRef(false)

  const writeDraft = (next: string) => {
    draftRef.current = next
    setDraft(next)
  }

  useEffect(() => {
    if (isFocused.current) return
    draftRef.current = value ?? ''
    setDraft(value ?? '')
  }, [value])

  const showsEmptyValue = !draft || draft === emptyValue
  const emptyClassName = showsEmptyValue ? 'text-muted-foreground' : undefined

  if (readOnly) {
    return (
      <span
        className={cn(sizeClassName[size], emptyClassName, className)}
        data-slot="editable-text"
      >
        {value ?? placeholder}
      </span>
    )
  }

  const isDirty = () => draftRef.current !== draftAtFocus.current

  const commit = () => {
    if (!isDirty()) return writeDraft(confirmed)
    const next = draftRef.current.trim()
    if (!next && revertWhenEmpty) return writeDraft(confirmed)
    if (next !== confirmed) onCommit(next || null)
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Escape') {
      if (!isDirty()) return
      event.stopPropagation()
      writeDraft(confirmed)
      event.currentTarget.blur()
      return
    }

    if (event.key === 'Enter' && !multiline) {
      event.preventDefault()
      event.currentTarget.blur()
    }
  }

  const fieldProps = {
    'aria-label': ariaLabel,
    'data-slot': 'editable-text',
    onBlur: () => {
      isFocused.current = false
      commit()
    },
    onFocus: () => {
      isFocused.current = true
      if (emptyValue !== undefined && draftRef.current === emptyValue)
        writeDraft('')
      draftAtFocus.current = draftRef.current
    },
    onKeyDown: handleKeyDown,
    placeholder,
    value: draft,
  }

  if (multiline) {
    return (
      <textarea
        {...fieldProps}
        className={cn(
          'field-sizing-content resize-none',
          fieldClassName,
          sizeClassName[size],
          emptyClassName,
          className,
        )}
        onChange={(event) => writeDraft(event.target.value)}
        rows={1}
      />
    )
  }

  return (
    <input
      {...fieldProps}
      className={cn(
        fieldClassName,
        sizeClassName[size],
        emptyClassName,
        className,
      )}
      onChange={(event) => writeDraft(event.target.value)}
      type={type}
    />
  )
}
