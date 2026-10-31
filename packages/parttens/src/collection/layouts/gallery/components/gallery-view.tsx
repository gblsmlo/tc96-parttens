'use client'

import { Empty, EmptyDescription } from '@tc96/ui/empty'
import type { ReactNode } from 'react'
import { skeletonKeys } from '../../../shared/lib/skeleton-keys'
import type { CollectionDefinition } from '../../../types/collection'
import { GalleryItemSkeleton } from './gallery-item-skeleton'
import { GalleryViewItem } from './gallery-view-item'

export interface GalleryViewProps<TRecord> {
  collection: CollectionDefinition<TRecord>
  emptyMessage?: ReactNode
  loading?: boolean
  loadingRecordCount?: number
  loadingRecordLabel?: string
  renderRecord: (record: TRecord) => ReactNode
}

export function GalleryView<TRecord>({
  collection,
  emptyMessage = 'No items to show.',
  loading = false,
  loadingRecordCount = 4,
  loadingRecordLabel,
  renderRecord,
}: GalleryViewProps<TRecord>) {
  return (
    <div
      aria-busy={loading ? 'true' : undefined}
      className="grid min-w-0 grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      data-slot="gallery-view"
    >
      {loading ? (
        skeletonKeys('gallery-loading', loadingRecordCount).map(
          (skeletonKey) => (
            <GalleryItemSkeleton
              key={skeletonKey}
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
