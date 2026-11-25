import {
  ArrowsDownUpIcon,
  BankIcon,
  CircleHalfIcon,
  ScalesIcon,
  TagIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { DataTableColumnsSubmenu } from '@tc96/ui/patterns/data-table/data-table-columns-submenu'
import type { DataTableTable } from '@tc96/ui/patterns/data-table/data-table-features'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components/view-settings'
import {
  finance3EntrySortColumns,
  finance3EntryTypes,
  finance3FeeTypes,
  finance3Situations,
} from './finance-3-options'
import type {
  Finance3Entry,
  Finance3EntrySort,
  Finance3EntryType,
  Finance3FeeType,
  Finance3Labels,
  Finance3Option,
  Finance3Situation,
  Finance3SortDirection,
} from './types'

const sortDirections: readonly Finance3SortDirection[] = ['asc', 'desc']

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

const sortValueOf = (sort: Finance3EntrySort | null) =>
  sort ? `${sort.column}:${sort.direction}` : ''

const sortOf = (value: string): Finance3EntrySort | null => {
  const [column, direction] = value.split(':')
  const sortColumn = pick(finance3EntrySortColumns, column ?? '')
  const sortDirection = pick(sortDirections, direction ?? '')
  return sortColumn && sortDirection
    ? { column: sortColumn, direction: sortDirection }
    : null
}

export interface Finance3EntriesFilters {
  accountFilter: string | null
  feeTypeFilter: Finance3FeeType | null
  situationFilter: Finance3Situation | null
  typeFilter: Finance3EntryType | null
}

export interface Finance3EntriesSettingsProps extends Finance3EntriesFilters {
  accounts: readonly Finance3Option[]
  accountsLoading: boolean
  labels: Finance3Labels
  onAccountFilterChange?: (accountId: string | null) => void
  onFeeTypeFilterChange?: (feeType: Finance3FeeType | null) => void
  onSituationFilterChange?: (situation: Finance3Situation | null) => void
  onSortChange?: (sort: Finance3EntrySort | null) => void
  onTypeFilterChange?: (type: Finance3EntryType | null) => void
  sort: Finance3EntrySort | null
  table: DataTableTable<Finance3Entry>
}

export const finance3ActiveEntryFilterCount = ({
  accountFilter,
  feeTypeFilter,
  situationFilter,
  typeFilter,
}: Finance3EntriesFilters) =>
  [accountFilter, feeTypeFilter, situationFilter, typeFilter].filter(Boolean)
    .length

export function Finance3EntriesSettings({
  accountFilter,
  accounts,
  accountsLoading,
  feeTypeFilter,
  labels,
  onAccountFilterChange,
  onFeeTypeFilterChange,
  onSituationFilterChange,
  onSortChange,
  onTypeFilterChange,
  situationFilter,
  sort,
  table,
  typeFilter,
}: Readonly<Finance3EntriesSettingsProps>) {
  const entryLabels = labels.entries
  const showAccount =
    Boolean(onAccountFilterChange) && (accounts.length > 0 || accountsLoading)
  const hasFilters =
    Boolean(onSituationFilterChange) ||
    Boolean(onTypeFilterChange) ||
    Boolean(onFeeTypeFilterChange) ||
    showAccount

  return (
    <>
      <ViewSettingsSection label={labels.display}>
        <DataTableColumnsSubmenu
          label={entryLabels.columnsMenu}
          table={table}
        />
      </ViewSettingsSection>
      {onSortChange ? (
        <>
          <MenuSeparator />
          <ViewSettingsSection label={entryLabels.sort}>
            <FilterRadioSubmenu
              clearLabel={entryLabels.defaultSort}
              icon={ArrowsDownUpIcon}
              label={entryLabels.sortBy}
              onValueChange={(value) => onSortChange(sortOf(value))}
              options={finance3EntrySortColumns.flatMap((column) =>
                sortDirections.map(
                  (direction) =>
                    [
                      `${column}:${direction}`,
                      entryLabels.sortOption(
                        entryLabels.columns[column],
                        direction,
                      ),
                    ] as const,
                ),
              )}
              value={sortValueOf(sort)}
            />
          </ViewSettingsSection>
        </>
      ) : null}
      {hasFilters ? (
        <>
          <MenuSeparator />
          <ViewSettingsSection label={labels.filters}>
            {onSituationFilterChange ? (
              <FilterRadioSubmenu
                clearLabel={entryLabels.allSituations}
                icon={CircleHalfIcon}
                label={entryLabels.columns.situation}
                onValueChange={(value) =>
                  onSituationFilterChange(pick(finance3Situations, value))
                }
                options={finance3Situations.map(
                  (item) => [item, entryLabels.situations[item]] as const,
                )}
                value={situationFilter ?? ''}
              />
            ) : null}
            {onTypeFilterChange ? (
              <FilterRadioSubmenu
                clearLabel={entryLabels.allTypes}
                icon={TagIcon}
                label={entryLabels.type}
                onValueChange={(value) =>
                  onTypeFilterChange(pick(finance3EntryTypes, value))
                }
                options={finance3EntryTypes.map(
                  (item) => [item, entryLabels.types[item]] as const,
                )}
                value={typeFilter ?? ''}
              />
            ) : null}
            {onFeeTypeFilterChange ? (
              <FilterRadioSubmenu
                clearLabel={entryLabels.allFeeTypes}
                icon={ScalesIcon}
                label={entryLabels.columns.feeType}
                onValueChange={(value) =>
                  onFeeTypeFilterChange(pick(finance3FeeTypes, value))
                }
                options={finance3FeeTypes.map(
                  (item) => [item, entryLabels.feeTypes[item]] as const,
                )}
                value={feeTypeFilter ?? ''}
              />
            ) : null}
            {showAccount && onAccountFilterChange ? (
              <FilterRadioSubmenu
                clearLabel={entryLabels.allAccounts}
                icon={BankIcon}
                label={entryLabels.columns.account}
                loading={accountsLoading}
                onValueChange={(value) => onAccountFilterChange(value || null)}
                options={accounts.map(
                  (account) => [account.id, account.label] as const,
                )}
                value={accountFilter ?? ''}
              />
            ) : null}
          </ViewSettingsSection>
        </>
      ) : null}
    </>
  )
}
