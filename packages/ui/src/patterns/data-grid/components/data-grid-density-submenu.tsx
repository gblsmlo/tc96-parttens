'use client'

import {
  ArrowsInLineVerticalIcon,
  ArrowsVerticalIcon,
  EqualsIcon,
  MinusIcon,
} from '@phosphor-icons/react'
import type { RowData } from '@tanstack/react-table'
import {
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import type React from 'react'
import type { DataGridTableMeta } from '../lib/data-grid-features'
import type { CollectionDensity } from '../types'

interface DensityOption {
  icon: React.ComponentType<React.ComponentProps<'svg'>>
  label: string
  value: CollectionDensity
}

const DENSITIES: [DensityOption, ...DensityOption[]] = [
  { icon: MinusIcon, label: 'Compacta', value: 'compact' },
  { icon: EqualsIcon, label: 'Padrão', value: 'short' },
  { icon: EqualsIcon, label: 'Média', value: 'medium' },
  { icon: ArrowsVerticalIcon, label: 'Alta', value: 'tall' },
  { icon: ArrowsInLineVerticalIcon, label: 'Extra alta', value: 'extra-tall' },
]

export interface DataGridDensityTable {
  readonly options: {
    readonly meta?: Pick<
      DataGridTableMeta,
      'dataGridDensity' | 'onDataGridDensityChange'
    >
  }
}

export interface DataGridDensitySubmenuProps<_TData extends RowData = RowData> {
  label?: string
  densityLabels?: Partial<Record<CollectionDensity, string>>
  table: DataGridDensityTable
}

export function DataGridDensitySubmenu<TData extends RowData>({
  label = 'Altura das linhas',
  densityLabels,
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
              value as CollectionDensity,
            )
          }
          value={density}
        >
          {DENSITIES.map((option) => (
            <MenuRadioItem key={option.value} value={option.value}>
              <option.icon aria-hidden="true" />
              {densityLabels?.[option.value] ?? option.label}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuSubPopup>
    </MenuSub>
  )
}
