'use client'

import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import type { ReactNode } from 'react'
import { ViewSettingsSection } from './view-settings'

export interface ViewSettingsFilterOption {
  icon?: ReactNode
  label: string
  value: string
}

export interface ViewSettingsFilter {
  allLabel: string
  icon?: PhosphorIcon
  id: string
  label: string
  options: readonly ViewSettingsFilterOption[]
}

export type ViewSettingsFilterValues = Readonly<
  Record<string, readonly string[]>
>

export interface ViewSettingsFilterSectionProps {
  filters: readonly ViewSettingsFilter[]
  filterValues: ViewSettingsFilterValues
  label: string
  onFilterValuesChange: (values: ViewSettingsFilterValues) => void
}

const toggle = (selected: readonly string[], value: string) =>
  selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value]

export function ViewSettingsFilterSection({
  filters,
  filterValues,
  label,
  onFilterValuesChange,
}: Readonly<ViewSettingsFilterSectionProps>) {
  const setSelected = (id: string, selected: readonly string[]) =>
    onFilterValuesChange({ ...filterValues, [id]: selected })

  return (
    <ViewSettingsSection label={label}>
      {filters.map((filter) => {
        const { allLabel, icon: Icon, id, options } = filter
        const selected = filterValues[id] ?? []
        return (
          <MenuSub key={id}>
            <MenuSubTrigger>
              {Icon ? <Icon aria-hidden="true" /> : null}
              {filter.label}
            </MenuSubTrigger>
            <MenuSubPopup>
              <MenuGroup>
                <MenuGroupLabel>{filter.label}</MenuGroupLabel>
                <MenuCheckboxItem
                  checked={selected.length === 0}
                  closeOnClick={false}
                  onCheckedChange={() => setSelected(id, [])}
                >
                  {allLabel}
                </MenuCheckboxItem>
                <MenuSeparator />
                {options.map((option) => (
                  <MenuCheckboxItem
                    checked={selected.includes(option.value)}
                    closeOnClick={false}
                    key={option.value}
                    onCheckedChange={() =>
                      setSelected(id, toggle(selected, option.value))
                    }
                  >
                    {option.icon}
                    {option.label}
                  </MenuCheckboxItem>
                ))}
              </MenuGroup>
            </MenuSubPopup>
          </MenuSub>
        )
      })}
    </ViewSettingsSection>
  )
}
