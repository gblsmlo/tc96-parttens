import { CalendarDotsIcon, RowsIcon } from '@phosphor-icons/react'
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import {
  ViewSettingsMenu,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import type { ViewSettingsControls } from './view-settings-controls.ts'
import {
  agendaModes,
  type FilterKey,
  filterDefinitions,
  noFilters,
  viewModes,
} from './view-settings-data.tsx'

type Density = 'comfortable' | 'compact'

type ViewSort = 'due' | 'updated'

export interface ComposedViewSettingsProps extends ViewSettingsControls {
  filters?: boolean
  modes?: readonly ViewSettingsMode[]
}

export function ComposedViewSettings({
  clear,
  clearLabel,
  filters: showFilters = true,
  label,
  modes = [],
  savePreference,
  savePreferenceLabel,
}: Readonly<ComposedViewSettingsProps>) {
  const initialMode = modes[0]?.value
  const [mode, setMode] = useState(initialMode)
  const [density, setDensity] = useState<Density>('comfortable')
  const [sort, setSort] = useState<ViewSort>('due')
  const [filters, setFilters] = useState(noFilters)

  const activeFilterCount = Object.values(filters).reduce(
    (count, values) => count + values.length,
    0,
  )
  const modified =
    activeFilterCount > 0 ||
    mode !== initialMode ||
    sort !== 'due' ||
    density !== 'comfortable'

  const toggleFilter = (key: FilterKey, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }))
  }

  return (
    <ViewSettingsMenu
      activeFilterCount={activeFilterCount}
      clearLabel={clearLabel}
      label={label}
      mode={mode}
      modes={modes}
      onClearFilters={clear ? () => setFilters(noFilters) : undefined}
      onModeChange={setMode}
      onSavePreference={savePreference ? () => undefined : undefined}
      savePreferenceDisabled={!modified}
      savePreferenceLabel={savePreferenceLabel}
    >
      <ViewSettingsSection label="Exibição">
        <MenuSub>
          <MenuSubTrigger>
            <RowsIcon aria-hidden="true" />
            Densidade
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuRadioGroup onValueChange={setDensity} value={density}>
              <MenuRadioItem value="comfortable">Confortável</MenuRadioItem>
              <MenuRadioItem value="compact">Compacta</MenuRadioItem>
            </MenuRadioGroup>
          </MenuSubPopup>
        </MenuSub>
        <MenuSub>
          <MenuSubTrigger>
            <CalendarDotsIcon aria-hidden="true" />
            Ordenar por
          </MenuSubTrigger>
          <MenuSubPopup>
            <MenuRadioGroup onValueChange={setSort} value={sort}>
              <MenuRadioItem value="due">Prazo</MenuRadioItem>
              <MenuRadioItem value="updated">Atualização</MenuRadioItem>
            </MenuRadioGroup>
          </MenuSubPopup>
        </MenuSub>
      </ViewSettingsSection>
      {showFilters ? (
        <>
          <MenuSeparator />
          <ViewSettingsSection label="Filtros">
            {filterDefinitions.map(({ icon: Icon, id, label, options }) => (
              <MenuSub key={id}>
                <MenuSubTrigger>
                  <Icon aria-hidden="true" />
                  {label}
                </MenuSubTrigger>
                <MenuSubPopup>
                  <MenuGroup>
                    <MenuGroupLabel>{label}</MenuGroupLabel>
                    {options.map((option) => (
                      <MenuCheckboxItem
                        checked={filters[id].includes(option)}
                        closeOnClick={false}
                        key={option}
                        onCheckedChange={() => toggleFilter(id, option)}
                      >
                        {option}
                      </MenuCheckboxItem>
                    ))}
                  </MenuGroup>
                </MenuSubPopup>
              </MenuSub>
            ))}
          </ViewSettingsSection>
        </>
      ) : null}
    </ViewSettingsMenu>
  )
}

export const InlineModeTabsLayout = (
  controls: Readonly<ViewSettingsControls>,
) => <ComposedViewSettings {...controls} modes={viewModes} />

export const StackedModeTabsLayout = (
  controls: Readonly<ViewSettingsControls>,
) => <ComposedViewSettings {...controls} modes={agendaModes} />
