'use client'

import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'

export type CollectionToolbarHeadingProps = ComponentProps<'div'>

export interface CollectionToolbarTitleProps {
  children: ReactNode
  className?: string
}

export interface CollectionToolbarDescriptionProps {
  children?: ReactNode
  className?: string
}

export function CollectionToolbarHeading({
  className,
  ...props
}: Readonly<CollectionToolbarHeadingProps>): ReactElement {
  return (
    <div
      className={cn('min-w-0', className)}
      data-slot="collection-toolbar-heading"
      {...props}
    />
  )
}

export function CollectionToolbarTitle({
  children,
  className,
}: Readonly<CollectionToolbarTitleProps>): ReactElement {
  return (
    <Text
      className={cn('truncate leading-tight', className)}
      data-slot="collection-toolbar-title"
      family="heading"
      render={(props) => <h2 {...props} />}
      size="base"
      weight="semibold"
    >
      {children}
    </Text>
  )
}

export function CollectionToolbarDescription({
  children,
  className,
}: Readonly<CollectionToolbarDescriptionProps>): ReactElement | null {
  if (children == null || children === '') return null

  return (
    <Text
      className={cn('truncate leading-tight', className)}
      data-slot="collection-toolbar-description"
      foreground="muted"
      render={(props) => <p {...props} />}
      size="sm"
    >
      {children}
    </Text>
  )
}
