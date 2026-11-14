import { cn } from '@tc96/utils'
import {
  type ComponentPropsWithoutRef,
  createContext,
  type MouseEvent,
  type ReactElement,
  useContext,
} from 'react'
import {
  interactiveControls,
  interactiveDescendants,
} from '../../../shared/lib/interactive-descendants'

export const ListRowHeadingLevelContext = createContext<2 | 3>(3)

export type ListRowDensity = 'comfortable' | 'compact'

export interface ListRowProps extends ComponentPropsWithoutRef<'article'> {
  density?: ListRowDensity
  interactive?: boolean
}
export type ListRowActionProps = ComponentPropsWithoutRef<'div'>
export type ListRowBodyProps = ComponentPropsWithoutRef<'div'>
export type ListRowContentProps = ComponentPropsWithoutRef<'div'>
export type ListRowDescriptionProps = ComponentPropsWithoutRef<'span'>
export interface ListRowFieldProps extends ComponentPropsWithoutRef<'div'> {
  always?: boolean
}
export type ListRowFooterProps = ComponentPropsWithoutRef<'footer'>
export type ListRowHeaderProps = ComponentPropsWithoutRef<'header'>
export type ListRowLeadingProps = ComponentPropsWithoutRef<'div'>
export type ListRowTitleProps = ComponentPropsWithoutRef<'h3'>
export type ListRowTitleTriggerProps = ComponentPropsWithoutRef<'button'>
export type ListRowTrailingProps = ComponentPropsWithoutRef<'div'>

function openFromPlainArea(event: MouseEvent<HTMLDivElement>) {
  const area = event.currentTarget
  const target = event.target

  if (
    event.defaultPrevented ||
    !(target instanceof Element) ||
    !area.contains(target)
  ) {
    return
  }

  const control = target.closest(interactiveControls)

  if (control && area.contains(control)) return

  area
    .closest('[data-slot="list-row"]')
    ?.querySelector<HTMLButtonElement>('[data-slot="list-row-title-trigger"]')
    ?.click()
}

function PlainArea({
  className,
  onClick,
  ...props
}: ComponentPropsWithoutRef<'div'>): ReactElement {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: a mouse-only mirror of the stretched title trigger, which is the keyboard path
    <div
      className={cn(
        'pointer-events-none relative z-10',
        interactiveDescendants,
        className,
      )}
      onClick={onClick ?? openFromPlainArea}
      {...props}
    />
  )
}

export function ListRow({
  className,
  density = 'comfortable',
  interactive = true,
  ...props
}: ListRowProps): ReactElement {
  return (
    <article
      className={cn(
        'relative flex min-h-9 min-w-0 items-center gap-3 overflow-hidden rounded-lg px-2',
        density === 'compact' ? 'py-1' : 'py-1.5',
        interactive && 'hover:bg-muted/50',
        className,
      )}
      data-density={density}
      data-interactive={interactive ? '' : undefined}
      data-slot="list-row"
      {...props}
    />
  )
}

export function ListRowHeader({
  className,
  ...props
}: ListRowHeaderProps): ReactElement {
  return (
    <header
      className={cn('flex min-w-0 flex-1 items-center gap-2', className)}
      data-slot="list-row-header"
      {...props}
    />
  )
}

export function ListRowLeading({
  className,
  ...props
}: ListRowLeadingProps): ReactElement {
  return (
    <PlainArea
      className={cn('flex shrink-0 items-center gap-1', className)}
      data-slot="list-row-leading"
      {...props}
    />
  )
}

export function ListRowBody({
  className,
  ...props
}: ListRowBodyProps): ReactElement {
  return (
    <div
      className={cn('flex min-w-0 flex-1 flex-col', className)}
      data-slot="list-row-body"
      {...props}
    />
  )
}

export function ListRowTitle({
  className,
  ...props
}: ListRowTitleProps): ReactElement {
  const Heading = useContext(ListRowHeadingLevelContext) === 2 ? 'h2' : 'h3'

  return (
    <Heading
      className={cn('min-w-0 truncate font-medium text-sm', className)}
      data-slot="list-row-title"
      {...props}
    />
  )
}

export function ListRowTitleTrigger({
  className,
  ...props
}: ListRowTitleTriggerProps): ReactElement {
  return (
    <button
      className={cn(
        'min-w-0 truncate text-start outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:ring-2 focus-visible:after:ring-ring',
        className,
      )}
      data-slot="list-row-title-trigger"
      type="button"
      {...props}
    />
  )
}

export function ListRowDescription({
  className,
  ...props
}: ListRowDescriptionProps): ReactElement {
  return (
    <span
      className={cn(
        'min-w-0 truncate text-muted-foreground text-sm',
        className,
      )}
      data-slot="list-row-description"
      {...props}
    />
  )
}

export function ListRowContent({
  className,
  ...props
}: ListRowContentProps): ReactElement {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 items-center gap-1 truncate text-muted-foreground text-sm',
        className,
      )}
      data-slot="list-row-content"
      {...props}
    />
  )
}

export function ListRowFooter({
  className,
  ...props
}: ListRowFooterProps): ReactElement {
  return (
    <footer
      className={cn(
        'ms-auto flex shrink-0 items-center gap-2 text-muted-foreground text-sm tabular-nums',
        className,
      )}
      data-slot="list-row-footer"
      {...props}
    />
  )
}

export function ListRowTrailing({
  className,
  ...props
}: ListRowTrailingProps): ReactElement {
  return (
    <div
      className={cn('ms-auto flex shrink-0 items-center gap-2', className)}
      data-slot="list-row-trailing"
      {...props}
    />
  )
}

export function ListRowField({
  always = false,
  className,
  ...props
}: ListRowFieldProps): ReactElement {
  return (
    <PlainArea
      className={cn(
        'shrink-0 items-center',
        always ? 'flex' : 'hidden lg:flex',
        className,
      )}
      data-slot="list-row-field"
      {...props}
    />
  )
}

export function ListRowAction({
  className,
  ...props
}: ListRowActionProps): ReactElement {
  return (
    <div
      className={cn('relative z-10 flex shrink-0 items-center', className)}
      data-slot="list-row-action"
      {...props}
    />
  )
}
