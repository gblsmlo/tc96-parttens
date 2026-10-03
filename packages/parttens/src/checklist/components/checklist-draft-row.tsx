'use client'

import { Checkbox } from '@tc96/ui/checkbox'
import { InputPrimitive } from '@tc96/ui/input'
import { PlusIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import {
  CHECKLIST_ITEM_CLASSNAME,
  type ChecklistDensity,
  checklistCheckboxVariants,
  checklistDraftInputVariants,
} from '../lib/variants'
import type { ChecklistProps } from '../types/index'
import { ChecklistItemCard } from './checklist-item-card'

export function ChecklistDraftRow({
  callToAction,
  creating,
  density,
  onCreate,
  onTitleChange,
  title,
}: Readonly<{
  callToAction: boolean
  creating: boolean
  density: ChecklistDensity
  onCreate: ChecklistProps['onCreate']
  onTitleChange: ChecklistProps['onNewItemTitleChange']
  title: string
}>): ReactElement {
  const normalizedTitle = title.trim()
  const actionable = normalizedTitle.length > 0 && !creating
  const create = (completed: boolean) => {
    if (actionable) onCreate(normalizedTitle, completed)
  }

  return (
    <li className={CHECKLIST_ITEM_CLASSNAME} data-slot="checklist-draft-item">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          create(false)
        }}
      >
        <ChecklistItemCard
          action={null}
          density={density}
          checkbox={
            callToAction ? (
              <PlusIcon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
            ) : (
              <Checkbox
                aria-label="Concluir novo item"
                checked={false}
                className={checklistCheckboxVariants({ density })}
                disabled={!actionable}
                onCheckedChange={(checked) => {
                  if (checked === true) create(true)
                }}
              />
            )
          }
          title={
            <InputPrimitive
              aria-label="Novo item"
              className={checklistDraftInputVariants({ density })}
              disabled={creating}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Adicionar uma nova etapa"
              type="text"
              value={title}
            />
          }
        />
      </form>
    </li>
  )
}
