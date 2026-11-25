'use client'

import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { Switch } from '@tc96/ui/switch'
import type { ReactElement } from 'react'
import { useId } from 'react'

import { defaultColumnColor } from '../lib/column-color'
import type { KanbanBoardColumn, KanbanColumnActions } from '../types'

export interface KanbanColumnSettingsProps {
  actions: KanbanColumnActions
  column: Pick<KanbanBoardColumn, 'collapsed' | 'color' | 'id' | 'title'>
  label: string
  onCollapsedChange?: (collapsed: boolean) => void
}

export function KanbanColumnSettings({
  actions,
  column,
  label,
  onCollapsedChange,
}: Readonly<KanbanColumnSettingsProps>): ReactElement {
  const colorName = useId()
  const collapseId = useId()
  const colorOptions =
    actions.onColorChange && actions.colorOptions?.length
      ? actions.colorOptions
      : undefined

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) actions.onSettingsOpen?.(column.id)
      }}
    >
      <PopoverTrigger
        aria-label={label}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverPopup
        align="end"
        aria-label={label}
        className="w-64"
        data-slot="kanban-column-settings"
      >
        <div className="flex flex-col gap-4">
          <p className="truncate font-medium text-sm">{column.title}</p>
          {colorOptions ? (
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-muted-foreground text-xs">
                {actions.colorLabel ?? 'Cor'}
              </legend>
              <div
                className="flex flex-wrap gap-2"
                data-slot="kanban-column-color-options"
              >
                {colorOptions.map((option) => (
                  <label
                    className="relative flex cursor-pointer"
                    data-slot="kanban-column-color-option"
                    key={option.value}
                    title={option.label}
                  >
                    <input
                      aria-label={option.label}
                      checked={
                        (column.color ?? defaultColumnColor) === option.value
                      }
                      className="peer sr-only"
                      name={colorName}
                      onChange={() =>
                        actions.onColorChange?.(column.id, option.value)
                      }
                      type="radio"
                      value={option.value}
                    />
                    <span
                      aria-hidden="true"
                      className="block size-6 rounded-full shadow-[inset_0_0_0_1px_var(--border)] ring-offset-2 ring-offset-popover peer-checked:ring-2 peer-checked:ring-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
                      style={{ backgroundColor: option.value }}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          {onCollapsedChange ? (
            <div
              className="flex items-center justify-between gap-3"
              data-slot="kanban-column-collapse"
            >
              <label className="text-sm" htmlFor={collapseId}>
                {actions.collapseLabel ?? 'Recolher coluna'}
              </label>
              <Switch
                checked={Boolean(column.collapsed)}
                id={collapseId}
                onCheckedChange={onCollapsedChange}
              />
            </div>
          ) : null}
        </div>
      </PopoverPopup>
    </Popover>
  )
}
