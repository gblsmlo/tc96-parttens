import type { RecordStatus } from '@tc96/parttens/status-list/core'
import type { RenderLink } from '@tc96/ui/render-anchor'
import type { ReactNode } from 'react'

export type RecordsRenderLink = RenderLink

export interface RecordsStatusRow {
  action?: ReactNode
  announcement?: string
  detail?: ReactNode
  id: string
  status: RecordStatus
  title: ReactNode
}
