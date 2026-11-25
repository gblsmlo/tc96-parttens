import type { PropertyTone } from '@tc96/ui/lib/property-tone'
import type React from 'react'

export {
  type PropertyTone,
  propertyToneClassName,
} from '@tc96/ui/lib/property-tone'

export type PropertyIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

export interface PropertyPreset<TValue extends string> {
  icon: PropertyIcon
  label: string
  tone: PropertyTone
  value: TValue
}
