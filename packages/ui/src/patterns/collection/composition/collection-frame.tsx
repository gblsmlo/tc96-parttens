'use client'

import { cn } from '@tc96/utils'
import {
  type ComponentProps,
  createContext,
  type ReactElement,
  useContext,
} from 'react'

export type CollectionFrameHeight = 'fill' | 'content'

const CollectionFrameHeightContext =
  createContext<CollectionFrameHeight>('fill')

export interface CollectionFrameProps extends ComponentProps<'div'> {
  height?: CollectionFrameHeight
}

export type CollectionFrameHeaderProps = ComponentProps<'div'>

export type CollectionFrameBodyProps = ComponentProps<'section'>

export type CollectionFrameFooterProps = ComponentProps<'div'>

export type CollectionFrameOverlayProps = ComponentProps<'div'>

export function CollectionFrame({
  className,
  height = 'content',
  ...props
}: Readonly<CollectionFrameProps>): ReactElement {
  return (
    <CollectionFrameHeightContext.Provider value={height}>
      <div
        className={cn('flex min-h-0 min-w-0 flex-1 flex-col gap-3', className)}
        data-height={height}
        data-slot="collection-frame"
        {...props}
      />
    </CollectionFrameHeightContext.Provider>
  )
}

export function CollectionFrameHeader({
  className,
  ...props
}: Readonly<CollectionFrameHeaderProps>): ReactElement {
  return (
    <div
      className={cn('flex min-w-0 shrink-0 flex-col gap-2', className)}
      data-slot="collection-frame-header"
      {...props}
    />
  )
}

export function CollectionFrameBody({
  className,
  ...props
}: Readonly<CollectionFrameBodyProps>): ReactElement {
  const height = useContext(CollectionFrameHeightContext)

  return (
    <section
      className={cn(
        'flex min-h-0 min-w-0 flex-col gap-2 overflow-auto',
        height === 'fill' && 'flex-1',
        className,
      )}
      data-slot="collection-frame-body"
      {...props}
    />
  )
}

export function CollectionFrameFooter({
  className,
  ...props
}: Readonly<CollectionFrameFooterProps>): ReactElement {
  const height = useContext(CollectionFrameHeightContext)

  return (
    <div
      className={cn(
        'relative flex min-w-0 shrink-0 flex-col gap-2',
        height === 'content' && 'sticky bottom-0 z-10 bg-background',
        className,
      )}
      data-slot="collection-frame-footer"
      {...props}
    />
  )
}

export function CollectionFrameOverlay({
  children,
  className,
  ...props
}: Readonly<CollectionFrameOverlayProps>): ReactElement {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-full z-20 mb-3 flex justify-center px-3',
        className,
      )}
      data-slot="collection-frame-overlay"
      {...props}
    >
      <div className="pointer-events-auto max-w-full">{children}</div>
    </div>
  )
}
