'use client'

import {
  PersonProperty,
  PersonPropertyBadge,
  type PersonPropertyOption,
} from '../../display/person/index'
import type {
  PropertyChangeContext,
  PropertySelectDropdownPlacement,
} from '../../shared/property-catalog'
import {
  defaultPropertyAriaLabels,
  defaultPropertyPlaceholders,
} from '../../shared/property-labels'
import type { PropertyVariant } from '../../shared/property-surface'

export interface AssignedPropertyActionContext<TValue extends string = string>
  extends PropertyChangeContext<TValue | null> {
  option: PersonPropertyOption<TValue>
}

export interface AssignedPropertyProps<TValue extends string = string> {
  value: TValue | null
  options: readonly PersonPropertyOption<TValue>[]
  action?: (
    value: TValue,
    context: AssignedPropertyActionContext<TValue>,
  ) => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
  dropdownPlacement?: PropertySelectDropdownPlacement
  placeholder?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: TValue) => void
}

export function AssignedProperty<TValue extends string = string>({
  action,
  ariaLabel = defaultPropertyAriaLabels.assigned,
  dropdownPlacement,
  options,
  placeholder = defaultPropertyPlaceholders.assigned,
  ...props
}: Readonly<AssignedPropertyProps<TValue>>) {
  return (
    <PersonProperty
      action={action}
      ariaLabel={ariaLabel}
      dropdownPlacement={dropdownPlacement}
      options={options}
      placeholder={placeholder}
      {...props}
    />
  )
}

export function AssignedPropertyBadge<TValue extends string = string>({
  className,
  option,
  placeholder = defaultPropertyPlaceholders.assigned,
}: Readonly<{
  className?: string
  option: PersonPropertyOption<TValue> | null
  placeholder?: string
}>) {
  return (
    <PersonPropertyBadge
      className={className}
      option={option}
      placeholder={placeholder}
    />
  )
}
