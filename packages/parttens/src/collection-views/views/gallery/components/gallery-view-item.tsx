import { memo, type ReactNode } from 'react'

interface GalleryViewItemProps<TItem> {
  item: TItem
  renderItem: (item: TItem) => ReactNode
}

export const GalleryViewItem = memo(function GalleryViewItem<TItem>({
  item,
  renderItem,
}: GalleryViewItemProps<TItem>) {
  return renderItem(item)
}) as <TItem>(props: GalleryViewItemProps<TItem>) => ReactNode
