import { RecordStatusItem } from '@tc96/parttens/status-list/composition/record-status-item/record-status-item'
import { RecordStatusList } from '@tc96/parttens/status-list/composition/record-status-list/record-status-list'
import type { ReactElement } from 'react'
import type { RecordsStatusRow } from './types'

export function StatusRows({
  label,
  rows,
}: Readonly<{
  label: string
  rows: readonly RecordsStatusRow[]
}>): ReactElement {
  return (
    <RecordStatusList label={label}>
      {rows.map((row) => (
        <RecordStatusItem
          action={row.action}
          announcement={row.announcement}
          detail={row.detail}
          key={row.id}
          status={row.status}
          title={row.title}
        />
      ))}
    </RecordStatusList>
  )
}
