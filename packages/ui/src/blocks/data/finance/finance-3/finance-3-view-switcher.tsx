import { DataCollectionViewSwitcher } from '../../shared/collection/data-collection-view-switcher'
import { finance3Views } from './finance-3-options'
import type { Finance3Labels, Finance3View, Finance3ViewProps } from './types'

export interface Finance3ViewSwitcherProps
  extends Omit<Finance3ViewProps, 'onCreate' | 'onViewChange' | 'view'> {
  labels: Finance3Labels
  locale?: string
  onViewChange: (view: Finance3View) => void
  view: Finance3View
}

export function Finance3ViewSwitcher({
  counts,
  labels,
  locale,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewSelect,
  onSavedViewUpdate,
  onViewChange,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading,
  savedViewsPending,
  view,
  views = finance3Views,
}: Readonly<Finance3ViewSwitcherProps>) {
  return (
    <DataCollectionViewSwitcher<Finance3View>
      counts={counts}
      label={labels.viewList}
      locale={locale}
      modified={savedViewModified}
      onSavedViewCreate={onSavedViewCreate}
      onSavedViewDelete={onSavedViewDelete}
      onSavedViewDuplicate={onSavedViewDuplicate}
      onSavedViewRename={onSavedViewRename}
      onSavedViewSelect={onSavedViewSelect}
      onSavedViewUpdate={onSavedViewUpdate}
      onViewChange={onViewChange}
      savedViewId={savedViewId}
      savedViewLabels={labels.savedViews}
      savedViews={savedViews}
      savedViewsLoading={savedViewsLoading}
      savedViewsPending={savedViewsPending}
      view={view}
      viewCountName={labels.viewCountName}
      viewLabels={labels.views}
      views={views}
    />
  )
}
