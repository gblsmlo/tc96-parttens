import {
  ArrowsDownUpIcon,
  FileTextIcon,
  ListBulletsIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import {
  FilterCheckboxSubmenu,
  FilterRadioSubmenu,
} from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { CollectionSearchField } from '@tc96/ui/patterns/collection/shared/components/collection-search-field'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components'
import type { ReactNode } from 'react'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import {
  Documents3CreateMenu,
  type Documents3CreateMenuProps,
  hasDocuments3Create,
} from './documents-3-create-menu'
import {
  documents3Groupings,
  documents3Modes,
  documents3Sorts,
  documents3Types,
} from './documents-3-options'
import type {
  Documents3GroupBy,
  Documents3Labels,
  Documents3Mode,
  Documents3Sort,
  Documents3Type,
} from './types'

export interface Documents3ToolbarProps
  extends Omit<Documents3CreateMenuProps, 'labels'> {
  groupBy: Documents3GroupBy | null
  labels: Documents3Labels
  left: ReactNode
  loading: boolean
  mode: Documents3Mode
  onGroupByChange?: (groupBy: Documents3GroupBy | null) => void
  onModeChange: (mode: Documents3Mode) => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSortChange?: (sort: Documents3Sort | null) => void
  onTypeFilterChange?: (types: Documents3Type[]) => void
  search: string
  sort: Documents3Sort | null
  typeFilter: readonly Documents3Type[]
}

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

export function Documents3Toolbar({
  accept,
  groupBy,
  labels,
  left,
  loading,
  mode,
  onCreateLink,
  onCreateNote,
  onCreatePage,
  onGroupByChange,
  onModeChange,
  onSavePreference,
  onSearchChange,
  onSortChange,
  onTypeFilterChange,
  onUpload,
  search,
  sort,
  typeFilter,
}: Readonly<Documents3ToolbarProps>) {
  const showSearch = Boolean(onSearchChange)
  const activeFilterCount =
    (showSearch && search.trim() ? 1 : 0) +
    (onTypeFilterChange && typeFilter.length > 0 ? 1 : 0)
  const create = { onCreateLink, onCreateNote, onCreatePage, onUpload }

  return (
    <DataCollectionSettingsToolbar<Documents3Mode>
      actions={
        hasDocuments3Create(create) ? (
          <Documents3CreateMenu accept={accept} labels={labels} {...create} />
        ) : null
      }
      activeFilterCount={activeFilterCount}
      labels={labels}
      left={left}
      loading={loading}
      mode={mode}
      modeLabels={labels.modes}
      modes={documents3Modes}
      onClearFilters={() => {
        if (showSearch && search) onSearchChange?.('')
        onTypeFilterChange?.([])
      }}
      onModeChange={onModeChange}
      onSavePreference={onSavePreference}
      savePreferenceLabel={labels.savePreference}
      search={
        onSearchChange ? (
          <CollectionSearchField
            label={labels.search}
            onCommit={onSearchChange}
            placeholder={labels.search}
            value={search}
          />
        ) : null
      }
    >
      {onSortChange ? (
        <ViewSettingsSection label={labels.sort}>
          <FilterRadioSubmenu
            clearLabel={labels.defaultSort}
            icon={ArrowsDownUpIcon}
            label={labels.sortBy}
            onValueChange={(value) =>
              onSortChange(pick(documents3Sorts, value))
            }
            options={documents3Sorts.map(
              (item) => [item, labels.sorts[item]] as const,
            )}
            value={sort ?? ''}
          />
        </ViewSettingsSection>
      ) : null}
      {onSortChange && onGroupByChange ? <MenuSeparator /> : null}
      {onGroupByChange ? (
        <ViewSettingsSection label={labels.group}>
          <FilterRadioSubmenu
            clearLabel={labels.noGrouping}
            icon={ListBulletsIcon}
            label={labels.groupBy}
            onValueChange={(value) =>
              onGroupByChange(pick(documents3Groupings, value))
            }
            options={documents3Groupings.map(
              (item) => [item, labels.groupings[item]] as const,
            )}
            value={groupBy ?? ''}
          />
        </ViewSettingsSection>
      ) : null}
      {(onSortChange || onGroupByChange) && onTypeFilterChange ? (
        <MenuSeparator />
      ) : null}
      {onTypeFilterChange ? (
        <ViewSettingsSection label={labels.filters}>
          <FilterCheckboxSubmenu<Documents3Type>
            clearLabel={labels.allTypes}
            icon={FileTextIcon}
            label={labels.columns.type}
            onValueChange={onTypeFilterChange}
            options={documents3Types.map(
              (item) => [item, labels.types[item]] as const,
            )}
            value={typeFilter}
          />
        </ViewSettingsSection>
      ) : null}
    </DataCollectionSettingsToolbar>
  )
}
