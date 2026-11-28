import type { PropertyIcon } from '@tc96/ui/patterns/properties/core'
import type { ReactNode } from 'react'

export type RecordProperties3DefaultKey =
  | 'createdAt'
  | 'dueDate'
  | 'owner'
  | 'priority'
  | 'status'
  | 'tags'
  | 'type'

export interface RecordProperties3CatalogEntry {
  icon?: PropertyIcon
  label: string
}

export type RecordProperties3Catalog<TKey extends string = string> = Readonly<
  Record<TKey, RecordProperties3CatalogEntry>
>

export type RecordProperties3CatalogLabels = Record<
  RecordProperties3DefaultKey,
  string
>

interface RecordProperties3ItemBase {
  icon?: PropertyIcon | null
  id: string
  pending?: boolean
  render: () => ReactNode
}

export interface RecordProperties3Labels {
  loadingValue: (label: string) => string
}

export interface RecordProperties3CatalogItem<TKey extends string>
  extends RecordProperties3ItemBase {
  catalogKey: TKey
  label?: string
}

export interface RecordProperties3CustomItem extends RecordProperties3ItemBase {
  catalogKey?: undefined
  label: string
}

export type RecordProperties3Item<
  TKey extends string = RecordProperties3DefaultKey,
> = RecordProperties3CatalogItem<TKey> | RecordProperties3CustomItem

export interface RecordProperties3Props<
  TKey extends string = RecordProperties3DefaultKey,
> {
  ariaLabel?: string
  catalog?: RecordProperties3Catalog<TKey>
  className?: string
  items: readonly RecordProperties3Item<TKey>[]
  labels?: Partial<RecordProperties3Labels>
}
