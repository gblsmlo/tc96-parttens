'use client'

import {
  FunnelSimpleIcon,
  SortAscendingIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { MenuItem, MenuSeparator } from '@tc96/ui/menu'
import {
  ViewSettingsMenuButton,
  ViewSettingsRadioMenu,
  ViewSettingsSection,
  ViewSettingsSubmenu,
} from '@tc96/ui/patterns/view-settings/components'
import { defaultViewSettings5Labels } from './labels'
import type { ViewSettings5Props } from './types'

export function ViewSettings5<
  TMode extends string,
  TSort extends string,
  TGroup extends string,
>({
  filters = [],
  filterValues = {},
  groupBy,
  groupOptions = [],
  labels: labelOverrides,
  mode,
  modes,
  onClearFilters,
  onFilterValuesChange,
  onGroupByChange,
  onModeChange,
  onSortChange,
  sort,
  sortOptions = [],
}: Readonly<ViewSettings5Props<TMode, TSort, TGroup>>) {
  const labels = { ...defaultViewSettings5Labels, ...labelOverrides }
  const activeFilterCount = filters.filter(({ id }) => filterValues[id]).length
  const currentMode = modes.find(({ value }) => value === mode) ?? modes[0]
  const showFilters = filters.length > 0 && Boolean(onFilterValuesChange)

  return (
    <>
      {showFilters ? (
        <ViewSettingsMenuButton
          icon={FunnelSimpleIcon}
          label={
            activeFilterCount > 0
              ? labels.activeFilters(activeFilterCount)
              : labels.filter
          }
          trailing={
            activeFilterCount > 0 ? (
              <Badge aria-hidden="true">{activeFilterCount}</Badge>
            ) : undefined
          }
        >
          <ViewSettingsSection label={labels.filterSection}>
            {filters.map(({ icon, id, label, options }) => (
              <ViewSettingsSubmenu
                icon={icon}
                key={id}
                label={label}
                onValueChange={(value) =>
                  onFilterValuesChange?.({ ...filterValues, [id]: value })
                }
                options={options}
                value={filterValues[id] ?? undefined}
              />
            ))}
          </ViewSettingsSection>
          {onClearFilters ? (
            <>
              <MenuSeparator />
              <MenuItem
                disabled={activeFilterCount === 0}
                onClick={onClearFilters}
              >
                {labels.clearFilters}
              </MenuItem>
            </>
          ) : null}
        </ViewSettingsMenuButton>
      ) : null}
      {currentMode ? (
        <ViewSettingsRadioMenu<TMode>
          icon={currentMode.icon}
          label={labels.layout}
          onValueChange={onModeChange}
          options={modes.map(({ icon: Icon, label, value }) => ({
            icon: <Icon aria-hidden="true" />,
            label,
            value,
          }))}
          section={labels.layoutSection}
          value={mode}
        />
      ) : null}
      {onSortChange && sortOptions.length > 0 ? (
        <ViewSettingsRadioMenu<TSort>
          icon={SortAscendingIcon}
          label={labels.sort}
          onValueChange={onSortChange}
          options={sortOptions}
          section={labels.sortSection}
          value={sort}
        />
      ) : null}
      {onGroupByChange && groupOptions.length > 0 ? (
        <ViewSettingsRadioMenu<TGroup>
          icon={StackIcon}
          label={labels.group}
          onValueChange={onGroupByChange}
          options={groupOptions}
          section={labels.groupSection}
          value={groupBy}
        />
      ) : null}
    </>
  )
}
