'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { Text } from '@tc96/elements/text'
import { Button } from '@tc96/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tc96/ui/card'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { cn } from '@tc96/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { EllipsisIcon } from 'lucide-react'
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
} from 'react'

export type KanbanCardDisplay = 'full' | 'compact'

const kanbanCardSurfaceVariants = cva(null, {
  defaultVariants: { density: 'md' },
  variants: {
    density: {
      md: '[--card-padding:--spacing(6)] [--card-section-gap:--spacing(4)]',
      sm: '[--card-padding:--spacing(4)] [--card-section-gap:--spacing(2)]',
    },
  },
})

export const kanbanCardVariants = cva(
  'relative isolate min-w-0 w-full overflow-hidden transition-colors hover:bg-card/60 has-focus-visible:ring-2 has-focus-visible:ring-primary has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background [&_[data-kanban-card-action]]:relative [&_[data-kanban-card-action]]:z-10',
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
  'min-h-9 px-3 py-2 text-xs in-[[data-slot=card]:has(>[data-slot=card-panel])]:pt-3',
)

export interface KanbanCardMenuItem {
  label: string
  onSelect?: () => void
}

export interface KanbanCardMenu {
  items: readonly KanbanCardMenuItem[]
  label: string
}

export interface KanbanCardField {
  content: ReactNode
  icon: ReactNode
  id: string
  interactive?: boolean
  label: string
}

export interface KanbanCardCount extends KanbanCardMenu {
  count: number
  icon: ReactNode
  id: string
}

export interface KanbanCardProps
  extends Omit<useRender.ComponentProps<'article'>, 'title'> {
  assignee?: ReactNode
  counts?: readonly KanbanCardCount[]
  density?: VariantProps<typeof kanbanCardSurfaceVariants>['density']
  description?: ReactNode
  dimmed?: boolean
  display?: KanbanCardDisplay
  fields?: readonly KanbanCardField[]
  menu?: KanbanCardMenu
  onOpen?: () => void
  openLabel?: string
  selected?: boolean
  title?: ReactNode
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
  assignee,
  children,
  className,
  counts,
  density = 'sm',
  description,
  dimmed = false,
  display = 'full',
  fields,
  menu,
  onOpen,
  openLabel,
  ref,
  render,
  selected = false,
  title,
  variant = 'default',
  ...props
}: KanbanCardProps): ReactElement {
  const card = (
    <Card
      className={cn(
        kanbanCardSurfaceVariants({ density }),
        kanbanCardVariants({ dimmed, selected, variant }),
        className,
      )}
      data-density={density}
      data-display={display}
      data-pattern="kanban-card"
      data-state={selected ? 'selected' : undefined}
      data-variant={variant}
      render={render ?? <article />}
      ref={ref as ComponentProps<typeof Card>['ref']}
      {...props}
    >
      {onOpen && (
        <KanbanCardOpenTrigger aria-label={openLabel} onClick={onOpen} />
      )}
      {title !== undefined && (
        <KanbanCardAnatomy
          assignee={assignee}
          counts={counts}
          description={description}
          display={display}
          fields={fields}
          menu={menu}
          title={title}
        />
      )}
      {children}
    </Card>
  )

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

function KanbanCardMenuButton({ items, label }: KanbanCardMenu): ReactElement {
  return (
    <Menu>
      <MenuTrigger
        render={<KanbanCardActionButton aria-label={label} size="icon" />}
      >
        <EllipsisIcon aria-hidden className="size-4" />
      </MenuTrigger>
      <MenuPopup align="end">
        {items.map((item) => (
          <MenuItem key={item.label} onClick={item.onSelect}>
            {item.label}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}

function KanbanCardCountButton({
  count,
  icon,
  items,
  label,
}: KanbanCardCount): ReactElement {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            aria-label={label}
            data-kanban-card-action=""
            size="xs"
            variant="secondary"
          />
        }
      >
        {icon}
        <span>{count}</span>
      </MenuTrigger>
      <MenuPopup align="start">
        {items.map((item) => (
          <MenuItem key={item.label} onClick={item.onSelect}>
            {item.label}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}

function KanbanCardAnatomy({
  assignee,
  counts = [],
  description,
  display,
  fields = [],
  menu,
  title,
}: Readonly<
  Pick<
    KanbanCardProps,
    'assignee' | 'counts' | 'description' | 'fields' | 'menu' | 'title'
  > & { display: KanbanCardDisplay }
>): ReactElement {
  return (
    <>
      <KanbanCardHeader>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <KanbanCardTitle className="min-w-0 flex-1 truncate">
            {title}
          </KanbanCardTitle>
          {display === 'compact' && assignee && (
            <span className="flex shrink-0" data-kanban-card-action="">
              {assignee}
            </span>
          )}
        </div>
        {description && (
          <KanbanCardDescription>{description}</KanbanCardDescription>
        )}
        {menu && (
          <KanbanCardAction>
            <KanbanCardMenuButton {...menu} />
          </KanbanCardAction>
        )}
      </KanbanCardHeader>

      {fields.length > 0 && (
        <KanbanCardBody className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 text-sm">
          {fields.map((field) => (
            <KanbanCardBodyRow
              className="col-span-2 grid grid-cols-subgrid"
              key={field.id}
            >
              <Text
                className="flex min-w-0 items-center gap-2 [&>svg]:size-3.5 [&>svg]:shrink-0"
                foreground="muted"
                size="sm"
              >
                {field.icon}
                <span className="truncate">{field.label}</span>
              </Text>
              <div
                className="flex min-w-0 flex-1 items-center tabular-nums"
                data-kanban-card-action={field.interactive ? '' : undefined}
              >
                {field.content}
              </div>
            </KanbanCardBodyRow>
          ))}
        </KanbanCardBody>
      )}

      {(counts.length > 0 || assignee) && (
        <KanbanCardFooter className="gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {counts.map((count) => (
              <KanbanCardCountButton key={count.id} {...count} />
            ))}
          </div>
          {assignee && (
            <span className="ml-auto flex shrink-0" data-kanban-card-action="">
              {assignee}
            </span>
          )}
        </KanbanCardFooter>
      )}
    </>
  )
}
