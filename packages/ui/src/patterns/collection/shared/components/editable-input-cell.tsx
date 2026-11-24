'use client'

import { Input } from '@tc96/ui/input'
import { cn } from '@tc96/utils'
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import {
  DEFAULT_EMPTY_CELL_LABEL,
  type EditableCellMeta,
  type EditableCellRow,
  type EditableCellValueChange,
  resolveEditableCellLabel,
} from '../lib/editable-cell'

export interface EditableInputCellProps {
  alignClassName?: string
  cellSelector: string
  columnId: string
  meta: EditableCellMeta
  numeric: boolean
  onValueChange?: (change: EditableCellValueChange) => void
  row: EditableCellRow
  slot: string
  triggerAttribute: `data-${string}`
  value: string
}

export function EditableInputCell({
  alignClassName,
  cellSelector,
  columnId,
  meta,
  numeric,
  onValueChange,
  row,
  slot,
  triggerAttribute,
  value,
}: EditableInputCellProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const messageId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const restoreFocusRef = useRef(false)
  const settledRef = useRef(false)
  const editing = draft !== null
  const draftError = draft === null ? undefined : meta.validate?.(draft, row)
  const message = draftError ?? meta.getCellError?.(row, columnId)
  const invalid = Boolean(message)
  const label = meta.label ?? columnId

  useEffect(() => {
    if (!editing) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [editing])

  useEffect(() => {
    if (editing || !restoreFocusRef.current) return
    restoreFocusRef.current = false
    triggerRef.current?.focus()
  }, [editing])

  useEffect(() => {
    const cell = rootRef.current?.closest(cellSelector)
    if (!(invalid && cell)) return
    cell.setAttribute('data-invalid', '')
    return () => cell.removeAttribute('data-invalid')
  }, [cellSelector, invalid])

  const commit = () => {
    if (draft === null || draftError || settledRef.current) return false
    settledRef.current = true
    if (draft !== value && onValueChange) {
      onValueChange({ columnId, rowId: row.id, value: draft })
    }
    setDraft(null)
    return true
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      restoreFocusRef.current = commit()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      settledRef.current = true
      restoreFocusRef.current = true
      setDraft(null)
    }
  }

  const display = value && meta.formatValue ? meta.formatValue(value) : value
  const triggerProps = { [triggerAttribute]: true }

  return (
    <div
      className="block w-full min-w-0"
      data-invalid={invalid ? '' : undefined}
      data-slot={slot}
      ref={rootRef}
    >
      {draft === null ? (
        <button
          aria-describedby={invalid ? messageId : undefined}
          aria-invalid={invalid || undefined}
          aria-label={resolveEditableCellLabel(
            label,
            display ||
              meta.placeholder ||
              (meta.emptyLabel ?? DEFAULT_EMPTY_CELL_LABEL),
            meta,
          )}
          className={cn(
            'block w-full min-w-0 cursor-text truncate rounded-sm px-1 outline-none focus-visible:ring-2 focus-visible:ring-ring',
            numeric && 'tabular-nums',
            alignClassName,
          )}
          {...triggerProps}
          onClick={() => {
            settledRef.current = false
            setDraft(value)
          }}
          ref={triggerRef}
          type="button"
        >
          {display}
        </button>
      ) : (
        <Input
          aria-describedby={invalid ? messageId : undefined}
          aria-invalid={invalid || undefined}
          aria-label={label}
          className={cn(numeric && 'tabular-nums')}
          inputMode={numeric ? 'decimal' : undefined}
          onBlur={commit}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          ref={inputRef}
          size="sm"
          value={draft}
        />
      )}
      {invalid ? (
        <p className="mt-1 text-destructive-foreground text-xs" id={messageId}>
          {message}
        </p>
      ) : null}
    </div>
  )
}
