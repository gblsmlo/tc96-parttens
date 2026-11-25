import type { PropertyOption } from '@tc96/ui/patterns/properties/core'

export type DataPropertyVariant = 'badge' | 'plain'

export interface DataOptionAppearance {
  icon: NonNullable<PropertyOption['icon']>
  tone: NonNullable<PropertyOption['tone']>
  weight?: PropertyOption['weight']
}

export interface DataPerson {
  id: string
  imageUrl?: string
  label: string
}
