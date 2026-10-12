'use client'

import { Empty, EmptyDescription } from '@tc96/ui/empty'
import type { ReactNode } from 'react'
import { skeletonKeys } from '../../../shared/lib/skeleton-keys'
import type { CollectionDefinition } from '../../../types/collection'
import { GalleryItemSkeleton } from './gallery-item-skeleton'
import { GalleryViewItem } from './gallery-view-item'

export interface GalleryViewProps<TItem> {
  collection: CollectionDefinition<TItem>
  emptyMessage?: ReactNode
  loading?: boolean
  loadingItemCount?: number
  loadingItemLabel?: string
  renderItem: (item: TItem) => ReactNode
}

export function GalleryView<TItem>({
  collection,
  emptyMessage = 'No items to show.',
  loading = false,
  loadingItemCount = 4,
  loadingItemLabel,
  renderItem,
}: GalleryViewProps<TItem>) {
  return (
    <div
      aria-busy={loading ? 'true' : undefined}
      className="grid min-w-0 grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      data-slot="gallery-view"
    >
      {loading ? (
        skeletonKeys('gallery-loading', loadingItemCount).map((skeletonKey) => (
          <GalleryItemSkeleton
            key={skeletonKey}
            {...(loadingItemLabel ? { label: loadingItemLabel } : {})}
          />
        ))
      ) : collection.items.length ? (
        collection.items.map((item) => (
          <GalleryViewItem
            item={item}
            key={collection.getKey(item)}
            renderItem={renderItem}
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
