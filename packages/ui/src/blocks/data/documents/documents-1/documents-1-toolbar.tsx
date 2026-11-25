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
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings-menu/components/view-settings-menu'
import type { ReactNode } from 'react'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import {
  Documents1CreateMenu,
  type Documents1CreateMenuProps,
  hasDocuments1Create,
} from './documents-1-create-menu'
import {
  documents1Groupings,
  documents1Modes,
  documents1Sorts,
  documents1Types,
} from './documents-1-options'
import type {
  Documents1GroupBy,
  Documents1Labels,
  Documents1Mode,
  Documents1Sort,
  Documents1Type,
} from './types'

export interface Documents1ToolbarProps
  extends Omit<Documents1CreateMenuProps, 'labels'> {
  groupBy: Documents1GroupBy | null
  labels: Documents1Labels
  left: ReactNode
  loading: boolean
  mode: Documents1Mode
  onGroupByChange?: (groupBy: Documents1GroupBy | null) => void
  onModeChange: (mode: Documents1Mode) => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSortChange?: (sort: Documents1Sort | null) => void
  onTypeFilterChange?: (types: Documents1Type[]) => void
  search: string
  sort: Documents1Sort | null
  typeFilter: readonly Documents1Type[]
}

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

export function Documents1Toolbar({
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
}: Readonly<Documents1ToolbarProps>) {
  const showSearch = Boolean(onSearchChange)
  const activeFilterCount =
    (showSearch && search.trim() ? 1 : 0) +
    (onTypeFilterChange && typeFilter.length > 0 ? 1 : 0)
  const create = { onCreateLink, onCreateNote, onCreatePage, onUpload }

  return (
    <DataCollectionSettingsToolbar<Documents1Mode>
      actions={
        hasDocuments1Create(create) ? (
          <Documents1CreateMenu accept={accept} labels={labels} {...create} />
        ) : null
      }
      activeFilterCount={activeFilterCount}
      labels={labels}
      left={left}
      loading={loading}
      mode={mode}
      modeLabels={labels.modes}
      modes={documents1Modes}
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
              onSortChange(pick(documents1Sorts, value))
            }
            options={documents1Sorts.map(
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
              onGroupByChange(pick(documents1Groupings, value))
            }
            options={documents1Groupings.map(
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
          <FilterCheckboxSubmenu<Documents1Type>
            clearLabel={labels.allTypes}
            icon={FileTextIcon}
            label={labels.columns.type}
            onValueChange={onTypeFilterChange}
            options={documents1Types.map(
              (item) => [item, labels.types[item]] as const,
            )}
            value={typeFilter}
          />
        </ViewSettingsSection>
      ) : null}
    </DataCollectionSettingsToolbar>
  )
}
