import type { SelectPropertyOption } from '@tc96/ui/patterns/properties/display/select/select-property'

export type DataPropertyVariant = 'badge' | 'plain'

export interface DataOptionAppearance {
  icon: NonNullable<SelectPropertyOption['icon']>
  tone: NonNullable<SelectPropertyOption['tone']>
}

export interface DataPerson {
  id: string
  imageUrl?: string
  label: string
}
