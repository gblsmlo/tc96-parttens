'use client'

import { Empty, EmptyDescription } from '@tc96/ui/empty'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { skeletonKeys } from '../../collection/shared/lib/skeleton-keys'
import type { CollectionDefinition } from '../../collection/types/collection'
import {
  GalleryRowSkeleton,
  type GalleryRowSkeletonAnatomy,
} from './gallery-row-skeleton'
import { GalleryViewItem } from './gallery-view-item'

export type GalleryPageSize = 3 | 6 | 9 | 12

const pageRowsClassName = {
  3: 'grid-rows-[repeat(3,minmax(13rem,auto))] sm:grid-rows-[repeat(2,minmax(13rem,auto))] lg:grid-rows-[repeat(1,minmax(13rem,auto))]',
  6: 'grid-rows-[repeat(6,minmax(13rem,auto))] sm:grid-rows-[repeat(3,minmax(13rem,auto))] lg:grid-rows-[repeat(2,minmax(13rem,auto))]',
  9: 'grid-rows-[repeat(9,minmax(13rem,auto))] sm:grid-rows-[repeat(5,minmax(13rem,auto))] lg:grid-rows-[repeat(3,minmax(13rem,auto))]',
  12: 'grid-rows-[repeat(12,minmax(13rem,auto))] sm:grid-rows-[repeat(6,minmax(13rem,auto))] lg:grid-rows-[repeat(4,minmax(13rem,auto))]',
} as const satisfies Record<GalleryPageSize, string>

export interface GalleryViewProps<TRecord> {
  collection: CollectionDefinition<TRecord>
  emptyMessage?: ReactNode
  loading?: boolean
  loadingRecordAnatomy?: GalleryRowSkeletonAnatomy
  loadingRecordCount?: number
  loadingRecordLabel?: string
  pageSize?: GalleryPageSize
  renderRecord: (record: TRecord) => ReactNode
}

export function GalleryView<TRecord>({
  collection,
  emptyMessage = 'No items to show.',
  loading = false,
  loadingRecordAnatomy,
  loadingRecordCount = 4,
  loadingRecordLabel,
  pageSize,
  renderRecord,
}: GalleryViewProps<TRecord>) {
  return (
    <div
      aria-busy={loading ? 'true' : undefined}
      className={cn(
        'grid min-w-0 grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3',
        pageSize && (loading || collection.records.length > 0)
          ? pageRowsClassName[pageSize]
          : undefined,
      )}
      data-page-size={pageSize}
      data-slot="gallery-view"
    >
      {loading ? (
        skeletonKeys('gallery-loading', pageSize ?? loadingRecordCount).map(
          (skeletonKey) => (
            <GalleryRowSkeleton
              key={skeletonKey}
              {...loadingRecordAnatomy}
              {...(loadingRecordLabel ? { label: loadingRecordLabel } : {})}
            />
          ),
        )
      ) : collection.records.length ? (
        collection.records.map((record) => (
          <GalleryViewItem
            record={record}
            key={collection.getKey(record)}
            renderRecord={renderRecord}
          />
        ))
      ) : (
        <Empty className="col-span-full">
          <EmptyDescription>{emptyMessage}</EmptyDescription>
        </Empty>
      )}
    </div>
  )
}
