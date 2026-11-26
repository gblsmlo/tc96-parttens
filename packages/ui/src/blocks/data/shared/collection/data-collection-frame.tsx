import {
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameHeader,
} from '@tc96/ui/patterns/collection/composition/collection-frame'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactNode } from 'react'

export interface DataCollectionFrameProps
  extends Omit<ComponentProps<'div'>, 'title'> {
  notice?: ReactNode
  subheader?: ReactNode
  title: string
  toolbar: ReactNode
}

export function DataCollectionFrame({
  children,
  className,
  notice,
  subheader,
  title,
  toolbar,
  ...props
}: Readonly<DataCollectionFrameProps>) {
  return (
    <CollectionFrame
      aria-label={title}
      className={cn('h-full gap-4', className)}
      role="region"
      {...props}
    >
      <CollectionFrameHeader className="gap-4">
        {notice}
        {toolbar}
        {subheader}
      </CollectionFrameHeader>
      <CollectionFrameBody>{children}</CollectionFrameBody>
    </CollectionFrame>
  )
}
