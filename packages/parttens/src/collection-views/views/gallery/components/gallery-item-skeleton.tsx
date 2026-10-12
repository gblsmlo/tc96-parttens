import { CardSurface } from '@tc96/elements/card-surface'
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
      <CardSurface
        aria-hidden="true"
        className="min-h-52 pointer-events-none select-none"
        render={<article />}
      >
        <div className="flex flex-1 flex-col p-4">
          <Skeleton className="h-3 w-1/3" />
          <div className="mt-4 grid gap-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <div className="mt-auto flex items-center justify-between gap-4 pt-8">
            <div className="flex items-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardSurface>
    </output>
  )
}
