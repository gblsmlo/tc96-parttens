import {
  ClockCounterClockwiseIcon,
  FunnelSimpleIcon,
  type Icon as PhosphorIcon,
  RowsIcon,
  ShapesIcon,
  SortAscendingIcon,
  StackIcon,
  TextTIcon,
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
  Documents4CreateMenu,
  type Documents4CreateMenuProps,
  hasDocuments4Create,
} from './documents-4-create-menu'
import {
  documents4GroupBys,
  documents4Modes,
  documents4NoGroup,
  documents4Sorts,
  documents4TypeIcons,
  documents4Types,
} from './documents-4-options'
import type {
  Documents4GroupBy,
  Documents4Labels,
  Documents4Mode,
  Documents4Person,
  Documents4Sort,
  Documents4Type,
} from './types'

export interface Documents4ToolbarProps
  extends Omit<Documents4CreateMenuProps, 'labels'> {
  groupBy: Documents4GroupBy | null
  labels: Documents4Labels
  loading: boolean
  mode: Documents4Mode
  onGroupByChange: (groupBy: Documents4GroupBy | null) => void
  onModeChange: (mode: Documents4Mode) => void
  onOwnerFilterChange?: (ownerId: string | null) => void
  onSortChange?: (sort: Documents4Sort) => void
  onTypeFilterChange?: (type: Documents4Type | null) => void
  ownerFilter: string | null
  people: readonly Documents4Person[]
  sort: Documents4Sort
  typeFilter: Documents4Type | null
  viewSwitcher: ReactNode
}

type Documents4GroupOption = Documents4GroupBy | typeof documents4NoGroup

const groupOptions: readonly Documents4GroupOption[] = [
  documents4NoGroup,
  ...documents4GroupBys,
]

const sortIcons = {
  name: TextTIcon,
  owner: UserIcon,
  type: ShapesIcon,
  updated: ClockCounterClockwiseIcon,
} as const satisfies Record<Documents4Sort, PhosphorIcon>

const groupIcons = {
  none: RowsIcon,
  owner: UserIcon,
  type: ShapesIcon,
} as const satisfies Record<Documents4GroupOption, PhosphorIcon>

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

interface Documents4MenuProps {
  children: ReactNode
  icon: PhosphorIcon
  label: string
  trailing?: ReactNode
}

function Documents4Menu({
  children,
  icon: Icon,
  label,
  trailing,
}: Readonly<Documents4MenuProps>) {
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

interface Documents4RadioMenuProps<TValue extends string> {
  icon: PhosphorIcon
  label: string
  onValueChange: (value: TValue) => void
  options: readonly ViewSettingsOption<TValue>[]
  section: string
  value: TValue
}

function Documents4RadioMenu<TValue extends string>({
  icon,
  label,
  onValueChange,
  options,
  section,
  value,
}: Readonly<Documents4RadioMenuProps<TValue>>) {
  return (
    <Documents4Menu icon={icon} label={label}>
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
    </Documents4Menu>
  )
}

export function Documents4Toolbar({
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
}: Readonly<Documents4ToolbarProps>) {
  const showType = Boolean(onTypeFilterChange)
  const showOwner = Boolean(onOwnerFilterChange) && people.length > 0
  const hasFilters = showType || showOwner
  const activeFilterCount =
    (showType && typeFilter ? 1 : 0) + (showOwner && ownerFilter ? 1 : 0)

  return (
    <CollectionToolbar
      aria-label={labels.toolbar}
      className="min-h-14 flex-wrap gap-y-3"
      left={viewSwitcher}
      right={
        loading ? undefined : (
          <>
            {hasFilters ? (
              <Documents4Menu
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
                  {showType ? (
                    <ViewSettingsSubmenu<Documents4Type>
                      icon={ShapesIcon}
                      label={labels.filterBy.type}
                      onValueChange={(value) => onTypeFilterChange?.(value)}
                      options={documents4Types.map((type) =>
                        iconOption(
                          type,
                          labels.types[type],
                          documents4TypeIcons[type],
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
                <MenuSeparator />
                <MenuItem
                  disabled={activeFilterCount === 0}
                  onClick={() => {
                    if (showType) onTypeFilterChange?.(null)
                    if (showOwner) onOwnerFilterChange?.(null)
                  }}
                >
                  {labels.clearFilters}
                </MenuItem>
              </Documents4Menu>
            ) : null}
            <Documents4RadioMenu<Documents4Mode>
              icon={dataCollectionModeIcons[mode]}
              label={labels.layout}
              onValueChange={onModeChange}
              options={documents4Modes.map((item) =>
                iconOption(
                  item,
                  labels.modes[item],
                  dataCollectionModeIcons[item],
                ),
              )}
              section={labels.layoutBy}
              value={mode}
            />
            {onSortChange ? (
              <Documents4RadioMenu<Documents4Sort>
                icon={SortAscendingIcon}
                label={labels.sort}
                onValueChange={onSortChange}
                options={documents4Sorts.map((item) =>
                  iconOption(item, labels.sorts[item], sortIcons[item]),
                )}
                section={labels.sortBy}
                value={sort}
              />
            ) : null}
            {mode === 'gallery' ? null : (
              <Documents4RadioMenu<Documents4GroupOption>
                icon={StackIcon}
                label={labels.group}
                onValueChange={(value) =>
                  onGroupByChange(pick(documents4GroupBys, value))
                }
                options={groupOptions.map((item) =>
                  iconOption(item, labels.groupings[item], groupIcons[item]),
                )}
                section={labels.groupBy}
                value={groupBy ?? documents4NoGroup}
              />
            )}
            {hasDocuments4Create({ onCreateLink, onCreateNote, onUpload }) ? (
              <Documents4CreateMenu
                accept={accept}
                labels={labels}
                onCreateLink={onCreateLink}
                onCreateNote={onCreateNote}
                onUpload={onUpload}
              />
            ) : null}
          </>
        )
      }
    />
  )
}
