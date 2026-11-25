import type { IconWeight } from '@phosphor-icons/react'
import type { ComboboxPopup } from '@tc96/ui/combobox'
import type { PropertyTone } from '@tc96/ui/lib/property-tone'
import type { PopoverPopup } from '@tc96/ui/popover'
import type { SelectPopup } from '@tc96/ui/select'
import type { ComponentProps, ComponentType, SVGProps } from 'react'

export {
  type PropertyTone,
  propertyToneClassName,
} from '@tc96/ui/lib/property-tone'

export type PropertyIcon = ComponentType<
  SVGProps<SVGSVGElement> & { weight?: IconWeight }
>

export interface PropertyOption<TValue extends string = string> {
  value: TValue
  label: string
  icon?: PropertyIcon
  tone?: PropertyTone
  weight?: IconWeight
}

export interface PropertyChangeContext<TValue> {
  previousValue: TValue
}

export interface PropertyListChangeContext<TItem, TValue> {
  added: TItem | null
  previousValue: readonly TValue[]
  removed: TItem | null
}

export type PropertySelectDropdownPlacement = Pick<
  ComponentProps<typeof SelectPopup>,
  'align' | 'alignItemWithTrigger' | 'alignOffset' | 'side' | 'sideOffset'
>

export type PropertyMultiSelectDropdownPlacement = Pick<
  ComponentProps<typeof ComboboxPopup>,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
>

export type PropertyPopoverDropdownPlacement = Pick<
  ComponentProps<typeof PopoverPopup>,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
>
