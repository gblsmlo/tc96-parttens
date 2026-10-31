import type { ReactNode } from 'react'

export type CollectionGroupingId = string
export type CollectionLayout =
  | 'calendar'
  | 'datagrid'
  | 'datatable'
  | 'gallery'
  | 'kanban'
  | 'list'

export interface CollectionOption {
  icon?: ReactNode
  id: string
  label: string
}

export interface CollectionGroupingDimension<TRecord = unknown> {
  getGroupId: (record: TRecord) => string | null
  id: CollectionGroupingId
  label: string
  options: readonly CollectionOption[]
  setGroupId?: (record: TRecord, groupId: string | null) => TRecord
  /** Label for items whose getGroupId returns null. Defaults to a generic "unassigned". */
  unassignedLabel?: string
}

export interface CollectionDefinition<TRecord = unknown> {
  getKey: (record: TRecord) => string | number
  getLabel: (record: TRecord) => string
  groupings: readonly CollectionGroupingDimension<TRecord>[]
  records: readonly TRecord[]
}

export interface CollectionPreferences {
  /** `null` é a coleção sem agrupamento, que a Lista e o DataGrid sabem renderizar. */
  groupBy: CollectionGroupingId | null
  layout: CollectionLayout
}

export interface CollectionRecordChange<TRecord = unknown> {
  grouping: CollectionGroupingId
  record: TRecord
  previousRecord: TRecord
  reason: 'grouping'
}

export type CollectionPreferencesChangeReason = 'grouping' | 'layout'

export interface CollectionPreferencesChangeDetails {
  reason: CollectionPreferencesChangeReason
}

export interface CollectionGroup<TRecord = unknown> extends CollectionOption {
  count: number
  grouping: CollectionGroupingId
  records: readonly TRecord[]
  value: string | null
}
