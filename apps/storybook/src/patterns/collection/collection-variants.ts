import type { CollectionFrameHeight, CollectionLayout } from '@tc96/ui/patterns'

export const collectionLayouts = [
  'datatable',
  'list',
  'datagrid',
  'gallery',
  'kanban',
  'calendar',
] as const satisfies readonly CollectionLayout[]

export const collectionFrameHeights = [
  'fill',
  'content',
] as const satisfies readonly CollectionFrameHeight[]
