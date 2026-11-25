import {
  ArrowsDownUpIcon,
  FunnelSimpleIcon,
  ReceiptIcon,
  ShapesIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { CollectionSearchField } from '@tc96/ui/patterns/collection/shared/components/collection-search-field'
import { SortRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-sort-submenu'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components/view-settings'
import type { ReactNode } from 'react'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import { DataCollectionToolbarButton } from '../../shared/collection/data-collection-toolbar'
import {
  legal9BillingModels,
  legal9Modes,
  legal9Sorts,
  legal9Statuses,
  pickLegal9,
} from './legal-9-options'
import type {
  Legal9BillingModel,
  Legal9GroupBy,
  Legal9Labels,
  Legal9Mode,
  Legal9Person,
  Legal9Sort,
  Legal9Status,
} from './types'

export interface Legal9ToolbarProps {
  billingModelFilter: Legal9BillingModel | null
  groupBy: Legal9GroupBy | null
  groupings: readonly Legal9GroupBy[]
  labels: Legal9Labels
  left?: ReactNode
  loading: boolean
  mode: Legal9Mode
  onBillingModelFilterChange?: (billingModel: Legal9BillingModel | null) => void
  onCreate?: () => void
  onGroupByChange?: (groupBy: Legal9GroupBy | null) => void
  onModeChange: (mode: Legal9Mode) => void
  onOwnerFilterChange: (ownerId: string | null) => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSortChange?: (sort: Legal9Sort) => void
  onStatusFilterChange?: (status: Legal9Status | null) => void
  ownerFilter: string | null
  owners: readonly Legal9Person[]
  ownersLoading: boolean
  search: string
  sort: Legal9Sort
  statusFilter: Legal9Status | null
}

export function Legal9Toolbar({
  billingModelFilter,
  groupBy,
  groupings,
  labels,
  left,
  loading,
  mode,
  onBillingModelFilterChange,
  onCreate,
  onGroupByChange,
  onModeChange,
  onOwnerFilterChange,
  onSavePreference,
  onSearchChange,
  onSortChange,
  onStatusFilterChange,
  ownerFilter,
  owners,
  ownersLoading,
  search,
  sort,
  statusFilter,
}: Readonly<Legal9ToolbarProps>) {
  const showStatus = Boolean(onStatusFilterChange)
  const showBillingModel = Boolean(onBillingModelFilterChange)
  const showOwner = owners.length > 0 || ownersLoading
  const hasFilters = showStatus || showBillingModel || showOwner
  const activeFilterCount =
    (showStatus && statusFilter ? 1 : 0) +
    (showBillingModel && billingModelFilter ? 1 : 0) +
    (showOwner && ownerFilter ? 1 : 0)

  return (
    <DataCollectionSettingsToolbar<Legal9Mode>
      actions={
        onCreate ? (
          <DataCollectionToolbarButton onClick={onCreate} variant="default">
            {labels.create}
          </DataCollectionToolbarButton>
        ) : null
      }
      activeFilterCount={activeFilterCount}
      labels={labels}
      left={left}
      loading={loading}
      mode={mode}
      modeLabels={labels.modes}
      modes={legal9Modes}
      onClearFilters={() => {
        if (showStatus) onStatusFilterChange?.(null)
        if (showBillingModel) onBillingModelFilterChange?.(null)
        if (showOwner) onOwnerFilterChange(null)
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
          <SortRadioSubmenu<Legal9Sort>
            icon={ArrowsDownUpIcon}
            label={labels.sortBy}
            onValueChange={onSortChange}
            options={legal9Sorts.map(
              (item) => [item, labels.sorts[item]] as const,
            )}
            value={sort}
          />
        </ViewSettingsSection>
      ) : null}
      {onSortChange && onGroupByChange ? <MenuSeparator /> : null}
      {onGroupByChange ? (
        <ViewSettingsSection label={labels.group}>
          <FilterRadioSubmenu
            clearLabel={labels.noGrouping}
            icon={ShapesIcon}
            label={labels.groupBy}
            onValueChange={(value) =>
              onGroupByChange(pickLegal9(groupings, value))
            }
            options={groupings.map(
              (item) => [item, labels.groupings[item]] as const,
            )}
            value={groupBy ?? ''}
          />
        </ViewSettingsSection>
      ) : null}
      {(onSortChange || onGroupByChange) && hasFilters ? (
        <MenuSeparator />
      ) : null}
      {hasFilters ? (
        <ViewSettingsSection label={labels.filters}>
          {showStatus ? (
            <FilterRadioSubmenu
              clearLabel={labels.allStatuses}
              icon={FunnelSimpleIcon}
              label={labels.columns.status}
              onValueChange={(value) =>
                onStatusFilterChange?.(pickLegal9(legal9Statuses, value))
              }
              options={legal9Statuses.map(
                (item) => [item, labels.statuses[item]] as const,
              )}
              value={statusFilter ?? ''}
            />
          ) : null}
          {showBillingModel ? (
            <FilterRadioSubmenu
              clearLabel={labels.allBillingModels}
              icon={ReceiptIcon}
              label={labels.columns.billingModel}
              onValueChange={(value) =>
                onBillingModelFilterChange?.(
                  pickLegal9(legal9BillingModels, value),
                )
              }
              options={legal9BillingModels.map(
                (item) => [item, labels.billingModels[item]] as const,
              )}
              value={billingModelFilter ?? ''}
            />
          ) : null}
          {showOwner ? (
            <FilterRadioSubmenu
              clearLabel={labels.allOwners}
              icon={UserIcon}
              label={labels.columns.owner}
              loading={ownersLoading}
              onValueChange={(value) => onOwnerFilterChange(value || null)}
              options={owners.map((item) => [item.id, item.label] as const)}
              value={ownerFilter ?? ''}
            />
          ) : null}
        </ViewSettingsSection>
      ) : null}
    </DataCollectionSettingsToolbar>
  )
}
