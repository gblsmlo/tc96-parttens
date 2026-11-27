import type { PropertyIcon } from '@tc96/ui/patterns/properties/core'
import type { ReactNode } from 'react'

export type RecordProperties1DefaultKey =
  | 'createdAt'
  | 'dueDate'
  | 'owner'
  | 'priority'
  | 'status'
  | 'tags'
  | 'type'

export interface RecordProperties1CatalogEntry {
  icon?: PropertyIcon
  label: string
}

export type RecordProperties1Catalog<TKey extends string = string> = Readonly<
  Record<TKey, RecordProperties1CatalogEntry>
>

export type RecordProperties1CatalogLabels = Record<
  RecordProperties1DefaultKey,
  string
>

interface RecordProperties1ItemBase {
  icon?: PropertyIcon | null
  id: string
  pending?: boolean
  render: () => ReactNode
}

export interface RecordProperties1Labels {
  loadingValue: (label: string) => string
}

export interface RecordProperties1CatalogItem<TKey extends string>
  extends RecordProperties1ItemBase {
  catalogKey: TKey
  label?: string
}

export interface RecordProperties1CustomItem extends RecordProperties1ItemBase {
  catalogKey?: undefined
  label: string
}

export type RecordProperties1Item<
  TKey extends string = RecordProperties1DefaultKey,
> = RecordProperties1CatalogItem<TKey> | RecordProperties1CustomItem

export interface RecordProperties1Props<
  TKey extends string = RecordProperties1DefaultKey,
> {
  ariaLabel?: string
  catalog?: RecordProperties1Catalog<TKey>
  className?: string
  items: readonly RecordProperties1Item<TKey>[]
  labels?: Partial<RecordProperties1Labels>
  showLabelIcons?: boolean
}
