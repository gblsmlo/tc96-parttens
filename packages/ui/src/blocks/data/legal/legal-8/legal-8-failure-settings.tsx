import { ArrowsDownUpIcon, SignpostIcon } from '@phosphor-icons/react'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { SortRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-sort-submenu'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components/view-settings'
import { legal8FailureOrigins, legal8Sorts } from './legal-8-options'
import type { Legal8FailureOrigin, Legal8Labels, Legal8Sort } from './types'

export interface Legal8FailureSettingsProps {
  labels: Legal8Labels
  onOriginFilterChange: (origin: Legal8FailureOrigin | null) => void
  onSortChange: (sort: Legal8Sort) => void
  originFilter: Legal8FailureOrigin | null
  sort: Legal8Sort
}

export function Legal8FailureSettings({
  labels,
  onOriginFilterChange,
  onSortChange,
  originFilter,
  sort,
}: Readonly<Legal8FailureSettingsProps>) {
  return (
    <>
      <ViewSettingsSection label={labels.sort}>
        <SortRadioSubmenu
          icon={ArrowsDownUpIcon}
          label={labels.sortBy}
          onValueChange={onSortChange}
          options={legal8Sorts.map(
            (item) => [item, labels.sorts[item]] as const,
          )}
          value={sort}
        />
      </ViewSettingsSection>
      <ViewSettingsSection label={labels.filters}>
        <FilterRadioSubmenu
          clearLabel={labels.allOrigins}
          icon={SignpostIcon}
          label={labels.origin}
          onValueChange={(value) =>
            onOriginFilterChange(
              legal8FailureOrigins.find((origin) => origin === value) ?? null,
            )
          }
          options={legal8FailureOrigins.map(
            (origin) => [origin, labels.failureOrigins[origin]] as const,
          )}
          value={originFilter ?? ''}
        />
      </ViewSettingsSection>
    </>
  )
}
