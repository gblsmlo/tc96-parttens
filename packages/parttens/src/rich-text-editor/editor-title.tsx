'use client'

import { flattenTitle, formatTitleCounter } from '@tc96/helpers/rich-text'
import { cn } from '@tc96/utils'
import type { ChangeEvent, KeyboardEvent, ReactElement, Ref } from 'react'
import { useEffect, useId, useImperativeHandle, useRef, useState } from 'react'

export interface EditorTitleHandle {
  focusEnd: () => void
}

export interface EditorTitleProps {
  autoFocus?: boolean
  className?: string
  counterFrom?: number
  defaultValue?: string
  emptyLabel: string
  label?: string
  max?: number
  onArrowDownAtEnd?: () => void
  onChange?: (value: string) => void
  onEnter?: () => void
  ref?: Ref<EditorTitleHandle>
}

export function EditorTitle({
  autoFocus = false,
  className,
  counterFrom,
  defaultValue = '',
  emptyLabel,
  label = 'Título',
  max,
  onArrowDownAtEnd,
  onChange,
  onEnter,
  ref,
}: Readonly<EditorTitleProps>): ReactElement {
  const counterId = useId()
  const fieldRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState(() => flattenTitle(defaultValue))
  const showCounter =
    max !== undefined &&
    counterFrom !== undefined &&
    value.length >= counterFrom

  useImperativeHandle(ref, () => ({
    focusEnd: () => {
      const field = fieldRef.current
      if (!field) return
      field.focus()
      field.setSelectionRange(field.value.length, field.value.length)
    },
  }))

  useEffect(() => {
    const field = fieldRef.current
    if (!autoFocus || !field) return
    field.focus()
    field.setSelectionRange(field.value.length, field.value.length)
  }, [autoFocus])

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const raw = event.target.value
    const next = flattenTitle(raw)
    if (next !== raw) {
      const caret = flattenTitle(
        raw.slice(0, event.target.selectionStart),
      ).length
      event.target.value = next
      event.target.setSelectionRange(caret, caret)
    }
    setValue(next)
    onChange?.(next)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return
    if (event.key === 'Enter') {
      event.preventDefault()
      onEnter?.()
      return
    }
    if (event.key === 'ArrowDown') {
      const {
        selectionStart,
        selectionEnd,
        value: current,
      } = event.currentTarget
      if (
        selectionStart === current.length &&
        selectionEnd === current.length
      ) {
        event.preventDefault()
        onArrowDownAtEnd?.()
      }
    }
  }

  return (
    <div
      className={cn('flex flex-col gap-1', className)}
      data-slot="editor-title"
    >
      <h1
        className="-mx-2 rounded-md px-2 font-semibold text-2xl text-foreground tracking-tight transition-colors duration-200 has-focus-visible:bg-muted motion-reduce:transition-none"
        data-slot="editor-title-heading"
      >
        {value === '' ? <span className="sr-only">{emptyLabel}</span> : null}
        <textarea
          aria-describedby={showCounter ? counterId : undefined}
          aria-label={label}
          className="field-sizing-content block w-full resize-none bg-transparent outline-none placeholder:text-muted-foreground"
          data-slot="editor-title-field"
          maxLength={max}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={emptyLabel}
          ref={fieldRef}
          rows={1}
          value={value}
        />
      </h1>
      {showCounter && max !== undefined ? (
        <span
          className="self-end text-muted-foreground text-xs tabular-nums"
          data-slot="editor-title-counter"
          id={counterId}
        >
          {formatTitleCounter(value.length, max)}
        </span>
      ) : null}
    </div>
  )
}
