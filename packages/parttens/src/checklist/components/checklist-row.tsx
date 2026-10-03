'use client'

import { useSortable } from '@dnd-kit/react/sortable'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import { GripVerticalIcon, Trash2Icon } from 'lucide-react'
import type { ReactElement } from 'react'
import type { PersonPropertyOption } from '../../properties/display/person/person-property'
import {
  CHECKLIST_ITEM_TYPE,
  CHECKLIST_SENSORS,
  handleMoveShortcut,
} from '../lib/sortable'
import {
  CHECKLIST_DELETE_BUTTON_CLASSNAME,
  CHECKLIST_DRAG_HANDLE_CLASSNAME,
  CHECKLIST_ITEM_CLASSNAME,
  type ChecklistDensity,
  checklistCheckboxVariants,
} from '../lib/variants'
import type { ChecklistItem, ChecklistProps } from '../types/index'
import { ChecklistItemCard, ChecklistTitle } from './checklist-item-card'
import { ChecklistMetadata } from './checklist-metadata'

export function ChecklistRow({
  authorOptions,
  density,
  item,
  itemCount,
  itemIndex,
  locale,
  onItemClick,
  onItemAuthorChange,
  onCompletionChange,
  onDelete,
  onItemDueDateChange,
  onMove,
  onRename,
  timeZone,
}: Readonly<{
  authorOptions: readonly PersonPropertyOption[]
  density: ChecklistDensity
  item: ChecklistItem
  itemCount: number
  itemIndex: number
  locale: string
  onItemClick?: ChecklistProps['onItemClick']
  onItemAuthorChange?: ChecklistProps['onItemAuthorChange']
  onCompletionChange: (completed: boolean) => void
  onDelete?: () => void
  onItemDueDateChange?: ChecklistProps['onItemDueDateChange']
  onMove: (targetIndex: number) => void
  onRename: (title: string) => void
  timeZone: string
}>): ReactElement {
  const { handleRef, isDragSource, ref } = useSortable({
    accept: CHECKLIST_ITEM_TYPE,
    data: { type: CHECKLIST_ITEM_TYPE },
    disabled: itemCount < 2,
    group: 'checklist',
    id: item.id,
    index: itemIndex,
    sensors: CHECKLIST_SENSORS,
    transition: null,
    type: CHECKLIST_ITEM_TYPE,
  })

  return (
    <li
      className={CHECKLIST_ITEM_CLASSNAME}
      data-completed={item.completed || undefined}
      data-dragging={isDragSource || undefined}
      data-slot="checklist-item"
      ref={ref}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
              aria-label={`Reordenar ${item.title}`}
              className={CHECKLIST_DRAG_HANDLE_CLASSNAME}
              data-slot="checklist-drag-handle"
              disabled={itemCount < 2}
              onKeyDown={(event) =>
                handleMoveShortcut(event, itemIndex, itemCount, onMove)
              }
              ref={handleRef}
              size="icon-sm"
              type="button"
              variant="ghost"
            />
          }
        >
          <GripVerticalIcon aria-hidden="true" />
        </TooltipTrigger>
        <TooltipPopup>Arraste para ordenar acima ou abaixo</TooltipPopup>
      </Tooltip>
      <ChecklistItemCard
        action={
          <>
            <ChecklistMetadata
              authorOptions={authorOptions}
              item={item}
              locale={locale}
              onItemAuthorChange={onItemAuthorChange}
              onItemDueDateChange={onItemDueDateChange}
              timeZone={timeZone}
            />
            {onDelete ? (
              <ChecklistDeleteButton
                itemTitle={item.title}
                onDelete={onDelete}
              />
            ) : null}
          </>
        }
        checkbox={
          <Checkbox
            aria-label={item.title}
            checked={item.completed}
            className={checklistCheckboxVariants({ density })}
            onCheckedChange={(checked) => onCompletionChange(checked === true)}
          />
        }
        density={density}
        title={
          <ChecklistTitle
            density={density}
            item={item}
            onItemClick={onItemClick}
            onRename={onRename}
          />
        }
      />
    </li>
  )
}

function ChecklistDeleteButton({
  itemTitle,
  onDelete,
}: Readonly<{ itemTitle: string; onDelete: () => void }>): ReactElement {
  return (
    <Button
      aria-label={`Excluir ${itemTitle}`}
      className={CHECKLIST_DELETE_BUTTON_CLASSNAME}
      data-slot="checklist-delete"
      onClick={onDelete}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <Trash2Icon aria-hidden="true" />
    </Button>
  )
}
