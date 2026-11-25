'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tc96/ui/card'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { cva } from 'class-variance-authority'
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  createContext,
  type ReactElement,
  useContext,
} from 'react'

export type KanbanCardDisplay = 'full' | 'minimal'

export const kanbanCardVariants = cva(
  'relative isolate min-w-0 w-full overflow-hidden transition-colors hover:bg-card/60 has-focus-visible:ring-2 has-focus-visible:ring-primary has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background [&_[data-kanban-card-action]]:relative [&_[data-kanban-card-action]]:z-10',
  {
    defaultVariants: {
      dimmed: false,
      interactive: false,
      selected: false,
    },
    variants: {
      dimmed: {
        false: null,
        true: 'border-dashed shadow-none',
      },
      selected: {
        false: null,
        true: 'ring-2 ring-primary/40 ring-offset-2 ring-offset-background',
      },
      interactive: {
        false: null,
        true: 'cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [&>:focus-visible]:outline-none',
      },
    },
  },
)

const kanbanCardHeaderVariants = cva(
  'gap-1 in-[[data-slot=card]:has(>[data-slot=card-panel])]:pb-2',
  {
    variants: {
      display: {
        minimal: 'flex min-h-10 min-w-0 items-center gap-2 px-3 py-2',
        full: 'px-3 pt-3 pb-2',
      },
    },
  },
)

const kanbanCardTitleVariants = cva('font-medium text-sm leading-5', {
  variants: {
    display: {
      minimal: 'min-w-0 flex-1 truncate',
      full: null,
    },
  },
})

const kanbanCardDescriptionVariants = cva('text-xs leading-5', {
  variants: {
    display: {
      minimal: null,
      full: 'line-clamp-3',
    },
  },
})

const kanbanCardBodyVariants = cva(
  'grid grid-cols-[auto_minmax(0,1fr)] gap-2 px-3 pt-0 pb-3 text-sm',
)

const kanbanCardFooterVariants = cva(
  'min-h-9 gap-2 px-3 py-2 text-xs in-[[data-slot=card]:has(>[data-slot=card-panel])]:pt-3',
)

export interface KanbanCardProps extends useRender.ComponentProps<'article'> {
  dimmed?: boolean
  display?: KanbanCardDisplay
  interactive?: boolean
  selected?: boolean
}

export type KanbanCardActionProps = ComponentProps<typeof CardAction>
export interface KanbanCardActionButtonProps
  extends useRender.ComponentProps<'button'> {
  size?: 'default' | 'icon'
}
export type KanbanCardBodyProps = ComponentProps<typeof CardContent>
export type KanbanCardControlProps = ComponentPropsWithoutRef<'span'>
export type KanbanCardFieldProps = ComponentPropsWithoutRef<'div'>
export type KanbanCardFieldLabelProps = ComponentProps<typeof Text>
export interface KanbanCardFieldValueProps
  extends ComponentPropsWithoutRef<'div'> {
  interactive?: boolean
}
export type KanbanCardDescriptionProps = ComponentProps<typeof CardDescription>
export type KanbanCardFooterProps = ComponentProps<typeof CardFooter>
export type KanbanCardHeaderProps = ComponentProps<typeof CardHeader>
export type KanbanCardOpenTriggerProps = ComponentPropsWithoutRef<'button'>
export type KanbanCardTitleProps = ComponentProps<typeof CardTitle>

const KanbanCardDisplayContext = createContext<KanbanCardDisplay>('full')

export function KanbanCard({
  children,
  className,
  dimmed = false,
  display = 'full',
  interactive = false,
  ref,
  render,
  selected = false,
  ...props
}: KanbanCardProps): ReactElement {
  return (
    <KanbanCardDisplayContext.Provider value={display}>
      <Card
        className={cn(
          kanbanCardVariants({ dimmed, interactive, selected }),
          className,
        )}
        data-display={display}
        data-interactive={interactive ? '' : undefined}
        data-pattern="kanban-card"
        data-state={selected ? 'selected' : undefined}
        render={render ?? <article />}
        ref={ref as ComponentProps<typeof Card>['ref']}
        {...props}
      >
        {children}
      </Card>
    </KanbanCardDisplayContext.Provider>
  )
}

export function KanbanCardHeader({
  className,
  ...props
}: KanbanCardHeaderProps): ReactElement {
  const display = useContext(KanbanCardDisplayContext)

  return (
    <CardHeader
      className={cn(kanbanCardHeaderVariants({ display }), className)}
      {...props}
    />
  )
}

export function KanbanCardTitle({
  className,
  ...props
}: KanbanCardTitleProps): ReactElement {
  const display = useContext(KanbanCardDisplayContext)

  return (
    <CardTitle
      className={cn(kanbanCardTitleVariants({ display }), className)}
      {...props}
    />
  )
}

export function KanbanCardDescription({
  className,
  ...props
}: KanbanCardDescriptionProps): ReactElement {
  const display = useContext(KanbanCardDisplayContext)

  return (
    <CardDescription
      className={cn(kanbanCardDescriptionVariants({ display }), className)}
      {...props}
      hidden={display === 'minimal' || props.hidden}
    />
  )
}

export function KanbanCardAction({
  className,
  ...props
}: KanbanCardActionProps): ReactElement {
  const display = useContext(KanbanCardDisplayContext)

  return (
    <CardAction
      className={cn(display === 'minimal' && 'shrink-0 self-center', className)}
      data-kanban-card-action=""
      {...props}
    />
  )
}

export function KanbanCardActionButton({
  className,
  render,
  size = 'default',
  ...props
}: KanbanCardActionButtonProps): ReactElement {
  const defaultProps = {
    className: cn(
      'inline-flex min-h-7 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md border border-transparent px-1.5 text-card-foreground/70 text-xs outline-none transition-colors hover:bg-accent hover:text-card-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
      size === 'icon' && 'size-7 p-0',
      className,
    ),
    'data-kanban-card-action': '',
    'data-slot': 'kanban-card-action-button',
    type: 'button' as const,
  }

  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    render,
  })
}

export function KanbanCardOpenTrigger({
  className,
  ...props
}: KanbanCardOpenTriggerProps): ReactElement {
  return (
    <button
      className={cn(
        'absolute inset-0 cursor-pointer rounded-[inherit] outline-none',
        className,
      )}
      data-slot="kanban-card-open-trigger"
      type="button"
      {...props}
    />
  )
}

export function KanbanCardBody({
  className,
  ...props
}: KanbanCardBodyProps): ReactElement {
  const display = useContext(KanbanCardDisplayContext)

  return (
    <CardContent
      className={cn(kanbanCardBodyVariants(), className)}
      {...props}
      hidden={display === 'minimal' || props.hidden}
    />
  )
}

export function KanbanCardField({
  className,
  ...props
}: KanbanCardFieldProps): ReactElement {
  return (
    <div
      className={cn('col-span-2 grid min-w-0 grid-cols-subgrid', className)}
      data-slot="kanban-card-field"
      {...props}
    />
  )
}

export function KanbanCardFieldLabel({
  className,
  ...props
}: KanbanCardFieldLabelProps): ReactElement {
  return (
    <Text
      className={cn(
        'flex min-w-0 items-center gap-2 [&>svg]:size-3.5 [&>svg]:shrink-0',
        className,
      )}
      data-slot="kanban-card-field-label"
      foreground="muted"
      size="sm"
      {...props}
    />
  )
}

export function KanbanCardFieldValue({
  className,
  interactive = false,
  ...props
}: KanbanCardFieldValueProps): ReactElement {
  return (
    <div
      className={cn('flex min-w-0 flex-1 items-center tabular-nums', className)}
      data-kanban-card-action={interactive ? '' : undefined}
      data-slot="kanban-card-field-value"
      {...props}
    />
  )
}

export function KanbanCardControl({
  className,
  ...props
}: KanbanCardControlProps): ReactElement {
  return (
    <span
      className={cn('flex shrink-0 items-center gap-1', className)}
      data-kanban-card-action=""
      data-slot="kanban-card-control"
      {...props}
    />
  )
}

export function KanbanCardFooter({
  className,
  ...props
}: KanbanCardFooterProps): ReactElement {
  const display = useContext(KanbanCardDisplayContext)

  return (
    <CardFooter
      className={cn(kanbanCardFooterVariants(), className)}
      {...props}
      hidden={display === 'minimal' || props.hidden}
    />
  )
}
