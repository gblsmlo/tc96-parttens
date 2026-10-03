'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  createContext,
  type ReactElement,
  useContext,
} from 'react'

export type KanbanCardDisplay = 'full' | 'compact'

const kanbanCardSurfaceVariants = cva(
  'relative flex flex-col rounded-lg border border-border/70 bg-card not-dark:bg-clip-padding text-card-foreground shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
  {
    defaultVariants: { density: 'md' },
    variants: {
      density: {
        md: '[--card-padding:--spacing(6)] [--card-section-gap:--spacing(4)]',
        sm: '[--card-padding:--spacing(4)] [--card-section-gap:--spacing(2)]',
      },
    },
  },
)

export const kanbanCardVariants = cva(
  'relative isolate min-w-0 w-full overflow-hidden transition-colors hover:border-border hover:bg-card/60 has-focus-visible:ring-2 has-focus-visible:ring-primary has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background [&_[data-kanban-card-action]]:relative [&_[data-kanban-card-action]]:z-10',
  {
    defaultVariants: {
      dimmed: false,
      selected: false,
      variant: 'default',
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
      variant: {
        default: null,
        interactive:
          'cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [&>:focus-visible]:outline-none',
      },
    },
  },
)

const kanbanCardHeaderVariants = cva(
  'gap-1 in-[[data-slot=card]:has(>[data-slot=card-panel])]:pb-2',
  {
    variants: {
      display: {
        compact: 'flex min-h-10 min-w-0 items-center gap-2 px-3 py-2',
        full: 'px-3 pt-3 pb-2',
      },
    },
  },
)

const kanbanCardTitleVariants = cva('font-medium text-sm leading-5', {
  variants: {
    display: {
      compact: 'min-w-0 flex-1 truncate',
      full: null,
    },
  },
})

const kanbanCardDescriptionVariants = cva('text-xs leading-5', {
  variants: {
    display: {
      compact: null,
      full: 'line-clamp-3',
    },
  },
})

const kanbanCardContentVariants = cva('px-3 pt-0 pb-3')

const kanbanCardFooterVariants = cva(
  'min-h-9 px-3 py-2 text-xs in-[[data-slot=card]:has(>[data-slot=card-panel])]:pt-2',
)

export interface KanbanCardProps extends useRender.ComponentProps<'article'> {
  density?: VariantProps<typeof kanbanCardSurfaceVariants>['density']
  dimmed?: boolean
  display?: KanbanCardDisplay
  selected?: boolean
  variant?: VariantProps<typeof kanbanCardVariants>['variant']
}

export type KanbanCardActionProps = ComponentProps<typeof CardAction>
export interface KanbanCardActionButtonProps
  extends useRender.ComponentProps<'button'> {
  size?: 'default' | 'icon'
}
export type KanbanCardContentProps = ComponentProps<typeof CardContent>
export type KanbanCardBodyProps = KanbanCardContentProps
export interface KanbanCardBodyRowProps
  extends ComponentPropsWithoutRef<'div'> {
  align?: 'start' | 'between'
}
export type KanbanCardDescriptionProps = ComponentProps<typeof CardDescription>
export type KanbanCardFooterProps = ComponentProps<typeof CardFooter>
export type KanbanCardHeaderProps = ComponentProps<typeof CardHeader>
export type KanbanCardOpenTriggerProps = ComponentPropsWithoutRef<'button'>
export type KanbanCardTitleProps = ComponentProps<typeof CardTitle>

const KanbanCardDisplayContext = createContext<KanbanCardDisplay>('full')

export function KanbanCard({
  className,
  density = 'sm',
  dimmed = false,
  display = 'full',
  render,
  selected = false,
  variant = 'default',
  ...props
}: KanbanCardProps): ReactElement {
  const defaultProps = {
    className: cn(
      kanbanCardSurfaceVariants({ density }),
      kanbanCardVariants({ dimmed, selected, variant }),
      className,
    ),
    'data-density': density,
    'data-display': display,
    'data-pattern': 'kanban-card',
    'data-slot': 'card',
    'data-state': selected ? 'selected' : undefined,
    'data-variant': variant,
  }

  const card = useRender({
    defaultTagName: 'article',
    props: mergeProps<'article'>(defaultProps, props),
    render,
  })

  return (
    <KanbanCardDisplayContext.Provider value={display}>
      {card}
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
      hidden={display === 'compact' || props.hidden}
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
      className={cn(display === 'compact' && 'shrink-0 self-center', className)}
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

export function KanbanCardContent({
  className,
  ...props
}: KanbanCardContentProps): ReactElement {
  const display = useContext(KanbanCardDisplayContext)

  return (
    <CardContent
      className={cn(kanbanCardContentVariants(), className)}
      {...props}
      hidden={display === 'compact' || props.hidden}
    />
  )
}

export const KanbanCardBody = KanbanCardContent

export function KanbanCardBodyRow({
  align = 'start',
  className,
  ...props
}: KanbanCardBodyRowProps): ReactElement {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-2',
        align === 'between' ? 'justify-between' : 'justify-start',
        className,
      )}
      data-slot="kanban-card-body-row"
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
      hidden={display === 'compact' || props.hidden}
    />
  )
}
