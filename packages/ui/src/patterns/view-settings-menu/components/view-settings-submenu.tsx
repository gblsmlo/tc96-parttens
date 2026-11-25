'use client'

import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import type { ReactElement } from 'react'

export interface ViewSettingsOption<TValue extends string = string> {
  label: string
  value: TValue
}

export interface ViewSettingsSubmenuProps<TValue extends string = string> {
  icon?: PhosphorIcon
  label: string
  onValueChange: (value: TValue) => void
  options: readonly ViewSettingsOption<TValue>[]
  value: TValue
}

export function ViewSettingsSubmenu<TValue extends string = string>({
  icon: Icon,
  label,
  onValueChange,
  options,
  value,
}: Readonly<ViewSettingsSubmenuProps<TValue>>): ReactElement {
  const current = options.find((option) => option.value === value)

  return (
    <MenuSub>
      <MenuSubTrigger>
        {Icon ? <Icon aria-hidden="true" /> : null}
        {label}
        <span
          className="flex-1 truncate text-end text-muted-foreground"
          data-slot="view-settings-current-value"
        >
          {current?.label}
        </span>
      </MenuSubTrigger>
      <MenuSubPopup>
        <MenuRadioGroup
          onValueChange={(next: TValue) => onValueChange(next)}
          value={value}
        >
          {options.map((option) => (
            <MenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuSubPopup>
    </MenuSub>
  )
}
