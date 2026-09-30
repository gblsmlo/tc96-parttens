'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '@tc96/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentPropsWithoutRef, ReactElement } from 'react'

export type CalendarEventChipTone = VariantProps<
  typeof calendarEventChipVariants
>['tone']
export type CalendarEventChipDisplay = 'block' | 'chip'

export const calendarEventChipVariants = cva(
  'relative isolate flex min-w-0 select-none overflow-hidden rounded-md border-s-2 text-start text-xs leading-4 [&_[data-calendar-item-action]]:relative [&_[data-calendar-item-action]]:z-10',
  {
    defaultVariants: {
      completed: false,
      display: 'chip',
      tone: 'neutral',
    },
    variants: {
      completed: {
        // Concluída aparece com distinção visual, nunca some (TASK-044).
        false: null,
        true: 'opacity-60 [&_[data-slot=calendar-event-chip-title]]:line-through',
      },
      display: {
        block: 'h-full w-full flex-col gap-0.5 px-2 py-1',
        chip: 'w-full items-center gap-1 px-1.5 py-0.5',
      },
      tone: {
        destructive:
          'border-s-destructive bg-destructive/8 text-destructive-foreground dark:bg-destructive/16',
        neutral:
          'border-s-muted-foreground/40 bg-muted/60 text-foreground dark:bg-muted/40',
        primary:
          'border-s-primary bg-primary/8 text-foreground dark:bg-primary/16',
        success:
          'border-s-success bg-success/8 text-success-foreground dark:bg-success/16',
        warning:
          'border-s-warning bg-warning/8 text-warning-foreground dark:bg-warning/16',
      },
    },
  },
)

export interface CalendarEventChipProps
  extends useRender.ComponentProps<'article'> {
  /** Distinção visual de item concluído (`TASK-044`). */
  completed?: boolean
  /** `chip` é a linha única do mês e da faixa all-day; `block` preenche o segmento do time grid. */
  display?: CalendarEventChipDisplay
  /** Vocabulário visual neutro — o consumidor mapeia o domínio para um tom. */
  tone?: CalendarEventChipTone
}

export type CalendarEventChipTimeProps = ComponentPropsWithoutRef<'time'>
export type CalendarEventChipTitleProps = ComponentPropsWithoutRef<'span'>
export type CalendarEventChipOpenTriggerProps =
  ComponentPropsWithoutRef<'button'>

export function CalendarEventChip({
  className,
  completed = false,
  display = 'chip',
  render,
  tone = 'neutral',
  ...props
}: CalendarEventChipProps): ReactElement {
  const defaultProps = {
    className: cn(
      calendarEventChipVariants({ completed, display, tone }),
      className,
    ),
    'data-completed': completed ? '' : undefined,
    'data-display': display,
    'data-slot': 'calendar-event-chip',
    'data-tone': tone,
  }

  return useRender({
    defaultTagName: 'article',
    props: mergeProps<'article'>(defaultProps, props),
    render,
  })
}

export function CalendarEventChipTime({
  className,
  ...props
}: CalendarEventChipTimeProps): ReactElement {
  return (
    <time
      className={cn(
        'shrink-0 whitespace-nowrap font-medium tabular-nums opacity-70',
        className,
      )}
      data-slot="calendar-event-chip-time"
      {...props}
    />
  )
}

export function CalendarEventChipTitle({
  className,
  ...props
}: CalendarEventChipTitleProps): ReactElement {
  return (
    <span
      className={cn('min-w-0 flex-1 truncate font-medium', className)}
      data-slot="calendar-event-chip-title"
      {...props}
    />
  )
}

/**
 * Alvo de clique do chip inteiro, esticado sobre ele.
 *
 * O chip é `article`, não `button`: controle interno futuro segue clicável
 * marcado com `data-calendar-item-action`, que o eleva acima deste gatilho e
 * impede o arraste de roubar o ponteiro — o mesmo desenho do KanbanCard.
 */
export function CalendarEventChipOpenTrigger({
  className,
  ...props
}: CalendarEventChipOpenTriggerProps): ReactElement {
  return (
    <button
      className={cn(
        'absolute inset-0 cursor-pointer rounded-[inherit] outline-none',
        className,
      )}
      data-slot="calendar-event-chip-open-trigger"
      type="button"
      {...props}
    />
  )
}
