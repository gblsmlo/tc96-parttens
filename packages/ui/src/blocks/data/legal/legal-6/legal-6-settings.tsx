import { ArrowsDownUpIcon, ShapesIcon, UserIcon } from '@phosphor-icons/react'
import { FilterRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { SortRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-sort-submenu'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components/view-settings'
import { legal6Sorts } from './legal-6-options'
import type {
  Legal6Kind,
  Legal6Labels,
  Legal6Person,
  Legal6Sort,
} from './types'

export interface Legal6SettingsProps {
  kindFilter: string | null
  kinds: readonly Legal6Kind[]
  kindsLoading: boolean
  labels: Legal6Labels
  onKindFilterChange: (kindId: string | null) => void
  onOwnerFilterChange: (ownerId: string | null) => void
  onSortChange: (sort: Legal6Sort) => void
  ownerFilter: string | null
  owners: readonly Legal6Person[]
  ownersLoading: boolean
  sort: Legal6Sort
}

export function Legal6Settings({
  kindFilter,
  kinds,
  kindsLoading,
  labels,
  onKindFilterChange,
  onOwnerFilterChange,
  onSortChange,
  ownerFilter,
  owners,
  ownersLoading,
  sort,
}: Readonly<Legal6SettingsProps>) {
  return (
    <>
      <ViewSettingsSection label={labels.sort}>
        <SortRadioSubmenu
          icon={ArrowsDownUpIcon}
          label={labels.sortBy}
          onValueChange={onSortChange}
          options={legal6Sorts.map(
            (item) => [item, labels.sorts[item]] as const,
          )}
          value={sort}
        />
      </ViewSettingsSection>
      <ViewSettingsSection label={labels.filters}>
        <FilterRadioSubmenu
          clearLabel={labels.allOwners}
          icon={UserIcon}
          label={labels.owner}
          loading={ownersLoading}
          onValueChange={(value) => onOwnerFilterChange(value || null)}
          options={owners.map((owner) => [owner.id, owner.label] as const)}
          value={ownerFilter ?? ''}
        />
        <FilterRadioSubmenu
          clearLabel={labels.allKinds}
          icon={ShapesIcon}
          label={labels.kind}
          loading={kindsLoading}
          onValueChange={(value) => onKindFilterChange(value || null)}
          options={kinds.map((kind) => [kind.id, kind.label] as const)}
          value={kindFilter ?? ''}
        />
      </ViewSettingsSection>
    </>
  )
}
