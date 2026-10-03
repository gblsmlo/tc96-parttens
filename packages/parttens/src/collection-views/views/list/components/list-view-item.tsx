import { memo, type ReactNode } from 'react'

interface ListViewItemProps<TItem> {
  item: TItem
  renderItem: (item: TItem) => ReactNode
}

export const ListViewItem = memo(function ListViewItem<TItem>({
  item,
  renderItem,
}: ListViewItemProps<TItem>) {
  return renderItem(item)
}) as <TItem>(props: ListViewItemProps<TItem>) => ReactNode
