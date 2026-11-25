import { ArrowsDownUpIcon, ShapesIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { MenuSeparator } from '@tc96/ui/menu'
import {
  Action,
  CollectionSearchField,
  CollectionToolbar,
  CollectionToolbarDescription,
  CollectionToolbarGroup,
  CollectionToolbarHeading,
  type CollectionToolbarProps,
  CollectionToolbarTitle,
  FilterRadioSubmenu,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { useState } from 'react'
import { Slot } from '../../test-utils/anatomy-slot'
import { viewSettingsControlArgs } from '../view-settings/view-settings-controls.ts'
import {
  spreadsheetModes,
  viewModes,
} from '../view-settings/view-settings-data.tsx'
import { ComposedViewSettings } from '../view-settings/view-settings-layouts.tsx'
import { viewSwitcherControlArgs } from '../view-switcher/view-switcher-controls.ts'
import {
  ComposedViewSwitcher,
  type ComposedViewSwitcherProps,
} from '../view-switcher/view-switcher-layouts.tsx'
import type { ToolbarControls } from './toolbar-controls.ts'

const ignore = () => undefined

export interface ComposedToolbarProps extends ToolbarControls {
  switcher?: Partial<ComposedViewSwitcherProps>
}

export function ComposedToolbar({
  ariaLabel,
  center,
  description,
  left,
  right,
  switcher,
  mode,
  title,
}: Readonly<ComposedToolbarProps>) {
  const [searchValue, setSearchValue] = useState('')
  const settingsMenu = (
    <ComposedViewSettings {...viewSettingsControlArgs} modes={viewModes} />
  )

  const searchField = (
    <CollectionSearchField
      label="Buscar tarefas"
      onCommit={setSearchValue}
      placeholder="Buscar tarefas"
      value={searchValue}
    />
  )

  const heading = (
    <CollectionToolbarHeading>
      <CollectionToolbarTitle>{title}</CollectionToolbarTitle>
      <CollectionToolbarDescription>{description}</CollectionToolbarDescription>
    </CollectionToolbarHeading>
  )

  const leftContent = {
    heading,
    none: undefined,
    search: center === 'search' ? undefined : searchField,
    switcher: (
      <ComposedViewSwitcher {...viewSwitcherControlArgs} {...switcher} />
    ),
  }[left]

  const action = <Action label="Nova tarefa" onClick={ignore} />

  const rightContent = {
    action,
    none: undefined,
    settings: settingsMenu,
    'settings-and-action': (
      <>
        {settingsMenu}
        {action}
      </>
    ),
  }[right]

  return (
    <CollectionToolbar
      aria-label={ariaLabel}
      center={center === 'search' ? searchField : undefined}
      className={left === 'heading' ? 'min-h-14' : undefined}
      left={leftContent}
      mode={mode}
      right={rightContent}
    />
  )
}

export function SearchFieldToolbar() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name_asc')
  const [type, setType] = useState('')
  const activeFilterCount = [search, type].filter(Boolean).length

  return (
    <CollectionToolbar
      right={
        <>
          <ViewSettingsMenu
            activeFilterCount={activeFilterCount}
            onClearFilters={() => {
              setSearch('')
              setType('')
            }}
          >
            <ViewSettingsSection label="Exibição">
              <FilterRadioSubmenu
                clearLabel="Nome (A–Z)"
                icon={ArrowsDownUpIcon}
                label="Ordenar por"
                onValueChange={(value) => setSort(value || 'name_asc')}
                options={[
                  ['name_desc', 'Nome (Z–A)'],
                  ['created_desc', 'Mais recentes'],
                ]}
                value={sort === 'name_asc' ? '' : sort}
              />
            </ViewSettingsSection>
            <MenuSeparator />
            <ViewSettingsSection label="Filtros">
              <FilterRadioSubmenu
                icon={ShapesIcon}
                label="Tipo"
                onValueChange={setType}
                options={[
                  ['person', 'Pessoa'],
                  ['organization', 'Organização'],
                ]}
                value={type}
              />
            </ViewSettingsSection>
          </ViewSettingsMenu>
          <Action label="Novo contato" onClick={ignore} />
        </>
      }
      left={
        <CollectionSearchField
          label="Buscar contatos"
          onCommit={setSearch}
          placeholder="Nome, e-mail ou telefone"
          value={search}
        />
      }
    />
  )
}

export const SpreadsheetSettingsToolbar = () => (
  <CollectionToolbar
    right={
      <ComposedViewSettings
        {...viewSettingsControlArgs}
        filters={false}
        modes={spreadsheetModes}
      />
    }
  />
)

export function GroupToolbar() {
  return (
    <CollectionToolbar
      left={
        <CollectionToolbarGroup aria-label="Atalhos de prazo">
          <ToolbarButton render={<Button variant="outline" />}>
            Hoje
          </ToolbarButton>
          <ToolbarButton render={<Button variant="outline" />}>
            Esta semana
          </ToolbarButton>
        </CollectionToolbarGroup>
      }
      right={<Action label="Nova tarefa" onClick={ignore} />}
    />
  )
}

type SlotsProps = Readonly<Pick<CollectionToolbarProps, 'mode'>>

export const DefaultSlots = ({ mode }: SlotsProps) => (
  <CollectionToolbar
    left={<Slot name="left" />}
    mode={mode}
    right={<Slot name="right" />}
  />
)

export const LeftCenterRightSlots = ({ mode }: SlotsProps) => (
  <CollectionToolbar
    center={<Slot name="center" />}
    left={<Slot name="left" />}
    mode={mode}
    right={<Slot name="right" />}
  />
)

export const CenterAndRightSlots = ({ mode }: SlotsProps) => (
  <CollectionToolbar
    center={<Slot name="center" />}
    mode={mode}
    right={<Slot name="right" />}
  />
)

export const RightSideSlots = ({ mode }: SlotsProps) => (
  <CollectionToolbar mode={mode} right={<Slot name="right" />} />
)
