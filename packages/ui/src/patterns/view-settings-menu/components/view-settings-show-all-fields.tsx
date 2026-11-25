'use client'

import { EyeIcon } from '@phosphor-icons/react'
import { MenuItem } from '@tc96/ui/menu'
import type { ReactElement } from 'react'

export interface ViewSettingsShowAllFieldsProps {
  hiddenCount: number
  label?: string
  onShowAll: () => void
}

export function ViewSettingsShowAllFields({
  hiddenCount,
  label = 'Mostrar todos os campos',
  onShowAll,
}: Readonly<ViewSettingsShowAllFieldsProps>): ReactElement {
  return (
    <MenuItem
      closeOnClick={false}
      disabled={hiddenCount <= 0}
      onClick={onShowAll}
    >
      <EyeIcon aria-hidden="true" />
      {label}
    </MenuItem>
  )
}
