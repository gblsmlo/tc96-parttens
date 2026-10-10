'use client'

import { DragDropProvider } from '@dnd-kit/react'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import { ChecklistDraftRow } from '../../components/checklist-draft-row'
import { ChecklistHeader } from '../../components/checklist-header'
import { ChecklistReadOnlyRow } from '../../components/checklist-read-only-row'
import { ChecklistRow } from '../../components/checklist-row'
import { handleDragEnd } from '../../lib/sortable'
import { checklistListVariants, checklistVariants } from '../../lib/variants'
import type { ChecklistProps } from '../../types/index'

export function Checklist({
  ariaLabel,
  authorOptions = [],
  className,
  creating = false,
  density = 'md',
  feedback,
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
  progress = false,
  readOnly = false,
  title,
  timeZone = 'UTC',
  variant = 'card',
  ...props
}: Readonly<ChecklistProps>): ReactElement {
  const completed = items.filter((item) => item.completed).length

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
        completed={completed}
        progress={progress}
        title={title}
        total={items.length}
      />

      {readOnly ? (
        <ol
          className={checklistListVariants({ variant })}
          data-slot="checklist-items"
        >
          {items.map((item) => (
            <ChecklistReadOnlyRow
              density={density}
              variant={variant}
              item={item}
              key={item.id}
              authorOptions={authorOptions}
              locale={locale}
              onItemClick={onItemClick}
              timeZone={timeZone}
            />
          ))}
        </ol>
      ) : (
        <DragDropProvider
          onDragEnd={(event) => handleDragEnd(event, items, onItemMove)}
        >
          <ol
            className={checklistListVariants({ variant })}
            data-slot="checklist-items"
          >
            {items.map((item, index) => (
              <ChecklistRow
                density={density}
                variant={variant}
                item={item}
                itemCount={items.length}
                itemIndex={index}
                key={item.id}
                authorOptions={authorOptions}
                locale={locale}
                onItemClick={onItemClick}
                onItemAuthorChange={onItemAuthorChange}
                onCompletionChange={(completed) =>
                  onItemCompletionChange(item.id, completed)
                }
                onDelete={
                  onItemDelete ? () => onItemDelete(item.id) : undefined
                }
                onItemDueDateChange={onItemDueDateChange}
                onMove={(targetIndex) => onItemMove(item.id, targetIndex)}
                onRename={(title) => onItemRename(item.id, title)}
                timeZone={timeZone}
              />
            ))}
            <ChecklistDraftRow
              callToAction={items.length === 0}
              creating={creating}
              density={density}
              variant={variant}
              onCreate={onCreate}
              onTitleChange={onNewItemTitleChange}
              title={newItemTitle}
            />
          </ol>
        </DragDropProvider>
      )}

      {feedback}
    </section>
  )
}
