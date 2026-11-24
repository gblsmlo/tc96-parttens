import type { ReactNode } from 'react'
import type { RecordsStatusRow } from '../shared/types'

export type BulkImport1Step = 'select' | 'link'

export interface BulkImportRow {
  cells: readonly ReactNode[]
  disabledReason?: string
  id: string
  label: string
}

export interface BulkImport1Labels {
  ancestor: string
  back: string
  cancel: string
  continue: string
  import: (count: number) => string
  importing: string
  importingHint: string
  noneSelected: string
  progress: string
  searchAgain: string
  searching: string
  select: (label: string) => string
  selectColumn: string
  selectedCount: (count: number, max: number) => string
  status: string
  title: string
}

export interface BulkImport1Props {
  children?: ReactNode
  columns: readonly string[]
  importing?: boolean
  labels?: Partial<BulkImport1Labels>
  maxSelected?: number
  onImport: () => boolean | Promise<boolean>
  onOpenChange: (open: boolean) => void
  onSearchAgain?: () => void
  onSelectedChange: (selected: readonly string[]) => void
  onStepChange: (step: BulkImport1Step) => void
  open: boolean
  progress?: readonly RecordsStatusRow[]
  query: ReactNode
  rows: readonly BulkImportRow[]
  searchedAt?: ReactNode
  searching?: boolean
  selected: readonly string[]
  step: BulkImport1Step
}
