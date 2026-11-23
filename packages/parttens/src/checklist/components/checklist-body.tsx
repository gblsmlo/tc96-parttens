'use client'

import { DragDropProvider } from '@dnd-kit/react'
import type { ReactElement, Ref } from 'react'
import { handleDragEnd } from '../lib/sortable'
import type { ChecklistDensity, ChecklistFrame } from '../lib/variants'
import type { ChecklistItem, ChecklistProps } from '../types/index'
import { ChecklistDraftRow } from './checklist-draft-row'
import { ChecklistList } from './checklist-list'
import { ChecklistReadOnlyRow } from './checklist-read-only-row'
import { ChecklistRow } from './checklist-row'

export interface ChecklistBodyProps {
  authorOptions: NonNullable<ChecklistProps['authorOptions']>
  creating: boolean
  density: ChecklistDensity
  draftInputRef?: Ref<HTMLInputElement>
  frame: ChecklistFrame
  items: readonly ChecklistItem[]
  locale: string
  newItemTitle: string
  onCreate: ChecklistProps['onCreate']
  onDraftEscape?: () => void
  onDraftLeave?: () => void
  onItemAuthorChange?: ChecklistProps['onItemAuthorChange']
  onItemClick?: ChecklistProps['onItemClick']
  onItemCompletionChange: ChecklistProps['onItemCompletionChange']
  onItemDelete?: ChecklistProps['onItemDelete']
  onItemDueDateChange?: ChecklistProps['onItemDueDateChange']
  onItemMove: ChecklistProps['onItemMove']
  onItemRename: ChecklistProps['onItemRename']
  onNewItemTitleChange: ChecklistProps['onNewItemTitleChange']
  readOnly: boolean
  timeZone: string
}

export function ChecklistBody({
  authorOptions,
  creating,
  density,
  draftInputRef,
  frame,
  items,
  locale,
  newItemTitle,
  onCreate,
  onDraftEscape,
  onDraftLeave,
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
}: Readonly<ChecklistBodyProps>): ReactElement {
  if (readOnly) {
    return (
      <ChecklistList variant={frame}>
        {items.map((item) => (
          <ChecklistReadOnlyRow
            density={density}
            variant={frame}
            item={item}
            key={item.id}
            authorOptions={authorOptions}
            locale={locale}
            onItemClick={onItemClick}
            timeZone={timeZone}
          />
        ))}
      </ChecklistList>
    )
  }

  return (
    <DragDropProvider
      onDragEnd={(event) => handleDragEnd(event, items, onItemMove)}
    >
      <ChecklistList variant={frame}>
        {items.map((item, index) => (
          <ChecklistRow
            density={density}
            variant={frame}
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
            onDelete={onItemDelete ? () => onItemDelete(item.id) : undefined}
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
          inputRef={draftInputRef}
          variant={frame}
          onCreate={onCreate}
          onEscape={onDraftEscape}
          onLeave={onDraftLeave}
          onTitleChange={onNewItemTitleChange}
          title={newItemTitle}
        />
      </ChecklistList>
    </DragDropProvider>
  )
}
