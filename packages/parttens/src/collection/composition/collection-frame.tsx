'use client'

import { cn } from '@tc96/utils'
import {
  type ComponentProps,
  createContext,
  type ReactElement,
  useContext,
} from 'react'

export type CollectionFrameMode = 'fill' | 'flow'

const CollectionFrameModeContext = createContext<CollectionFrameMode>('fill')

export interface CollectionFrameProps extends ComponentProps<'div'> {
  mode?: CollectionFrameMode
}

export type CollectionFrameHeaderProps = ComponentProps<'div'>

export type CollectionFrameBodyProps = ComponentProps<'section'>

export type CollectionFrameFooterProps = ComponentProps<'div'>

export type CollectionFrameOverlayProps = ComponentProps<'div'>

export function CollectionFrame({
  className,
  mode = 'fill',
  ...props
}: Readonly<CollectionFrameProps>): ReactElement {
  return (
    <CollectionFrameModeContext.Provider value={mode}>
      <div
        className={cn(
          'flex min-w-0 flex-col gap-3',
          mode === 'fill' && 'min-h-0 flex-1',
          className,
        )}
        data-mode={mode}
        data-slot="collection-frame"
        {...props}
      />
    </CollectionFrameModeContext.Provider>
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
  const mode = useContext(CollectionFrameModeContext)

  return (
    <section
      className={cn(
        'flex min-w-0 flex-col gap-2',
        mode === 'fill' && 'min-h-0 flex-1 overflow-auto',
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
  const mode = useContext(CollectionFrameModeContext)

  return (
    <div
      className={cn(
        'relative flex min-w-0 shrink-0 flex-col gap-2',
        mode === 'flow' && 'sticky bottom-0 z-10 bg-background',
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
