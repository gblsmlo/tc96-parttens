import {
  ArchiveIcon,
  CalendarDotsIcon,
  CalendarPlusIcon,
  CircleIcon,
  ClockCounterClockwiseIcon,
  CurrencyCircleDollarIcon,
  FunnelSimpleIcon,
  MegaphoneIcon,
  type Icon as PhosphorIcon,
  SortAscendingIcon,
  StackIcon,
  TagIcon,
  UserCircleIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Action } from '@tc96/ui/patterns/collection/shared/components/collection-action'
import { FilterCheckboxSubmenu } from '@tc96/ui/patterns/collection/shared/components/collection-filter-submenu'
import { CollectionToolbar } from '@tc96/ui/patterns/toolbar/components/collection-toolbar'
import {
  type ViewSettingsOption,
  ViewSettingsSection,
  ViewSettingsSubmenu,
} from '@tc96/ui/patterns/view-settings/components'
import { ToolbarButton } from '@tc96/ui/toolbar'
import type { ReactNode } from 'react'
import { dataCollectionModeIcons } from '../../shared/collection/data-collection-toolbar'
import {
  crm3ArchivedChoices,
  crm3Groupings,
  crm3Modes,
  crm3Origins,
  crm3Sorts,
} from './crm-3-options'
import type {
  Crm3Archived,
  Crm3GroupBy,
  Crm3Labels,
  Crm3Mode,
  Crm3Option,
  Crm3Origin,
  Crm3Person,
  Crm3Sort,
  Crm3Stage,
} from './types'

export interface Crm3ToolbarProps {
  archivedFilter: Crm3Archived | null
  groupBy: Crm3GroupBy
  labels: Crm3Labels
  loading: boolean
  mode: Crm3Mode
  onArchivedFilterChange?: (archived: Crm3Archived | null) => void
  onCreate?: () => void
  onGroupByChange: (groupBy: Crm3GroupBy) => void
  onModeChange: (mode: Crm3Mode) => void
  onOriginFilterChange?: (origin: Crm3Origin | null) => void
  onOwnerFilterChange?: (ownerId: string | null) => void
  onSortChange?: (sort: Crm3Sort) => void
  onStageFilterChange?: (stageId: string | null) => void
  onTagFilterChange?: (tagIds: string[]) => void
  originFilter: Crm3Origin | null
  ownerFilter: string | null
  owners: readonly Crm3Person[]
  sort: Crm3Sort
  stageFilter: string | null
  stages: readonly Crm3Stage[]
  tagFilter: readonly string[]
  tags: readonly Crm3Option[]
  viewSwitcher: ReactNode
}

const sortIcons = {
  created: CalendarPlusIcon,
  'next-action': CalendarDotsIcon,
  updated: ClockCounterClockwiseIcon,
  value: CurrencyCircleDollarIcon,
} as const satisfies Record<Crm3Sort, PhosphorIcon>

const groupIcons = {
  origin: MegaphoneIcon,
  owner: UserIcon,
  stage: CircleIcon,
} as const satisfies Record<Crm3GroupBy, PhosphorIcon>

const iconOption = <TValue extends string>(
  value: TValue,
  label: string,
  Icon: PhosphorIcon,
): ViewSettingsOption<TValue> => ({
  icon: <Icon aria-hidden="true" />,
  label,
  value,
})

interface Crm3MenuProps {
  children: ReactNode
  icon: PhosphorIcon
  label: string
  trailing?: ReactNode
}

function Crm3Menu({
  children,
  icon: Icon,
  label,
  trailing,
}: Readonly<Crm3MenuProps>) {
  return (
    <Menu>
      <MenuTrigger
        render={
          <ToolbarButton
            render={
              <Button
                aria-label={label}
                size={trailing ? 'default' : 'icon'}
                type="button"
                variant="ghost"
              />
            }
          />
        }
      >
        <Icon aria-hidden="true" />
        {trailing}
      </MenuTrigger>
      <MenuPopup align="end">{children}</MenuPopup>
    </Menu>
  )
}

interface Crm3RadioMenuProps<TValue extends string> {
  icon: PhosphorIcon
  label: string
  onValueChange: (value: TValue) => void
  options: readonly ViewSettingsOption<TValue>[]
  section: string
  value: TValue
}

function Crm3RadioMenu<TValue extends string>({
  icon,
  label,
  onValueChange,
  options,
  section,
  value,
}: Readonly<Crm3RadioMenuProps<TValue>>) {
  return (
    <Crm3Menu icon={icon} label={label}>
      <ViewSettingsSection label={section}>
        <MenuRadioGroup
          onValueChange={(next: TValue) => onValueChange(next)}
          value={value}
        >
          {options.map((option) => (
            <MenuRadioItem closeOnClick key={option.value} value={option.value}>
              {option.icon}
              {option.label}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </ViewSettingsSection>
    </Crm3Menu>
  )
}

export function Crm3Toolbar({
  archivedFilter,
  groupBy,
  labels,
  loading,
  mode,
  onArchivedFilterChange,
  onCreate,
  onGroupByChange,
  onModeChange,
  onOriginFilterChange,
  onOwnerFilterChange,
  onSortChange,
  onStageFilterChange,
  onTagFilterChange,
  originFilter,
  ownerFilter,
  owners,
  sort,
  stageFilter,
  stages,
  tagFilter,
  tags,
  viewSwitcher,
}: Readonly<Crm3ToolbarProps>) {
  const isBoard = mode === 'kanban'
  const showStage = Boolean(onStageFilterChange) && stages.length > 0
  const showOwner = Boolean(onOwnerFilterChange) && owners.length > 0
  const showOrigin = Boolean(onOriginFilterChange)
  const showTags = Boolean(onTagFilterChange) && tags.length > 0
  const showArchived = Boolean(onArchivedFilterChange) && !isBoard
  const archivedActive = Boolean(archivedFilter && archivedFilter !== 'exclude')
  const hasFilters =
    showStage || showOwner || showOrigin || showTags || showArchived
  const activeFilterCount =
    (showStage && stageFilter ? 1 : 0) +
    (showOwner && ownerFilter ? 1 : 0) +
    (showOrigin && originFilter ? 1 : 0) +
    (showTags && tagFilter.length > 0 ? 1 : 0) +
    (showArchived && archivedActive ? 1 : 0)

  return (
    <CollectionToolbar
      aria-label={labels.toolbar}
      className="min-h-14 flex-wrap gap-y-3"
      left={viewSwitcher}
      right={
        loading ? undefined : (
          <>
            {hasFilters ? (
              <Crm3Menu
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
                <ViewSettingsSection label={labels.filterProperties}>
                  {showStage ? (
                    <ViewSettingsSubmenu
                      icon={CircleIcon}
                      label={labels.filterBy.stage}
                      onValueChange={(value) => onStageFilterChange?.(value)}
                      options={stages.map((stage) => ({
                        label: stage.label,
                        value: stage.id,
                      }))}
                      value={stageFilter ?? undefined}
                    />
                  ) : null}
                  {showOwner ? (
                    <ViewSettingsSubmenu
                      icon={UserIcon}
                      label={labels.filterBy.owner}
                      onValueChange={(value) => onOwnerFilterChange?.(value)}
                      options={owners.map((owner) =>
                        iconOption(owner.id, owner.label, UserCircleIcon),
                      )}
                      value={ownerFilter ?? undefined}
                    />
                  ) : null}
                  {showOrigin ? (
                    <ViewSettingsSubmenu<Crm3Origin>
                      icon={MegaphoneIcon}
                      label={labels.filterBy.origin}
                      onValueChange={(value) => onOriginFilterChange?.(value)}
                      options={crm3Origins.map((origin) => ({
                        label: labels.origins[origin],
                        value: origin,
                      }))}
                      value={originFilter ?? undefined}
                    />
                  ) : null}
                  {showTags ? (
                    <FilterCheckboxSubmenu
                      clearLabel={labels.allTags}
                      icon={TagIcon}
                      label={labels.filterBy.tags}
                      onValueChange={(value) => onTagFilterChange?.(value)}
                      options={tags.map((tag) => [tag.id, tag.label] as const)}
                      value={tagFilter}
                    />
                  ) : null}
                  {showArchived ? (
                    <ViewSettingsSubmenu<Crm3Archived>
                      icon={ArchiveIcon}
                      label={labels.filterBy.archived}
                      onValueChange={(value) =>
                        onArchivedFilterChange?.(
                          value === 'exclude' ? null : value,
                        )
                      }
                      options={crm3ArchivedChoices.map((choice) => ({
                        label: labels.archivedOptions[choice],
                        value: choice,
                      }))}
                      value={archivedFilter ?? 'exclude'}
                    />
                  ) : null}
                </ViewSettingsSection>
                <MenuSeparator />
                <MenuItem
                  disabled={activeFilterCount === 0}
                  onClick={() => {
                    if (showStage) onStageFilterChange?.(null)
                    if (showOwner) onOwnerFilterChange?.(null)
                    if (showOrigin) onOriginFilterChange?.(null)
                    if (showTags) onTagFilterChange?.([])
                    if (showArchived) onArchivedFilterChange?.(null)
                  }}
                >
                  {labels.clearFilters}
                </MenuItem>
              </Crm3Menu>
            ) : null}
            <Crm3RadioMenu<Crm3Mode>
              icon={dataCollectionModeIcons[mode]}
              label={labels.layout}
              onValueChange={onModeChange}
              options={crm3Modes.map((item) =>
                iconOption(
                  item,
                  labels.modes[item],
                  dataCollectionModeIcons[item],
                ),
              )}
              section={labels.layoutBy}
              value={mode}
            />
            {!isBoard && onSortChange ? (
              <Crm3RadioMenu<Crm3Sort>
                icon={SortAscendingIcon}
                label={labels.sort}
                onValueChange={onSortChange}
                options={crm3Sorts.map((item) =>
                  iconOption(item, labels.sorts[item], sortIcons[item]),
                )}
                section={labels.sortBy}
                value={sort}
              />
            ) : null}
            {isBoard ? (
              <Crm3RadioMenu<Crm3GroupBy>
                icon={StackIcon}
                label={labels.group}
                onValueChange={onGroupByChange}
                options={crm3Groupings.map((item) =>
                  iconOption(item, labels.groupings[item], groupIcons[item]),
                )}
                section={labels.groupBy}
                value={groupBy}
              />
            ) : null}
            {onCreate ? (
              <Action label={labels.create} onClick={onCreate} />
            ) : null}
          </>
        )
      }
    />
  )
}
