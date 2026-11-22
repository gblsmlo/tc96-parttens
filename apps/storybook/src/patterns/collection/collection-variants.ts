import type { CollectionFrameMode, CollectionLayout } from '@tc96/parttens'

export const collectionLayouts = [
  'datatable',
  'list',
  'datagrid',
  'gallery',
  'kanban',
  'calendar',
] as const satisfies readonly CollectionLayout[]

export const collectionFrameModes = [
  'fill',
  'flow',
] as const satisfies readonly CollectionFrameMode[]
