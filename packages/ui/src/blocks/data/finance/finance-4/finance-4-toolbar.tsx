import {
  ArrowsDownUpIcon,
  BuildingsIcon,
  CalendarDotsIcon,
  ClockCounterClockwiseIcon,
  CoinsIcon,
  FunnelSimpleIcon,
  type Icon as PhosphorIcon,
  RadioButtonIcon,
  RowsIcon,
  ScalesIcon,
  SortAscendingIcon,
  StackIcon,
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
import { CollectionToolbar } from '@tc96/ui/patterns/toolbar/components/collection-toolbar'
import { ViewSettingsSection } from '@tc96/ui/patterns/view-settings-menu/components/view-settings-menu'
import {
  type ViewSettingsOption,
  ViewSettingsSubmenu,
} from '@tc96/ui/patterns/view-settings-menu/components/view-settings-submenu'
import { PropertyMetaIcon } from '@tc96/ui/property-meta'
import { ToolbarButton } from '@tc96/ui/toolbar'
import type { ReactNode } from 'react'
import { dataCollectionModeIcons } from '../../shared/collection/data-collection-toolbar'
import {
  finance4EntryKinds,
  finance4GroupBys,
  finance4KanbanGroupBys,
  finance4KindAppearance,
  finance4Modes,
  finance4NoGroup,
  finance4SituationAppearance,
  finance4Situations,
  finance4Sorts,
} from './finance-4-options'
import type {
  Finance4EntryKind,
  Finance4GroupBy,
  Finance4KanbanGroupBy,
  Finance4Labels,
  Finance4Mode,
  Finance4Person,
  Finance4Situation,
  Finance4Sort,
} from './types'

export interface Finance4ToolbarProps {
  groupBy: Finance4GroupBy | null
  kanbanGroupBy: Finance4KanbanGroupBy
  kindFilter: Finance4EntryKind | null
  labels: Finance4Labels
  lawyerFilter: string | null
  lawyers: readonly Finance4Person[]
  loading: boolean
  mode: Finance4Mode
  onCreate?: () => void
  onGroupByChange: (groupBy: Finance4GroupBy | null) => void
  onKindFilterChange?: (kind: Finance4EntryKind | null) => void
  onLawyerFilterChange?: (lawyerId: string | null) => void
  onModeChange: (mode: Finance4Mode) => void
  onSituationFilterChange?: (situation: Finance4Situation | null) => void
  onSortChange?: (sort: Finance4Sort) => void
  situationFilter: Finance4Situation | null
  sort: Finance4Sort
  viewSwitcher: ReactNode
}

type Finance4GroupOption = Finance4GroupBy | typeof finance4NoGroup

const optionIcon = 'size-4'

const sortIcons = {
  amount: CoinsIcon,
  client: BuildingsIcon,
  due: CalendarDotsIcon,
  updated: ClockCounterClockwiseIcon,
} as const satisfies Record<Finance4Sort, PhosphorIcon>

const groupIcons = {
  case: ScalesIcon,
  client: BuildingsIcon,
  kind: ArrowsDownUpIcon,
  none: RowsIcon,
  situation: RadioButtonIcon,
} as const satisfies Record<Finance4GroupOption, PhosphorIcon>

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

interface Finance4MenuProps {
  children: ReactNode
  icon: PhosphorIcon
  label: string
  trailing?: ReactNode
}

function Finance4Menu({
  children,
  icon: Icon,
  label,
  trailing,
}: Readonly<Finance4MenuProps>) {
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

interface Finance4RadioMenuProps<TValue extends string> {
  icon: PhosphorIcon
  label: string
  onValueChange: (value: TValue) => void
  options: readonly ViewSettingsOption<TValue>[]
  section: string
  value: TValue
}

function Finance4RadioMenu<TValue extends string>({
  icon,
  label,
  onValueChange,
  options,
  section,
  value,
}: Readonly<Finance4RadioMenuProps<TValue>>) {
  return (
    <Finance4Menu icon={icon} label={label}>
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
    </Finance4Menu>
  )
}

export function Finance4Toolbar({
  groupBy,
  kanbanGroupBy,
  kindFilter,
  labels,
  lawyerFilter,
  lawyers,
  loading,
  mode,
  onCreate,
  onGroupByChange,
  onKindFilterChange,
  onLawyerFilterChange,
  onModeChange,
  onSituationFilterChange,
  onSortChange,
  situationFilter,
  sort,
  viewSwitcher,
}: Readonly<Finance4ToolbarProps>) {
  const showSituation = Boolean(onSituationFilterChange)
  const showKind = Boolean(onKindFilterChange)
  const showLawyer = Boolean(onLawyerFilterChange) && lawyers.length > 0
  const hasFilters = showSituation || showKind || showLawyer
  const activeFilterCount =
    (showSituation && situationFilter ? 1 : 0) +
    (showKind && kindFilter ? 1 : 0) +
    (showLawyer && lawyerFilter ? 1 : 0)
  const groupValues: readonly Finance4GroupOption[] =
    mode === 'kanban'
      ? finance4KanbanGroupBys
      : [finance4NoGroup, ...finance4GroupBys]

  return (
    <CollectionToolbar
      aria-label={labels.toolbar}
      className="min-h-14 flex-wrap gap-y-3"
      left={viewSwitcher}
      right={
        loading ? undefined : (
          <>
            {hasFilters ? (
              <Finance4Menu
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
                  {showSituation ? (
                    <ViewSettingsSubmenu<Finance4Situation>
                      icon={RadioButtonIcon}
                      label={labels.filterBy.situation}
                      onValueChange={(value) =>
                        onSituationFilterChange?.(value)
                      }
                      options={finance4Situations.map((situation) => ({
                        icon: (
                          <PropertyMetaIcon
                            className={optionIcon}
                            meta={finance4SituationAppearance[situation]}
                          />
                        ),
                        label: labels.situations[situation],
                        value: situation,
                      }))}
                      value={situationFilter ?? undefined}
                    />
                  ) : null}
                  {showKind ? (
                    <ViewSettingsSubmenu<Finance4EntryKind>
                      icon={ArrowsDownUpIcon}
                      label={labels.filterBy.kind}
                      onValueChange={(value) => onKindFilterChange?.(value)}
                      options={finance4EntryKinds.map((kind) => ({
                        icon: (
                          <PropertyMetaIcon
                            className={optionIcon}
                            meta={finance4KindAppearance[kind]}
                          />
                        ),
                        label: labels.kinds[kind],
                        value: kind,
                      }))}
                      value={kindFilter ?? undefined}
                    />
                  ) : null}
                  {showLawyer ? (
                    <ViewSettingsSubmenu
                      icon={UserIcon}
                      label={labels.filterBy.lawyer}
                      onValueChange={(value) => onLawyerFilterChange?.(value)}
                      options={lawyers.map((lawyer) =>
                        iconOption(lawyer.id, lawyer.label, UserCircleIcon),
                      )}
                      value={lawyerFilter ?? undefined}
                    />
                  ) : null}
                </ViewSettingsSection>
                <MenuSeparator />
                <MenuItem
                  disabled={activeFilterCount === 0}
                  onClick={() => {
                    if (showSituation) onSituationFilterChange?.(null)
                    if (showKind) onKindFilterChange?.(null)
                    if (showLawyer) onLawyerFilterChange?.(null)
                  }}
                >
                  {labels.clearFilters}
                </MenuItem>
              </Finance4Menu>
            ) : null}
            <Finance4RadioMenu<Finance4Mode>
              icon={dataCollectionModeIcons[mode]}
              label={labels.layout}
              onValueChange={onModeChange}
              options={finance4Modes.map((item) =>
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
              <Finance4RadioMenu<Finance4Sort>
                icon={SortAscendingIcon}
                label={labels.sort}
                onValueChange={onSortChange}
                options={finance4Sorts.map((item) =>
                  iconOption(item, labels.sorts[item], sortIcons[item]),
                )}
                section={labels.sortBy}
                value={sort}
              />
            ) : null}
            <Finance4RadioMenu<Finance4GroupOption>
              icon={StackIcon}
              label={labels.group}
              onValueChange={(value) =>
                onGroupByChange(pick(finance4GroupBys, value))
              }
              options={groupValues.map((item) =>
                iconOption(item, labels.groupings[item], groupIcons[item]),
              )}
              section={labels.groupBy}
              value={
                mode === 'kanban' ? kanbanGroupBy : (groupBy ?? finance4NoGroup)
              }
            />
            {onCreate ? (
              <Action label={labels.create} onClick={onCreate} />
            ) : null}
          </>
        )
      }
    />
  )
}
