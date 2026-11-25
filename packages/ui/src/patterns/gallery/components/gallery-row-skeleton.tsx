import { Card, CardFooter, CardHeader } from '@tc96/ui/card'
import { Separator } from '@tc96/ui/separator'
import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import { skeletonKeys } from '../../collection/shared/lib/skeleton-keys'

import type { CollectionDensity } from '../../collection/types/collection'

export type { CollectionDensity }

export interface GalleryRowSkeletonAnatomy {
  action?: boolean
  density?: CollectionDensity
  descriptionLines?: number
  eyebrow?: boolean
  footer?: boolean
  titleLines?: 1 | 2
}

export interface GalleryRowSkeletonProps extends GalleryRowSkeletonAnatomy {
  label?: string
}

const titleWidths = ['w-1/2', 'w-1/3'] as const
const descriptionWidths = ['w-full', 'w-11/12', 'w-4/5', 'w-2/3'] as const

export function GalleryRowSkeleton({
  action = false,
  density = 'compact',
  descriptionLines = 1,
  eyebrow = true,
  footer = true,
  label = 'Loading item',
  titleLines = 1,
}: GalleryRowSkeletonProps): ReactElement {
  return (
    <output
      aria-busy="true"
      aria-label={label}
      className="contents"
      data-density={density}
      data-description-lines={descriptionLines}
    >
      <Card
        aria-hidden="true"
        className="min-h-52 pointer-events-none select-none"
        render={<article />}
      >
        <CardHeader className={density === 'compact' ? 'p-4' : undefined}>
          {eyebrow || action ? (
            <div className="flex items-center justify-between gap-2">
              <Skeleton
                className={cn('my-0.5 h-3 w-1/3', !eyebrow && 'invisible')}
              />
              {action ? (
                <Skeleton className="size-7 rounded-md sm:size-6" />
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-col">
            {skeletonKeys('title', titleLines).map((key, position) => (
              <Skeleton
                className={cn(
                  'my-px h-4',
                  titleWidths[position % titleWidths.length],
                )}
                key={key}
              />
            ))}
          </div>
          {descriptionLines > 0 ? (
            <div className="flex flex-col">
              {skeletonKeys('description', descriptionLines).map(
                (key, position) => (
                  <Skeleton
                    className={cn(
                      'my-0.75 h-3.5',
                      descriptionWidths[position % descriptionWidths.length],
                    )}
                    key={key}
                  />
                ),
              )}
            </div>
          ) : null}
        </CardHeader>
        {footer ? (
          <>
            <Separator className="mt-auto" />
            <CardFooter
              className={cn(
                'justify-between gap-3',
                density === 'compact' && 'px-4 py-3',
              )}
            >
              <Skeleton className="my-1 h-3 w-28" />
              <Skeleton className="size-6 rounded-full" />
            </CardFooter>
          </>
        ) : null}
      </Card>
    </output>
  )
}
