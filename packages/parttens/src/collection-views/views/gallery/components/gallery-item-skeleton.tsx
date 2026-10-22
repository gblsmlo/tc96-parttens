import { Card, CardFooter, CardHeader } from '@tc96/ui/card'
import { Separator } from '@tc96/ui/separator'
import { Skeleton } from '@tc96/ui/skeleton'
import type { ReactElement } from 'react'

export interface GalleryItemSkeletonProps {
  label?: string
}

export function GalleryItemSkeleton({
  label = 'Loading item',
}: GalleryItemSkeletonProps): ReactElement {
  return (
    <output aria-busy="true" aria-label={label} className="contents">
      <Card
        aria-hidden="true"
        className="min-h-52 pointer-events-none select-none"
        render={<article />}
      >
        <CardHeader>
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4.5 w-1/2" />
          <Skeleton className="h-3.5 w-4/5" />
        </CardHeader>
        <Separator className="mt-auto" />
        <CardFooter className="justify-between gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="size-4 rounded-full" />
        </CardFooter>
      </Card>
    </output>
  )
}
