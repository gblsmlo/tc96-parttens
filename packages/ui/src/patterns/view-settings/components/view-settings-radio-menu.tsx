'use client'

import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { MenuRadioGroup, MenuRadioItem } from '@tc96/ui/menu'
import { ViewSettingsSection } from './view-settings'
import { ViewSettingsMenuButton } from './view-settings-menu-button'
import type { ViewSettingsOption } from './view-settings-submenu'

export interface ViewSettingsRadioMenuProps<TValue extends string> {
  icon: PhosphorIcon
  label: string
  onValueChange: (value: TValue) => void
  options: readonly ViewSettingsOption<TValue>[]
  section: string
  value?: TValue
}

export function ViewSettingsRadioMenu<TValue extends string>({
  icon,
  label,
  onValueChange,
  options,
  section,
  value,
}: Readonly<ViewSettingsRadioMenuProps<TValue>>) {
  return (
    <ViewSettingsMenuButton icon={icon} label={label}>
      <ViewSettingsSection label={section}>
        <MenuRadioGroup
          onValueChange={(next: TValue) => onValueChange(next)}
          value={value}
        >
          {options.map((option) => (
            <MenuRadioItem closeOnClick key={option.value} value={option.value}>
              {option.icon}
              {option.label}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </ViewSettingsSection>
    </ViewSettingsMenuButton>
  )
}
