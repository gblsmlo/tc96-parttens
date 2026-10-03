'use client'

import type { RowData } from '@tanstack/react-table'
import {
  MenuRadioGroup,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import {
  AlignVerticalSpaceAroundIcon,
  ChevronsDownUpIcon,
  EqualIcon,
  MinusIcon,
} from 'lucide-react'
import type React from 'react'
import { MenuRadioOption } from '../../../../shared/components/menu-selection-item'
import type { DataGridTable } from '../lib/data-grid-features'
import type { DataGridDensity } from '../types'

interface DensityOption {
  icon: React.ComponentType<React.ComponentProps<'svg'>>
  label: string
  value: DataGridDensity
}

const DENSITIES: [DensityOption, ...DensityOption[]] = [
  { icon: MinusIcon, label: 'Compacta', value: 'short' },
  { icon: EqualIcon, label: 'Média', value: 'medium' },
  { icon: AlignVerticalSpaceAroundIcon, label: 'Alta', value: 'tall' },
  { icon: ChevronsDownUpIcon, label: 'Extra alta', value: 'extra-tall' },
]

export interface DataGridDensitySubmenuProps<TData extends RowData> {
  label?: string
  table: DataGridTable<TData>
}

export function DataGridDensitySubmenu<TData extends RowData>({
  label = 'Altura das linhas',
  table,
}: DataGridDensitySubmenuProps<TData>): React.ReactElement {
  const density = table.options.meta?.dataGridDensity ?? 'short'
  const selected =
    DENSITIES.find((option) => option.value === density) ?? DENSITIES[0]
  const SelectedIcon = selected.icon

  return (
    <MenuSub>
      <MenuSubTrigger>
        <SelectedIcon aria-hidden="true" />
        {label}
      </MenuSubTrigger>
      <MenuSubPopup>
        <MenuRadioGroup
          onValueChange={(value) =>
            table.options.meta?.onDataGridDensityChange?.(
              value as DataGridDensity,
            )
          }
          value={density}
        >
          {DENSITIES.map((option) => (
            <MenuRadioOption key={option.value} value={option.value}>
              <option.icon />
              {option.label}
            </MenuRadioOption>
          ))}
        </MenuRadioGroup>
      </MenuSubPopup>
    </MenuSub>
  )
}
