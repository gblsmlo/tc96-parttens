import { ArrowElbowDownRightIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { IconLabelProperty } from '@tc96/ui/patterns/properties/display/icon-label/icon-label-property'
import { SettingsCollapsed } from '@tc96/ui/patterns/surfaces/settings/composition/settings-collapsed/settings-collapsed'
import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../../shared/settings-load-state'
import { SettingsRowActions } from '../../shared/settings-row-actions'
import { SettingsSwatch } from '../../shared/settings-swatch'
import { defaultSettingsCatalog9Labels } from './labels'
import { SettingsCatalog9Skeleton } from './settings-catalog-9-skeleton'
import type {
  SettingsCatalog9Action,
  SettingsCatalog9Category,
  SettingsCatalog9Direction,
  SettingsCatalog9Labels,
  SettingsCatalog9Props,
} from './types'

const directionDots: Record<SettingsCatalog9Direction, string> = {
  expense: 'bg-red-700 dark:bg-red-500',
  income: 'bg-green-700 dark:bg-green-500',
}

interface CategoryRowProps {
  archived?: boolean
  category: SettingsCatalog9Category
  labels: SettingsCatalog9Labels
  onCategoryAction?: SettingsCatalog9Props['onCategoryAction']
  parent?: string
}

function CategoryRow({
  archived,
  category,
  labels,
  onCategoryAction,
  parent,
}: Readonly<CategoryRowProps>) {
  const actions = archived
    ? [{ id: 'restore', label: labels.restore }]
    : [
        { id: 'edit', label: labels.edit },
        ...(parent
          ? []
          : [{ id: 'add-subcategory', label: labels.addSubcategory }]),
        { destructive: true, id: 'archive', label: labels.archive },
      ]

  return (
    <SettingsRow
      className={parent ? 'ps-2' : undefined}
      description={parent ? labels.subcategoryOf(parent) : undefined}
      endSlot={
        <div className="flex items-center gap-3">
          <Text
            foreground="muted"
            render={<span>{labels.entries(category.entries)}</span>}
            size="sm"
          />
          {parent ? null : (
            <IconLabelProperty
              label={labels.direction(category.direction)}
              leading={
                <SettingsSwatch
                  className={cn('size-2', directionDots[category.direction])}
                />
              }
            />
          )}
          {onCategoryAction ? (
            <SettingsRowActions
              actions={actions}
              label={labels.actions(category.name)}
              onAction={(action) =>
                onCategoryAction(category.id, action as SettingsCatalog9Action)
              }
            />
          ) : null}
        </div>
      }
      startSlot={
        parent ? (
          <ArrowElbowDownRightIcon
            aria-hidden="true"
            className="text-muted-foreground"
          />
        ) : undefined
      }
      title={category.name}
    />
  )
}

function categoryRows(
  list: SettingsCatalog9Category[],
  labels: SettingsCatalog9Labels,
  onCategoryAction: SettingsCatalog9Props['onCategoryAction'],
  archived?: boolean,
) {
  return list.flatMap((category) => [
    <CategoryRow
      archived={archived}
      category={category}
      key={category.id}
      labels={labels}
      onCategoryAction={onCategoryAction}
    />,
    ...(category.subcategories ?? []).map((subcategory) => (
      <CategoryRow
        archived={archived}
        category={subcategory}
        key={subcategory.id}
        labels={labels}
        onCategoryAction={onCategoryAction}
        parent={category.name}
      />
    )),
  ])
}

export function SettingsCatalog9({
  error,
  onRetry,
  pending,
  archivedCategories = [],
  categories,
  className,
  labels: labelsProp,
  onCategoryAction,
  onCreate,
}: Readonly<SettingsCatalog9Props>) {
  const labels = { ...defaultSettingsCatalog9Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsCatalog9Skeleton />,
  })

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-2xl', className)}
      header={
        <SettingsSectionHeader
          actions={
            onCreate ? (
              <Button onClick={onCreate} size="sm">
                {labels.newCategory}
              </Button>
            ) : undefined
          }
        >
          <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
          <SettingsSectionDescription>
            {labels.description}
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {loadState ?? (
        <>
          {categories.length === 0 ? (
            <StateSurface
              description={labels.emptyDescription}
              kind="empty"
              title={labels.emptyTitle}
            />
          ) : (
            categoryRows(categories, labels, onCategoryAction)
          )}
          {archivedCategories.length > 0 ? (
            <div>
              <SettingsCollapsed defaultOpen={false} title={labels.archived}>
                {categoryRows(
                  archivedCategories,
                  labels,
                  onCategoryAction,
                  true,
                )}
              </SettingsCollapsed>
            </div>
          ) : null}
        </>
      )}
    </SettingsSection>
  )
}
