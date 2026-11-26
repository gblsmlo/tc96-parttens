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
  Documents2CreateMenu,
  type Documents2CreateMenuProps,
  hasDocuments2Create,
} from './documents-2-create-menu'
import {
  documents2GroupBys,
  documents2Modes,
  documents2NoGroup,
  documents2Sorts,
  documents2TypeIcons,
  documents2Types,
} from './documents-2-options'
import type {
  Documents2GroupBy,
  Documents2Labels,
  Documents2Mode,
  Documents2Person,
  Documents2Sort,
  Documents2Type,
} from './types'

export interface Documents2ToolbarProps
  extends Omit<Documents2CreateMenuProps, 'labels'> {
  groupBy: Documents2GroupBy | null
  labels: Documents2Labels
  loading: boolean
  mode: Documents2Mode
  onGroupByChange: (groupBy: Documents2GroupBy | null) => void
  onModeChange: (mode: Documents2Mode) => void
  onOwnerFilterChange?: (ownerId: string | null) => void
  onSortChange?: (sort: Documents2Sort) => void
  onTypeFilterChange?: (type: Documents2Type | null) => void
  ownerFilter: string | null
  people: readonly Documents2Person[]
  sort: Documents2Sort
  typeFilter: Documents2Type | null
  viewSwitcher: ReactNode
}

type Documents2GroupOption = Documents2GroupBy | typeof documents2NoGroup

const groupOptions: readonly Documents2GroupOption[] = [
  documents2NoGroup,
  ...documents2GroupBys,
]

const sortIcons = {
  name: TextTIcon,
  owner: UserIcon,
  type: ShapesIcon,
  updated: ClockCounterClockwiseIcon,
} as const satisfies Record<Documents2Sort, PhosphorIcon>

const groupIcons = {
  none: RowsIcon,
  owner: UserIcon,
  type: ShapesIcon,
} as const satisfies Record<Documents2GroupOption, PhosphorIcon>

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

interface Documents2MenuProps {
  children: ReactNode
  icon: PhosphorIcon
  label: string
  trailing?: ReactNode
}

function Documents2Menu({
  children,
  icon: Icon,
  label,
  trailing,
}: Readonly<Documents2MenuProps>) {
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

interface Documents2RadioMenuProps<TValue extends string> {
  icon: PhosphorIcon
  label: string
  onValueChange: (value: TValue) => void
  options: readonly ViewSettingsOption<TValue>[]
  section: string
  value: TValue
}

function Documents2RadioMenu<TValue extends string>({
  icon,
  label,
  onValueChange,
  options,
  section,
  value,
}: Readonly<Documents2RadioMenuProps<TValue>>) {
  return (
    <Documents2Menu icon={icon} label={label}>
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
    </Documents2Menu>
  )
}

export function Documents2Toolbar({
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
}: Readonly<Documents2ToolbarProps>) {
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
              <Documents2Menu
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
                    <ViewSettingsSubmenu<Documents2Type>
                      icon={ShapesIcon}
                      label={labels.filterBy.type}
                      onValueChange={(value) => onTypeFilterChange?.(value)}
                      options={documents2Types.map((type) =>
                        iconOption(
                          type,
                          labels.types[type],
                          documents2TypeIcons[type],
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
              </Documents2Menu>
            ) : null}
            <Documents2RadioMenu<Documents2Mode>
              icon={dataCollectionModeIcons[mode]}
              label={labels.layout}
              onValueChange={onModeChange}
              options={documents2Modes.map((item) =>
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
              <Documents2RadioMenu<Documents2Sort>
                icon={SortAscendingIcon}
                label={labels.sort}
                onValueChange={onSortChange}
                options={documents2Sorts.map((item) =>
                  iconOption(item, labels.sorts[item], sortIcons[item]),
                )}
                section={labels.sortBy}
                value={sort}
              />
            ) : null}
            {mode === 'gallery' ? null : (
              <Documents2RadioMenu<Documents2GroupOption>
                icon={StackIcon}
                label={labels.group}
                onValueChange={(value) =>
                  onGroupByChange(pick(documents2GroupBys, value))
                }
                options={groupOptions.map((item) =>
                  iconOption(item, labels.groupings[item], groupIcons[item]),
                )}
                section={labels.groupBy}
                value={groupBy ?? documents2NoGroup}
              />
            )}
            {hasDocuments2Create({ onCreateLink, onCreateNote, onUpload }) ? (
              <Documents2CreateMenu
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
