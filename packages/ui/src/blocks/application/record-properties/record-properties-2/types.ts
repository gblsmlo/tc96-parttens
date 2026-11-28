import type { ReactNode } from 'react'

export type RecordProperties2DefaultKey =
  | 'createdAt'
  | 'dueDate'
  | 'owner'
  | 'priority'
  | 'status'
  | 'tags'
  | 'type'

export interface RecordProperties2CatalogEntry {
  label: string
}

export type RecordProperties2Catalog<TKey extends string = string> = Readonly<
  Record<TKey, RecordProperties2CatalogEntry>
>

export type RecordProperties2CatalogLabels = Record<
  RecordProperties2DefaultKey,
  string
>

interface RecordProperties2ItemBase {
  id: string
  pending?: boolean
  render: () => ReactNode
}

export interface RecordProperties2Labels {
  loadingValue: (label: string) => string
}

export interface RecordProperties2CatalogItem<TKey extends string>
  extends RecordProperties2ItemBase {
  catalogKey: TKey
  label?: string
}

export interface RecordProperties2CustomItem extends RecordProperties2ItemBase {
  catalogKey?: undefined
  label: string
}

export type RecordProperties2Item<
  TKey extends string = RecordProperties2DefaultKey,
> = RecordProperties2CatalogItem<TKey> | RecordProperties2CustomItem

export interface RecordProperties2Props<
  TKey extends string = RecordProperties2DefaultKey,
> {
  ariaLabel?: string
  catalog?: RecordProperties2Catalog<TKey>
  className?: string
  items: readonly RecordProperties2Item<TKey>[]
  labels?: Partial<RecordProperties2Labels>
}
