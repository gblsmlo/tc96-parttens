'use client'

import { KeyboardSensor, PointerSensor } from '@dnd-kit/dom'
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react'
import { isSortableOperation, useSortable } from '@dnd-kit/react/sortable'
import { Title } from '@tc96/elements/title'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { InputPrimitive } from '@tc96/ui/input'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import { cn } from '@tc96/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import type { ComponentPropsWithoutRef, KeyboardEvent, ReactNode } from 'react'
import {
  DateProperty,
  formatDateProperty,
  parseDatePropertyValue,
} from '../properties/display/date/date-property'
import {
  EditableText,
  type EditableTextSize,
} from '../properties/display/editable-text/editable-text'
import {
  PersonProperty,
  type PersonPropertyOption,
} from '../properties/display/person/person-property'

const CHECKLIST_ITEM_TYPE = 'checklist-item'
const CHECKLIST_SENSORS = [
  PointerSensor,
  KeyboardSensor.configure({
    keyboardCodes: {
      cancel: ['Escape'],
      down: ['ArrowDown'],
      end: ['Space', 'Tab'],
      left: ['ArrowLeft'],
      right: ['ArrowRight'],
      start: ['Space'],
      up: ['ArrowUp'],
    },
  }),
]

const checklistRowVariants = cva('flex min-w-0 items-center gap-2', {
  defaultVariants: {
    density: 'md',
  },
  variants: {
    density: {
      md: 'h-10 px-3',
      sm: 'h-8 px-2',
    },
  },
})

const CHECKLIST_TITLE_SIZE = { md: 'base', sm: 'sm' } as const satisfies Record<
  ChecklistDensity,
  EditableTextSize
>

const checklistCheckboxVariants = cva("after:absolute after:content-['']", {
  defaultVariants: {
    density: 'md',
  },
  variants: {
    density: {
      md: 'after:size-11',
      sm: 'after:size-8',
    },
  },
})

const CHECKLIST_DRAG_HANDLE_CLASSNAME =
  'absolute -left-8 top-1/2 z-10 -translate-y-1/2 invisible touch-none opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 focus-visible:visible focus-visible:opacity-100'
const CHECKLIST_ITEM_CLASSNAME =
  'group relative min-w-0 transition-colors hover:bg-muted/60 first:rounded-t-xl last:rounded-b-xl'
const CHECKLIST_LIST_CLASSNAME = 'rounded-xl border border-border/60'

export type ChecklistDensity = NonNullable<
  VariantProps<typeof checklistRowVariants>['density']
>

export interface ChecklistItem {
  authorId?: string | null
  completed: boolean
  dueDate?: string | null
  id: string
  title: string
}

export interface ChecklistProps
  extends Omit<ComponentPropsWithoutRef<'section'>, 'title'> {
  ariaLabel: string
  authorOptions?: readonly PersonPropertyOption[]
  creating?: boolean
  density?: ChecklistDensity
  feedback?: ReactNode
  items: readonly ChecklistItem[]
  locale?: string
  newItemTitle: string
  onCreate: (title: string, completed: boolean) => void
  onItemClick?: (item: ChecklistItem) => void
  onItemAuthorChange?: (id: string, authorId: string) => void
  onItemCompletionChange: (id: string, completed: boolean) => void
  onItemDelete?: (id: string) => void
  onItemDueDateChange?: (id: string, dueDate: string | null) => void
  onItemMove: (id: string, targetIndex: number) => void
  onItemRename: (id: string, title: string) => void
  onNewItemTitleChange: (title: string) => void
  progress?: boolean
  readOnly?: boolean
  title?: ReactNode
  timeZone?: string
}

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
  ...props
}: Readonly<ChecklistProps>) {
  const completed = items.filter((item) => item.completed).length
  const progressLabel = `${completed} de ${items.length} ${items.length === 1 ? 'concluído' : 'concluídos'}`

  return (
    <section
      aria-label={ariaLabel}
      className={cn('min-w-0 space-y-2 pt-2 pb-4', className)}
      data-density={density}
      data-readonly={readOnly || undefined}
      data-slot="checklist"
      {...props}
    >
      {items.length === 0 ? (
        title == null ? null : (
          <div
            className="flex items-center justify-between gap-3"
            data-slot="checklist-header"
          >
            <Title family="sans" size="sm" weight="medium">
              {title}
            </Title>
          </div>
        )
      ) : title == null && !progress ? null : (
        <div data-slot="progress">
          {title == null ? null : (
            <div
              className="flex items-center justify-between gap-3"
              data-slot="checklist-header"
            >
              <Title family="sans" size="sm" weight="medium">
                {title}
              </Title>
              <span className="text-muted-foreground text-sm tabular-nums">
                {progressLabel}
              </span>
            </div>
          )}
          {progress ? (
            <div
              aria-label={progressLabel}
              aria-valuemax={items.length}
              aria-valuemin={0}
              aria-valuenow={completed}
              className="h-1.5 overflow-hidden rounded-full bg-muted"
              data-slot="progress-track"
              role="progressbar"
            >
              <div
                className="h-full bg-primary"
                style={{ width: `${(completed / items.length) * 100}%` }}
              />
            </div>
          ) : null}
        </div>
      )}

      {readOnly ? (
        <ol className={CHECKLIST_LIST_CLASSNAME} data-slot="checklist-items">
          {items.map((item) => (
            <ChecklistReadOnlyRow
              density={density}
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
          <ol className={CHECKLIST_LIST_CLASSNAME} data-slot="checklist-items">
            {items.map((item, index) => (
              <ChecklistRow
                density={density}
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

function ChecklistDraftRow({
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
}>) {
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
              className={cn(
                'min-w-0 flex-1 bg-transparent outline-none placeholder:text-foreground/40',
                density === 'sm' ? 'text-sm' : 'text-base',
              )}
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

function ChecklistRow({
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
}>) {
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
      className={cn(CHECKLIST_ITEM_CLASSNAME, isDragSource && 'opacity-40')}
      ref={ref}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
              aria-label={`Reordenar ${item.title}`}
              className={cn(
                CHECKLIST_DRAG_HANDLE_CLASSNAME,
                'cursor-grab active:cursor-grabbing',
              )}
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
          onItemClick ? (
            <Title
              aria-label={`Abrir ${item.title}`}
              className={cn(
                'h-full min-w-0 flex-1 cursor-pointer truncate text-left focus-visible:outline-2 focus-visible:outline-ring',
                item.completed && 'text-muted-foreground line-through',
              )}
              family="sans"
              onClick={() => onItemClick(item)}
              render={<button type="button" />}
              size={density === 'sm' ? 'sm' : 'md'}
              weight="normal"
            >
              {item.title}
            </Title>
          ) : (
            <span className="min-w-0 flex-1">
              <EditableText
                ariaLabel={`Título: ${item.title}`}
                className={cn(
                  'min-w-0 flex-1',
                  item.completed && 'text-muted-foreground line-through',
                )}
                onCommit={(next) => next && onRename(next)}
                revertWhenEmpty
                size={CHECKLIST_TITLE_SIZE[density]}
                value={item.title}
              />
            </span>
          )
        }
      />
    </li>
  )
}

function ChecklistDeleteButton({
  itemTitle,
  onDelete,
}: Readonly<{ itemTitle: string; onDelete: () => void }>) {
  return (
    <Button
      aria-label={`Excluir ${itemTitle}`}
      className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      onClick={onDelete}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <Trash2Icon aria-hidden="true" />
    </Button>
  )
}

function ChecklistReadOnlyRow({
  authorOptions,
  density,
  item,
  locale,
  onItemClick,
  timeZone,
}: Readonly<{
  authorOptions: readonly PersonPropertyOption[]
  density: ChecklistDensity
  item: ChecklistItem
  locale: string
  onItemClick?: ChecklistProps['onItemClick']
  timeZone: string
}>) {
  return (
    <li className={CHECKLIST_ITEM_CLASSNAME}>
      <ChecklistItemCard
        action={
          <ChecklistMetadata
            authorOptions={authorOptions}
            item={item}
            locale={locale}
            readOnly
            timeZone={timeZone}
          />
        }
        checkbox={
          <Checkbox
            aria-label={item.title}
            checked={item.completed}
            className={checklistCheckboxVariants({ density })}
            disabled
          />
        }
        density={density}
        title={
          onItemClick ? (
            <Title
              aria-label={`Abrir ${item.title}`}
              className={cn(
                'h-full min-w-0 flex-1 cursor-pointer truncate text-left focus-visible:outline-2 focus-visible:outline-ring',
                item.completed && 'text-muted-foreground line-through',
              )}
              family="sans"
              onClick={() => onItemClick(item)}
              render={<button type="button" />}
              size={density === 'sm' ? 'sm' : 'md'}
              weight="normal"
            >
              {item.title}
            </Title>
          ) : (
            <Title
              className={cn(
                'min-w-0 flex-1 truncate',
                item.completed && 'text-muted-foreground line-through',
              )}
              family="sans"
              size={density === 'sm' ? 'sm' : 'md'}
              weight="normal"
            >
              {item.title}
            </Title>
          )
        }
      />
    </li>
  )
}

function ChecklistMetadata({
  authorOptions,
  item,
  locale,
  onItemAuthorChange,
  onItemDueDateChange,
  readOnly = false,
  timeZone,
}: Readonly<{
  authorOptions: readonly PersonPropertyOption[]
  item: ChecklistItem
  locale: string
  onItemAuthorChange?: ChecklistProps['onItemAuthorChange']
  onItemDueDateChange?: ChecklistProps['onItemDueDateChange']
  readOnly?: boolean
  timeZone: string
}>) {
  if (item.authorId === undefined && item.dueDate === undefined) return null
  const dueDayOffset = calendarDayOffset(item.dueDate, new Date(), timeZone)

  return (
    <span
      className="flex shrink-0 items-center gap-3 text-muted-foreground"
      data-slot="checklist-actions"
    >
      {item.authorId !== undefined ? (
        <PersonProperty
          ariaLabel="Author"
          options={authorOptions}
          readOnly={readOnly || !onItemAuthorChange}
          value={item.authorId}
          variant="plain"
          onValueChange={(authorId) => onItemAuthorChange?.(item.id, authorId)}
        />
      ) : null}
      {item.dueDate !== undefined ? (
        <DateProperty
          ariaLabel="Due date"
          className={cn(
            dueDayOffset !== null && dueDayOffset < 0
              ? 'text-destructive'
              : dueDayOffset === 0
                ? 'text-amber-500'
                : 'text-muted-foreground',
          )}
          displayLabel={formatChecklistDueDate(
            item.dueDate,
            locale,
            timeZone,
            dueDayOffset,
          )}
          fallback="No due date"
          isOverdue={dueDayOffset !== null && dueDayOffset < 0}
          locale={locale}
          readOnly={readOnly || !onItemDueDateChange}
          timeZone={timeZone}
          value={item.dueDate}
          variant="plain"
          onValueChange={(dueDate) => onItemDueDateChange?.(item.id, dueDate)}
        />
      ) : null}
    </span>
  )
}

function calendarDayOffset(
  value: string | null | undefined,
  now: Date,
  timeZone: string,
): number | null {
  const due = parseDatePropertyValue(value ?? null)
  if (!due) return null
  const formatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    timeZone,
    year: 'numeric',
  })
  const dayNumber = (date: Date) => {
    const parts = Object.fromEntries(
      formatter.formatToParts(date).map((part) => [part.type, part.value]),
    )
    return (
      Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)) /
      86_400_000
    )
  }
  return dayNumber(due) - dayNumber(now)
}

function formatChecklistDueDate(
  value: string | null,
  locale: string,
  timeZone: string,
  dayOffset: number | null,
): string {
  if (dayOffset !== null && Math.abs(dayOffset) <= 1) {
    const label = new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
    }).format(dayOffset, 'day')
    return label.charAt(0).toLocaleUpperCase(locale) + label.slice(1)
  }
  return formatDateProperty(value, 'No due date', locale, timeZone)
}

function ChecklistItemCard({
  action,
  checkbox,
  density,
  title,
}: Readonly<{
  action: ReactNode
  checkbox: ReactNode
  density: ChecklistDensity
  title: ReactNode
}>) {
  return (
    <div
      className={checklistRowVariants({ density })}
      data-slot="checklist-row"
    >
      <span className="flex shrink-0 items-center justify-center">
        {checkbox}
      </span>
      {title}
      {action}
    </div>
  )
}

function handleMoveShortcut(
  event: KeyboardEvent<HTMLButtonElement>,
  itemIndex: number,
  itemCount: number,
  onMove: (targetIndex: number) => void,
) {
  if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown'))
    return

  const targetIndex = event.key === 'ArrowUp' ? itemIndex - 1 : itemIndex + 1
  if (targetIndex < 0 || targetIndex >= itemCount) return
  event.preventDefault()
  onMove(targetIndex)
}

function handleDragEnd(
  event: DragEndEvent,
  items: readonly ChecklistItem[],
  onItemMove: ChecklistProps['onItemMove'],
) {
  if (event.canceled || !isSortableOperation(event.operation)) return

  const { source, target } = event.operation
  if (!source || !target) return

  const itemId = String(source.id)
  const sourceIndex = items.findIndex((item) => item.id === itemId)
  const targetIndex = target.index
  if (sourceIndex < 0 || sourceIndex === targetIndex) return
  onItemMove(itemId, targetIndex)
}
