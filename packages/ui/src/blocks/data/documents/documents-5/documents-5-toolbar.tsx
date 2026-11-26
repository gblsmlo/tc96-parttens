import {
  ClockCounterClockwiseIcon,
  type Icon as PhosphorIcon,
  RowsIcon,
  ShapesIcon,
  SortAscendingIcon,
  StackIcon,
  TextTIcon,
  UserCircleIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { MenuSeparator } from '@tc96/ui/menu'
import {
  type ViewSettingsOption,
  ViewSettingsSection,
  ViewSettingsSubmenu,
} from '@tc96/ui/patterns/view-settings/components'
import type { ReactNode } from 'react'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import {
  Documents5CreateMenu,
  type Documents5CreateMenuProps,
  hasDocuments5Create,
} from './documents-5-create-menu'
import {
  documents5GroupBys,
  documents5Modes,
  documents5NoGroup,
  documents5Sorts,
  documents5TypeIcons,
  documents5Types,
} from './documents-5-options'
import type {
  Documents5GroupBy,
  Documents5Labels,
  Documents5Mode,
  Documents5Person,
  Documents5Sort,
  Documents5Type,
} from './types'

export interface Documents5ToolbarProps
  extends Omit<Documents5CreateMenuProps, 'labels'> {
  groupBy: Documents5GroupBy | null
  labels: Documents5Labels
  loading: boolean
  mode: Documents5Mode
  onGroupByChange: (groupBy: Documents5GroupBy | null) => void
  onModeChange: (mode: Documents5Mode) => void
  onOwnerFilterChange?: (ownerId: string | null) => void
  onSortChange?: (sort: Documents5Sort) => void
  onTypeFilterChange?: (type: Documents5Type | null) => void
  ownerFilter: string | null
  people: readonly Documents5Person[]
  sort: Documents5Sort
  typeFilter: Documents5Type | null
  viewSwitcher: ReactNode
}

type Documents5GroupOption = Documents5GroupBy | typeof documents5NoGroup

const groupOptions: readonly Documents5GroupOption[] = [
  documents5NoGroup,
  ...documents5GroupBys,
]

const sortIcons = {
  name: TextTIcon,
  owner: UserIcon,
  type: ShapesIcon,
  updated: ClockCounterClockwiseIcon,
} as const satisfies Record<Documents5Sort, PhosphorIcon>

const groupIcons = {
  none: RowsIcon,
  owner: UserIcon,
  type: ShapesIcon,
} as const satisfies Record<Documents5GroupOption, PhosphorIcon>

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string,
): TValue | null => values.find((item) => item === value) ?? null

const iconOption = <TValue extends string>(
  value: TValue,
  label: string,
  Icon: PhosphorIcon,
): ViewSettingsOption<TValue> => ({
  icon: <Icon aria-hidden="true" />,
  label,
  value,
})

export function Documents5Toolbar({
  accept,
  groupBy,
  labels,
  loading,
  mode,
  onCreateLink,
  onCreateNote,
  onGroupByChange,
  onModeChange,
  onOwnerFilterChange,
  onSortChange,
  onTypeFilterChange,
  onUpload,
  ownerFilter,
  people,
  sort,
  typeFilter,
  viewSwitcher,
}: Readonly<Documents5ToolbarProps>) {
  const showType = Boolean(onTypeFilterChange)
  const showOwner = Boolean(onOwnerFilterChange) && people.length > 0
  const showGroup = mode !== 'gallery'
  const activeFilterCount =
    (showType && typeFilter ? 1 : 0) + (showOwner && ownerFilter ? 1 : 0)

  return (
    <DataCollectionSettingsToolbar<Documents5Mode>
      actions={
        hasDocuments5Create({ onCreateLink, onCreateNote, onUpload }) ? (
          <Documents5CreateMenu
            accept={accept}
            labels={labels}
            onCreateLink={onCreateLink}
            onCreateNote={onCreateNote}
            onUpload={onUpload}
          />
        ) : undefined
      }
      activeFilterCount={activeFilterCount}
      labels={labels}
      left={viewSwitcher}
      loading={loading}
      mode={mode}
      modeLabels={labels.modes}
      modes={documents5Modes}
      onClearFilters={() => {
        if (showType) onTypeFilterChange?.(null)
        if (showOwner) onOwnerFilterChange?.(null)
      }}
      onModeChange={onModeChange}
    >
      {onSortChange || showGroup ? (
        <ViewSettingsSection label={labels.display}>
          {onSortChange ? (
            <ViewSettingsSubmenu<Documents5Sort>
              icon={SortAscendingIcon}
              label={labels.sortBy}
              onValueChange={onSortChange}
              options={documents5Sorts.map((item) =>
                iconOption(item, labels.sorts[item], sortIcons[item]),
              )}
              value={sort}
            />
          ) : null}
          {showGroup ? (
            <ViewSettingsSubmenu<Documents5GroupOption>
              icon={StackIcon}
              label={labels.groupBy}
              onValueChange={(value) =>
                onGroupByChange(pick(documents5GroupBys, value))
              }
              options={groupOptions.map((item) =>
                iconOption(item, labels.groupings[item], groupIcons[item]),
              )}
              value={groupBy ?? documents5NoGroup}
            />
          ) : null}
        </ViewSettingsSection>
      ) : null}
      {showType || showOwner ? (
        <>
          {onSortChange || showGroup ? <MenuSeparator /> : null}
          <ViewSettingsSection label={labels.filters}>
            {showType ? (
              <ViewSettingsSubmenu<Documents5Type>
                icon={ShapesIcon}
                label={labels.filterBy.type}
                onValueChange={(value) => onTypeFilterChange?.(value)}
                options={documents5Types.map((type) =>
                  iconOption(
                    type,
                    labels.types[type],
                    documents5TypeIcons[type],
                  ),
                )}
                value={typeFilter ?? undefined}
              />
            ) : null}
            {showOwner ? (
              <ViewSettingsSubmenu
                icon={UserIcon}
                label={labels.filterBy.owner}
                onValueChange={(value) => onOwnerFilterChange?.(value)}
                options={people.map((person) =>
                  iconOption(person.id, person.label, UserCircleIcon),
                )}
                value={ownerFilter ?? undefined}
              />
            ) : null}
          </ViewSettingsSection>
        </>
      ) : null}
    </DataCollectionSettingsToolbar>
  )
}
