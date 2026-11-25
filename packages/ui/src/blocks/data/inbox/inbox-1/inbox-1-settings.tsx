import {
  ArrowsDownUpIcon,
  ClockIcon,
  EnvelopeOpenIcon,
  TagIcon,
} from '@phosphor-icons/react'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { SortRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-sort-submenu'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components/view-settings'
import {
  inbox1KindsOf,
  inbox1ReadFilters,
  inbox1ReceivedFilters,
  inbox1Sorts,
} from './inbox-1-options'
import type {
  Inbox1Category,
  Inbox1Kind,
  Inbox1Labels,
  Inbox1ReadFilter,
  Inbox1ReceivedFilter,
  Inbox1Sort,
} from './types'

export interface Inbox1SettingsProps {
  category: Inbox1Category | null
  kindFilter: Inbox1Kind | null
  labels: Inbox1Labels
  onKindFilterChange: (kind: Inbox1Kind | null) => void
  onReadFilterChange: (filter: Inbox1ReadFilter | null) => void
  onReceivedFilterChange: (filter: Inbox1ReceivedFilter | null) => void
  onSortChange: (sort: Inbox1Sort) => void
  readFilter: Inbox1ReadFilter | null
  receivedFilter: Inbox1ReceivedFilter | null
  sort: Inbox1Sort
}

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

export function Inbox1Settings({
  category,
  kindFilter,
  labels,
  onKindFilterChange,
  onReadFilterChange,
  onReceivedFilterChange,
  onSortChange,
  readFilter,
  receivedFilter,
  sort,
}: Readonly<Inbox1SettingsProps>) {
  const kinds = inbox1KindsOf(category)

  return (
    <>
      <ViewSettingsSection label={labels.sort}>
        <SortRadioSubmenu<Inbox1Sort>
          icon={ArrowsDownUpIcon}
          label={labels.sortBy}
          onValueChange={onSortChange}
          options={inbox1Sorts.map(
            (item) => [item, labels.sorts[item]] as const,
          )}
          value={sort}
        />
      </ViewSettingsSection>
      <ViewSettingsSection label={labels.filters}>
        <FilterRadioSubmenu
          clearLabel={labels.allReadStates}
          icon={EnvelopeOpenIcon}
          label={labels.readFilter}
          onValueChange={(value) =>
            onReadFilterChange(pick(inbox1ReadFilters, value))
          }
          options={inbox1ReadFilters.map(
            (item) => [item, labels.readFilters[item]] as const,
          )}
          value={readFilter ?? ''}
        />
        <FilterRadioSubmenu
          clearLabel={labels.allKinds}
          icon={TagIcon}
          label={labels.kind}
          onValueChange={(value) => onKindFilterChange(pick(kinds, value))}
          options={kinds.map((item) => [item, labels.kinds[item]] as const)}
          value={kindFilter ?? ''}
        />
        <FilterRadioSubmenu
          clearLabel={labels.anyDate}
          icon={ClockIcon}
          label={labels.receivedFilter}
          onValueChange={(value) =>
            onReceivedFilterChange(pick(inbox1ReceivedFilters, value))
          }
          options={inbox1ReceivedFilters.map(
            (item) => [item, labels.receivedFilters[item]] as const,
          )}
          value={receivedFilter ?? ''}
        />
      </ViewSettingsSection>
    </>
  )
}
