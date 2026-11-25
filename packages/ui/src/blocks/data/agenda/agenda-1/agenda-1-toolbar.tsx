import {
  CalendarBlankIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ListBulletsIcon,
  TagIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { MenuSeparator } from '@tc96/ui/menu'
import {
  FilterCheckboxSubmenu,
  FilterRadioSubmenu,
} from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { SortRadioSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-sort-submenu'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings/components/view-settings'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import { DataCollectionToolbarButton } from '../../shared/collection/data-collection-toolbar'
import {
  agenda1Groupings,
  agenda1Kinds,
  agenda1Modes,
  agenda1Periods,
} from './agenda-1-options'
import type {
  Agenda1GroupBy,
  Agenda1Kind,
  Agenda1Labels,
  Agenda1Mode,
  Agenda1Period,
  Agenda1Person,
} from './types'

export interface Agenda1ToolbarProps {
  groupBy: Agenda1GroupBy | null
  kindFilter: readonly Agenda1Kind[]
  labels: Agenda1Labels
  mode: Agenda1Mode
  onCreate?: () => void
  onGroupByChange: (groupBy: Agenda1GroupBy | null) => void
  onKindFilterChange?: (kinds: Agenda1Kind[]) => void
  onModeChange: (mode: Agenda1Mode) => void
  onNext: () => void
  onOwnerFilterChange: (ownerId: string | null) => void
  onPeriodChange: (period: Agenda1Period) => void
  onPrevious: () => void
  onSavePreference?: () => void
  onToday: () => void
  ownerFilter: string | null
  owners: readonly Agenda1Person[]
  ownersLoading: boolean
  period: Agenda1Period
  periodTitle: string
}

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

export function Agenda1Toolbar({
  groupBy,
  kindFilter,
  labels,
  mode,
  onCreate,
  onGroupByChange,
  onKindFilterChange,
  onModeChange,
  onNext,
  onOwnerFilterChange,
  onPeriodChange,
  onPrevious,
  onSavePreference,
  onToday,
  ownerFilter,
  owners,
  ownersLoading,
  period,
  periodTitle,
}: Readonly<Agenda1ToolbarProps>) {
  const showKinds = Boolean(onKindFilterChange)
  const showOwner = owners.length > 0 || ownersLoading
  const showGrouping = mode !== 'calendar'
  const hasFilters = showKinds || showOwner
  const activeFilterCount =
    (showKinds && kindFilter.length > 0 ? 1 : 0) +
    (showOwner && ownerFilter ? 1 : 0)

  return (
    <DataCollectionSettingsToolbar<Agenda1Mode>
      actions={
        onCreate ? (
          <DataCollectionToolbarButton onClick={onCreate} variant="default">
            {labels.create}
          </DataCollectionToolbarButton>
        ) : null
      }
      activeFilterCount={activeFilterCount}
      description={periodTitle}
      labels={labels}
      loading={false}
      mode={mode}
      modeLabels={labels.modes}
      modes={agenda1Modes}
      onClearFilters={() => {
        if (showKinds) onKindFilterChange?.([])
        if (showOwner) onOwnerFilterChange(null)
      }}
      onModeChange={onModeChange}
      onSavePreference={onSavePreference}
      savePreferenceLabel={labels.savePreference}
      search={
        <>
          <DataCollectionToolbarButton onClick={onToday}>
            {labels.today}
          </DataCollectionToolbarButton>
          <ToolbarButton
            aria-label={labels.previous}
            onClick={onPrevious}
            render={<Button size="icon" type="button" variant="outline" />}
          >
            <CaretLeftIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton
            aria-label={labels.next}
            onClick={onNext}
            render={<Button size="icon" type="button" variant="outline" />}
          >
            <CaretRightIcon aria-hidden="true" />
          </ToolbarButton>
        </>
      }
    >
      <ViewSettingsSection label={labels.period}>
        <SortRadioSubmenu<Agenda1Period>
          icon={CalendarBlankIcon}
          label={labels.period}
          onValueChange={onPeriodChange}
          options={agenda1Periods.map(
            (item) => [item, labels.periods[item]] as const,
          )}
          value={period}
        />
      </ViewSettingsSection>
      {showGrouping ? (
        <>
          <MenuSeparator />
          <ViewSettingsSection label={labels.group}>
            <FilterRadioSubmenu
              clearLabel={labels.noGrouping}
              icon={ListBulletsIcon}
              label={labels.groupBy}
              onValueChange={(value) =>
                onGroupByChange(pick(agenda1Groupings, value))
              }
              options={agenda1Groupings.map(
                (item) => [item, labels.groupings[item]] as const,
              )}
              value={groupBy ?? ''}
            />
          </ViewSettingsSection>
        </>
      ) : null}
      {hasFilters ? (
        <>
          <MenuSeparator />
          <ViewSettingsSection label={labels.filters}>
            {showKinds ? (
              <FilterCheckboxSubmenu<Agenda1Kind>
                clearLabel={labels.allKinds}
                icon={TagIcon}
                label={labels.kind}
                onValueChange={(values) =>
                  onKindFilterChange?.(
                    agenda1Kinds.filter((kind) => values.includes(kind)),
                  )
                }
                options={agenda1Kinds.map(
                  (item) => [item, labels.kinds[item]] as const,
                )}
                value={kindFilter}
              />
            ) : null}
            {showOwner ? (
              <FilterRadioSubmenu
                clearLabel={labels.allOwners}
                icon={UserIcon}
                label={labels.owner}
                loading={ownersLoading}
                onValueChange={(value) => onOwnerFilterChange(value || null)}
                options={owners.map((item) => [item.id, item.label] as const)}
                value={ownerFilter ?? ''}
              />
            ) : null}
          </ViewSettingsSection>
        </>
      ) : null}
    </DataCollectionSettingsToolbar>
  )
}
