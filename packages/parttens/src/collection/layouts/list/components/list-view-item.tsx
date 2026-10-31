import { memo, type ReactNode } from 'react'

interface ListViewItemProps<TRecord> {
  record: TRecord
  renderRecord: (record: TRecord) => ReactNode
}

export const ListViewItem = memo(function ListViewItem<TRecord>({
  record,
  renderRecord,
}: ListViewItemProps<TRecord>) {
  return renderRecord(record)
}) as <TRecord>(props: ListViewItemProps<TRecord>) => ReactNode
