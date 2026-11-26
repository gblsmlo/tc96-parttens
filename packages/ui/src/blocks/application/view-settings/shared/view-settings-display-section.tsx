'use client'

import { RowsIcon, SortAscendingIcon } from '@phosphor-icons/react'
import {
  ViewSettingsSection,
  ViewSettingsSubmenu,
} from '@tc96/ui/patterns/view-settings/components'
import type { ReactNode } from 'react'
import type {
  ViewSettingsBlockLabels,
  ViewSettingsDensity,
  ViewSettingsDisplayProps,
} from './types'

export interface ViewSettingsDisplaySectionProps<TSort extends string>
  extends ViewSettingsDisplayProps<TSort> {
  densityIcons?: Readonly<Record<ViewSettingsDensity, ReactNode>>
  labels: ViewSettingsBlockLabels
}

export function ViewSettingsDisplaySection<TSort extends string>({
  density,
  densityIcons,
  labels,
  onDensityChange,
  onSortChange,
  sort,
  sortOptions,
}: Readonly<ViewSettingsDisplaySectionProps<TSort>>) {
  return (
    <ViewSettingsSection label={labels.display}>
      <ViewSettingsSubmenu
        icon={RowsIcon}
        label={labels.density}
        onValueChange={onDensityChange}
        options={[
          {
            icon: densityIcons?.comfortable,
            label: labels.comfortable,
            value: 'comfortable',
          },
          {
            icon: densityIcons?.compact,
            label: labels.compact,
            value: 'compact',
          },
        ]}
        value={density}
      />
      <ViewSettingsSubmenu
        icon={SortAscendingIcon}
        label={labels.sort}
        onValueChange={onSortChange}
        options={sortOptions}
        value={sort}
      />
    </ViewSettingsSection>
  )
}
