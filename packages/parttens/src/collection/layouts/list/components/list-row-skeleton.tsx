import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import { skeletonKeys } from '../../../shared/lib/skeleton-keys'
import {
  ListRow,
  ListRowBody,
  ListRowLeading,
  ListRowTrailing,
} from './list-row'

export type ListRowSkeletonMedia = 'avatar' | 'icon' | 'none'

export interface ListRowSkeletonAnatomy {
  action?: boolean
  lines?: 1 | 2
  media?: ListRowSkeletonMedia
  pills?: number
}

export interface ListRowSkeletonProps extends ListRowSkeletonAnatomy {
  label?: string
}

const mediaClassName = {
  avatar: 'size-8 rounded-full',
  icon: 'size-9 rounded-lg',
} as const

const pillWidths = ['w-20', 'w-16', 'w-24'] as const

export function ListRowSkeleton({
  action = true,
  label = 'Loading item',
  lines = 2,
  media = 'icon',
  pills = 3,
}: ListRowSkeletonProps): ReactElement {
  // `article` não pode ser `status`: um `output`, que já é status, envolve
  // o item sem caixa própria, e o item fica oculto da tecnologia assistiva.
  return (
    <output
      aria-busy="true"
      aria-label={label}
      className="contents"
      data-lines={lines}
      data-media={media}
      data-pills={pills}
    >
      <ListRow aria-hidden="true">
        {media === 'none' ? null : (
          <ListRowLeading aria-hidden="true">
            <Skeleton className={mediaClassName[media]} />
          </ListRowLeading>
        )}
        <ListRowBody aria-hidden="true">
          <Skeleton className="my-0.5 h-4 w-1/3" />
          {lines === 2 ? <Skeleton className="my-1 h-3 w-1/2" /> : null}
        </ListRowBody>
        {pills > 0 || action ? (
          <ListRowTrailing aria-hidden="true">
            {pills > 0 ? (
              <div className="hidden items-center gap-2 md:flex">
                {skeletonKeys('pill', pills).map((key, position) => (
                  <Skeleton
                    className={cn(
                      'h-6 rounded-full',
                      pillWidths[position % pillWidths.length],
                    )}
                    key={key}
                  />
                ))}
              </div>
            ) : null}
            {action ? <Skeleton className="size-7 rounded-md" /> : null}
          </ListRowTrailing>
        ) : null}
      </ListRow>
    </output>
  )
}
