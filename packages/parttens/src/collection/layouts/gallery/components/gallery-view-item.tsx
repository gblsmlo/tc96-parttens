import { memo, type ReactNode } from 'react'

interface GalleryViewItemProps<TRecord> {
  record: TRecord
  renderRecord: (record: TRecord) => ReactNode
}

export const GalleryViewItem = memo(function GalleryViewItem<TRecord>({
  record,
  renderRecord,
}: GalleryViewItemProps<TRecord>) {
  return renderRecord(record)
}) as <TRecord>(props: GalleryViewItemProps<TRecord>) => ReactNode
