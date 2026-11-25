import {
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
} from '@tc96/ui/patterns/view-switcher/components/view-switcher'

export interface LegalViewSwitcherProps<TView extends string> {
  label: string
  onViewChange: (view: TView) => void
  view: TView
  viewLabels: Record<TView, string>
  views: readonly TView[]
}

export function LegalViewSwitcher<TView extends string>({
  label,
  onViewChange,
  view,
  viewLabels,
  views,
}: Readonly<LegalViewSwitcherProps<TView>>) {
  return (
    <ViewSwitcherMenu label={viewLabels[view]}>
      <ViewSwitcherItems label={label}>
        {views.map((item) => (
          <ViewSwitcherItem
            key={item}
            label={viewLabels[item]}
            onSelect={() => onViewChange(item)}
            selected={item === view}
          />
        ))}
      </ViewSwitcherItems>
    </ViewSwitcherMenu>
  )
}
