import { CollectionToolbar } from '@tc96/ui/patterns/toolbar/components/collection-toolbar'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import {
  ViewSettingsMenu,
  type ViewSettingsMode,
} from '@tc96/ui/patterns/view-settings-menu/components/view-settings-menu'
import type { ReactNode } from 'react'
import { dataCollectionModeIcons } from './data-collection-toolbar'
import type {
  DataCollectionModeLabels,
  DataCollectionSettingsToolbarLabels,
  DataCollectionToolbarMode,
} from './types'

export interface DataCollectionSettingsToolbarProps<
  TMode extends DataCollectionToolbarMode,
> {
  actions?: ReactNode
  activeFilterCount: number
  children: ReactNode
  description?: string
  labels: DataCollectionSettingsToolbarLabels
  left?: ReactNode
  loading: boolean
  mode?: TMode
  modeLabels?: DataCollectionModeLabels
  modes?: readonly TMode[]
  onClearFilters: () => void
  onModeChange?: (mode: TMode) => void
  onSavePreference?: () => void
  savePreferenceDisabled?: boolean
  savePreferenceLabel?: string
  search?: ReactNode
}

export function DataCollectionSettingsToolbar<
  TMode extends DataCollectionToolbarMode,
>({
  actions,
  activeFilterCount,
  children,
  description,
  labels,
  left,
  loading,
  mode,
  modeLabels,
  modes,
  onClearFilters,
  onModeChange,
  onSavePreference,
  savePreferenceDisabled,
  savePreferenceLabel,
  search,
}: Readonly<DataCollectionSettingsToolbarProps<TMode>>) {
  const viewModes =
    modes && modeLabels
      ? modes.map(
          (value): ViewSettingsMode<TMode> => ({
            icon: dataCollectionModeIcons[value],
            label: modeLabels[value],
            value,
          }),
        )
      : undefined

  return (
    <CollectionToolbar
      aria-label={labels.toolbar}
      className="min-h-14 flex-wrap gap-y-3"
      left={
        left ?? (
          <CollectionToolbarHeading>
            <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
            <CollectionToolbarDescription>
              {loading ? undefined : description}
            </CollectionToolbarDescription>
          </CollectionToolbarHeading>
        )
      }
      right={
        loading ? undefined : (
          <>
            {search}
            <ViewSettingsMenu
              activeFilterCount={activeFilterCount}
              clearLabel={labels.clearFilters}
              formatTriggerLabel={labels.filterCount}
              label={labels.display}
              mode={mode}
              modes={viewModes}
              onClearFilters={onClearFilters}
              onModeChange={onModeChange}
              onSavePreference={onSavePreference}
              savePreferenceDisabled={savePreferenceDisabled}
              savePreferenceLabel={savePreferenceLabel}
            >
              {children}
            </ViewSettingsMenu>
            {actions}
          </>
        )
      }
    />
  )
}
