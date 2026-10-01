'use client'

import {
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuPrimitive,
  MenuRadioGroup,
  Menu as MenuRoot,
  MenuSeparator,
} from '@tc96/ui/menu'
import { cn } from '@tc96/utils'
import {
  type LucideIcon,
  RotateCcwIcon,
  SaveIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { CollectionToolbarMenuTrigger } from './collection-toolbar-menu-trigger'

export interface ViewSettingsMode<TMode extends string = string> {
  icon: LucideIcon
  label: string
  value: TMode
}

export interface ViewSettingsMenuProps<TMode extends string = string> {
  /** Some no rótulo do gatilho quando zero, na mesma gramática do `FilterMenu`. */
  activeFilterCount?: number
  children: ReactNode
  className?: string
  clearLabel?: string
  label?: string
  mode?: TMode
  /** Na ordem da coleção; com menos de dois modos, as tabs não aparecem. */
  modes?: readonly ViewSettingsMode<TMode>[]
  onClearFilters: () => void
  onModeChange?: (mode: TMode) => void
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
 * O pacote não decide quais modos ou seções existem — só a moldura, as tabs de
 * modo, a contagem no rótulo e o rodapé. A coleção fornece as opções.
 */
export function ViewSettingsMenu<TMode extends string = string>({
  activeFilterCount = 0,
  children,
  className,
  clearLabel = 'Limpar filtros',
  label = 'Exibição',
  mode,
  modes = [],
  onClearFilters,
  onModeChange,
  onSavePreference,
  savePreferenceDisabled = false,
  savePreferenceLabel = 'Salvar preferência',
}: Readonly<ViewSettingsMenuProps<TMode>>): ReactElement {
  const normalizedActiveCount = Math.max(0, activeFilterCount)
  const triggerLabel = normalizedActiveCount
    ? `${label} (${normalizedActiveCount})`
    : label
  const hasModeTabs = modes.length > 1

  return (
    <MenuRoot>
      <CollectionToolbarMenuTrigger className={className}>
        <SlidersHorizontalIcon aria-hidden="true" />
        {triggerLabel}
      </CollectionToolbarMenuTrigger>
      <MenuPopup align="end" className={hasModeTabs ? 'w-64' : 'w-56'}>
        {hasModeTabs ? (
          <ViewSettingsModeTabs
            modes={modes}
            onModeChange={onModeChange}
            value={mode}
          />
        ) : null}
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

function ViewSettingsModeTabs<TMode extends string>({
  modes,
  onModeChange,
  value,
}: Readonly<{
  modes: readonly ViewSettingsMode<TMode>[]
  onModeChange?: (mode: TMode) => void
  value?: TMode
}>): ReactElement {
  const layout = modes.length < 4 ? 'inline' : 'stacked'

  return (
    <MenuRadioGroup
      className="flex gap-0.5 rounded-lg bg-muted p-0.5"
      onValueChange={(next: TMode) => onModeChange?.(next)}
      value={value}
    >
      {modes.map(({ icon: Icon, label, value: modeValue }) => (
        <MenuPrimitive.RadioItem
          className={cn(
            'flex min-w-0 flex-auto cursor-default select-none items-center justify-center rounded-md text-muted-foreground outline-none data-checked:bg-background not-data-checked:data-highlighted:bg-accent data-highlighted:text-foreground data-checked:text-foreground data-checked:shadow-sm/5 dark:data-checked:bg-input [&_svg:not([class*=size-])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
            layout === 'stacked'
              ? 'flex-col gap-1 px-1 py-1.5 text-xs'
              : 'min-h-7 gap-1.5 px-1.5 text-sm',
          )}
          closeOnClick
          data-layout={layout}
          data-slot="view-settings-mode-tab"
          key={modeValue}
          value={modeValue}
        >
          <span className="inline-flex size-4 shrink-0 items-center justify-center rounded bg-[#c65c50] text-white">
            <Icon aria-hidden="true" className="size-3" />
          </span>
          <span className="truncate">{label}</span>
        </MenuPrimitive.RadioItem>
      ))}
    </MenuRadioGroup>
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
