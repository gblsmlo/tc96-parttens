import type {
  CollectionDefinition,
  GalleryPageSize,
  GalleryRowSkeletonAnatomy,
} from '@tc96/parttens'

export interface SampleRecord {
  id: string
  title: string
}

export const sampleRecords: readonly SampleRecord[] = Array.from(
  { length: 6 },
  (_, position) => ({
    id: `registro-${position + 1}`,
    title: `Registro ${position + 1}`,
  }),
)

export const sampleCollection = (
  records: readonly SampleRecord[],
): CollectionDefinition<SampleRecord> => ({
  getKey: (record) => record.id,
  getLabel: (record) => record.title,
  groupings: [],
  records,
})

export const documentCardAnatomy: GalleryRowSkeletonAnatomy = {
  action: true,
  density: 'compact',
  descriptionLines: 3,
}

export const galleryPageSizes: GalleryPageSize[] = [3, 6, 9, 12]

export const LOAD_DELAY = 2000
