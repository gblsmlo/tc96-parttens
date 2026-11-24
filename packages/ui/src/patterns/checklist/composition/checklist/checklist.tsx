'use client'

import { cn } from '@tc96/utils'
import { type ReactElement, useEffect, useRef, useState } from 'react'
import { ChecklistBody } from '../../components/checklist-body'
import { ChecklistGroup } from '../../components/checklist-group'
import { ChecklistHeader } from '../../components/checklist-header'
import { ChecklistTrigger } from '../../components/checklist-trigger'
import { checklistFilterNarrows } from '../../lib/filter'
import { checklistVariants } from '../../lib/variants'
import type { ChecklistProps } from '../../types/index'

export function Checklist({
  actions,
  addLabel = 'Adicionar etapas',
  ariaLabel,
  authorOptions = [],
  className,
  creating = false,
  density = 'md',
  feedback,
  filter,
  items,
  locale = 'en-US',
  newItemTitle,
  onCreate,
  onItemClick,
  onItemAuthorChange,
  onItemCompletionChange,
  onItemDelete,
  onItemDueDateChange,
  onItemMove,
  onItemRename,
  onNewItemTitleChange,
  readOnly = false,
  title,
  timeZone = 'UTC',
  variant = 'card',
  ...props
}: Readonly<ChecklistProps>): ReactElement {
  const [composing, setComposing] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const restoreTriggerFocus = useRef(false)

  useEffect(() => {
    if (!composing && restoreTriggerFocus.current) {
      restoreTriggerFocus.current = false
      triggerRef.current?.focus()
    }
  }, [composing])

  if (composing && items.length > 0) setComposing(false)

  const body = {
    authorOptions,
    creating,
    density,
    items,
    locale,
    newItemTitle,
    onCreate,
    onItemAuthorChange,
    onItemClick,
    onItemCompletionChange,
    onItemDelete,
    onItemDueDateChange,
    onItemMove,
    onItemRename,
    onNewItemTitleChange,
    readOnly,
    timeZone,
  }

  if (variant === 'card' || variant === 'plain') {
    return (
      <section
        aria-label={ariaLabel}
        className={cn(checklistVariants({ variant }), className)}
        data-density={density}
        data-readonly={readOnly || undefined}
        data-slot="checklist"
        data-variant={variant}
        {...props}
      >
        <ChecklistHeader
          completed={items.filter((item) => item.completed).length}
          title={title}
          total={items.length}
        />

        <ChecklistBody {...body} frame={variant} />

        {feedback}
      </section>
    )
  }

  const grouped =
    variant === 'complete' ||
    items.length > 0 ||
    composing ||
    checklistFilterNarrows(filter)

  return (
    <div
      className={cn(checklistVariants({ variant }), className)}
      data-density={density}
      data-readonly={readOnly || undefined}
      data-slot="checklist"
      data-variant={variant}
      {...props}
    >
      {grouped ? (
        <ChecklistGroup
          {...body}
          actions={actions}
          addLabel={addLabel}
          autoFocusDraft={composing}
          filter={filter}
          onDraftEscape={
            composing
              ? () => {
                  restoreTriggerFocus.current = true
                  setComposing(false)
                }
              : undefined
          }
          onDraftLeave={composing ? () => setComposing(false) : undefined}
          title={title ?? ariaLabel}
        />
      ) : (
        <ChecklistTrigger
          addLabel={addLabel}
          disabled={readOnly}
          onClick={() => setComposing(true)}
          triggerRef={triggerRef}
        />
      )}

      {feedback}
    </div>
  )
}
