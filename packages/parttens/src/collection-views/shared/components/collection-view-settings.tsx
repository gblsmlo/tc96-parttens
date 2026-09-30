'use client'

import {
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  Menu as MenuRoot,
  MenuSeparator,
} from '@tc96/ui/menu'
import { RotateCcwIcon, SaveIcon, SlidersHorizontalIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { CollectionToolbarMenuTrigger } from './collection-toolbar-menu-trigger'

export interface ViewSettingsMenuProps {
  /** Some no rótulo do gatilho quando zero, na mesma gramática do `FilterMenu`. */
  activeFilterCount?: number
  children: ReactNode
  className?: string
  clearLabel?: string
  label?: string
  onClearFilters: () => void
  /** Sem handler o rodapé não compõe o item: guardar preferência é opcional. */
  onSavePreference?: () => void
  savePreferenceDisabled?: boolean
  savePreferenceLabel?: string
}

export interface ViewSettingsSectionProps {
  children: ReactNode
  label: ReactNode
}

/**
 * Superfície única de ajustes da view: filtro avançado e configuração deixam de
 * ser dois gatilhos vizinhos e passam a ser seções de um só menu.
 *
 * O pacote não decide quais seções existem — só a moldura, a contagem no rótulo e
 * o rodapé de limpar. O que cada seção oferece é da vitrine.
 */
export function ViewSettingsMenu({
  activeFilterCount = 0,
  children,
  className,
  clearLabel = 'Limpar filtros',
  label = 'Exibição',
  onClearFilters,
  onSavePreference,
  savePreferenceDisabled = false,
  savePreferenceLabel = 'Salvar preferência',
}: Readonly<ViewSettingsMenuProps>): ReactElement {
  const normalizedActiveCount = Math.max(0, activeFilterCount)
  const triggerLabel = normalizedActiveCount
    ? `${label} (${normalizedActiveCount})`
    : label

  return (
    <MenuRoot>
      <CollectionToolbarMenuTrigger className={className}>
        <SlidersHorizontalIcon aria-hidden="true" />
        {triggerLabel}
      </CollectionToolbarMenuTrigger>
      <MenuPopup align="end" className="w-56">
        {children}
        <MenuSeparator />
        {/* Limpar antes de guardar: descartar volta ao ponto de partida, guardar
            avança a partir dele — a ordem é a mesma sequência de decisão. */}
        <MenuItem disabled={!normalizedActiveCount} onClick={onClearFilters}>
          <RotateCcwIcon aria-hidden="true" />
          {clearLabel}
        </MenuItem>
        {onSavePreference ? (
          <MenuItem
            disabled={savePreferenceDisabled}
            onClick={onSavePreference}
          >
            <SaveIcon aria-hidden="true" />
            {savePreferenceLabel}
          </MenuItem>
        ) : null}
      </MenuPopup>
    </MenuRoot>
  )
}

/** Divisão nomeada dentro do `ViewSettingsMenu`. */
export function ViewSettingsSection({
  children,
  label,
}: Readonly<ViewSettingsSectionProps>): ReactElement {
  return (
    <MenuGroup>
      <MenuGroupLabel>{label}</MenuGroupLabel>
      {children}
    </MenuGroup>
  )
}
