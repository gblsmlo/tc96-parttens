import {
  ArrowsClockwiseIcon,
  CopyIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { MenuItem, MenuSeparator } from '@tc96/ui/menu'
import {
  ViewSwitcherCreate,
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
  ViewSwitcherSearch,
} from '@tc96/ui/patterns/view-switcher/components/view-switcher'
import { PopoverClose } from '@tc96/ui/popover'
import { Separator } from '@tc96/ui/separator'
import { type ReactNode, useState } from 'react'
import {
  defaultDataCollectionLocale,
  defaultDataCollectionSavedViewLabels,
} from './labels'
import type {
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
} from './types'

const savedViewSearchFrom = 6

export interface DataCollectionViewSwitcherProps<TView extends string> {
  counts?: Partial<Record<TView, number>>
  icons?: Partial<Record<TView, ReactNode>>
  label: string
  locale?: string
  modified?: boolean
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string) => void
  onSavedViewUpdate?: () => void
  onViewChange: (view: TView) => void
  onViewDuplicate?: (view: TView) => void
  savedViewId?: string | null
  savedViewLabels?: Partial<DataCollectionSavedViewLabels>
  savedViews?: readonly DataCollectionSavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  view: TView
  viewCountName?: (label: string, count: number) => string
  viewLabels: Record<TView, string>
  views: readonly TView[]
}

export function DataCollectionViewSwitcher<TView extends string>({
  counts,
  icons,
  label,
  locale = defaultDataCollectionLocale,
  modified = false,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewSelect,
  onSavedViewUpdate,
  onViewChange,
  onViewDuplicate,
  savedViewId,
  savedViewLabels,
  savedViews,
  savedViewsLoading = false,
  savedViewsPending = false,
  view,
  viewCountName,
  viewLabels,
  views,
}: Readonly<DataCollectionViewSwitcherProps<TView>>) {
  const [query, setQuery] = useState('')
  const labels = { ...defaultDataCollectionSavedViewLabels, ...savedViewLabels }
  const activeSavedView = savedViews?.find((item) => item.id === savedViewId)
  const activeLabel = activeSavedView?.label ?? viewLabels[view]
  const needle = query.trim().toLocaleLowerCase(locale)
  const visibleSavedViews = savedViews?.filter((item) =>
    item.label.toLocaleLowerCase(locale).includes(needle),
  )
  const showSavedViews = Boolean(savedViews?.length) || savedViewsLoading
  const showUpdate = Boolean(activeSavedView && modified && onSavedViewUpdate)

  return (
    <ViewSwitcherMenu
      icon={activeSavedView ? activeSavedView.icon : icons?.[view]}
      label={modified ? labels.modified(activeLabel) : activeLabel}
    >
      {(savedViews?.length ?? 0) >= savedViewSearchFrom ? (
        <ViewSwitcherSearch
          label={labels.search}
          onValueChange={setQuery}
          placeholder={labels.searchPlaceholder}
          value={query}
        />
      ) : null}
      <ViewSwitcherItems label={label}>
        {views.map((item) => {
          const count = counts?.[item]
          return (
            <ViewSwitcherItem
              aria-label={
                count === undefined || !viewCountName
                  ? undefined
                  : viewCountName(viewLabels[item], count)
              }
              count={count}
              icon={icons?.[item]}
              key={item}
              label={viewLabels[item]}
              onSelect={() => onViewChange(item)}
              options={
                onViewDuplicate ? (
                  <MenuItem onClick={() => onViewDuplicate(item)}>
                    <CopyIcon aria-hidden="true" />
                    {labels.duplicate}
                  </MenuItem>
                ) : undefined
              }
              optionsLabel={labels.options(viewLabels[item])}
              selected={!activeSavedView && item === view}
            />
          )
        })}
      </ViewSwitcherItems>
      {showSavedViews ? (
        <>
          <Separator />
          <ViewSwitcherItems
            label={labels.savedViews}
            loading={savedViewsLoading}
          >
            {visibleSavedViews?.map((item) => (
              <ViewSwitcherItem
                icon={item.icon}
                key={item.id}
                label={item.label}
                onSelect={() => onSavedViewSelect?.(item.id)}
                options={
                  onSavedViewRename ||
                  onSavedViewDuplicate ||
                  onSavedViewDelete ? (
                    <>
                      {onSavedViewRename ? (
                        <MenuItem onClick={() => onSavedViewRename(item.id)}>
                          <PencilSimpleIcon aria-hidden="true" />
                          {labels.rename}
                        </MenuItem>
                      ) : null}
                      {onSavedViewDuplicate ? (
                        <MenuItem
                          disabled={savedViewsPending}
                          onClick={() => onSavedViewDuplicate(item.id)}
                        >
                          <CopyIcon aria-hidden="true" />
                          {labels.duplicate}
                        </MenuItem>
                      ) : null}
                      {onSavedViewDelete ? (
                        <>
                          {onSavedViewRename || onSavedViewDuplicate ? (
                            <MenuSeparator />
                          ) : null}
                          <MenuItem
                            onClick={() => onSavedViewDelete(item.id)}
                            variant="destructive"
                          >
                            <TrashIcon aria-hidden="true" />
                            {labels.delete}
                          </MenuItem>
                        </>
                      ) : null}
                    </>
                  ) : undefined
                }
                optionsLabel={labels.options(item.label)}
                selected={item.id === activeSavedView?.id}
              />
            ))}
          </ViewSwitcherItems>
        </>
      ) : null}
      {showUpdate || onSavedViewCreate ? (
        <>
          <Separator />
          {showUpdate && activeSavedView ? (
            <PopoverClose
              data-slot="data-collection-saved-view-update"
              onClick={onSavedViewUpdate}
              render={
                <Button
                  className="w-full justify-start"
                  disabled={savedViewsPending}
                  size="sm"
                  type="button"
                  variant="ghost"
                />
              }
            >
              <ArrowsClockwiseIcon aria-hidden="true" />
              {labels.update(activeSavedView.label)}
            </PopoverClose>
          ) : null}
          {onSavedViewCreate ? (
            <ViewSwitcherCreate
              label={labels.create}
              onClick={onSavedViewCreate}
            />
          ) : null}
        </>
      ) : null}
    </ViewSwitcherMenu>
  )
}
