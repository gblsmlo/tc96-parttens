import { Button } from '@tc96/ui/button'
import { CollectionToolbar } from '@tc96/ui/patterns/toolbar/components/collection-toolbar'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { ToolbarButton } from '@tc96/ui/toolbar'
import type { ReactNode } from 'react'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import type { Finance3Labels, Finance3VariantLabels } from './types'

export interface Finance3ToolbarProps {
  actions?: ReactNode
  activeFilterCount?: number
  description?: string
  labels: Finance3Labels
  left?: ReactNode
  loading: boolean
  onClearFilters?: () => void
  onSavePreference?: () => void
  search?: ReactNode
  settings?: ReactNode
  variantLabels: Finance3VariantLabels
}

export function Finance3Toolbar({
  actions,
  activeFilterCount = 0,
  description,
  labels,
  left,
  loading,
  onClearFilters,
  onSavePreference,
  search,
  settings,
  variantLabels,
}: Readonly<Finance3ToolbarProps>) {
  if (settings)
    return (
      <DataCollectionSettingsToolbar
        actions={actions}
        activeFilterCount={activeFilterCount}
        description={description}
        labels={{
          clearFilters: labels.clearFilters,
          display: labels.display,
          filterCount: labels.filterCount,
          title: variantLabels.title,
          toolbar: variantLabels.toolbar,
        }}
        left={left}
        loading={loading}
        onClearFilters={onClearFilters ?? (() => undefined)}
        onSavePreference={onSavePreference}
        savePreferenceLabel={labels.savePreference}
        search={search}
      >
        {settings}
      </DataCollectionSettingsToolbar>
    )

  return (
    <CollectionToolbar
      aria-label={variantLabels.toolbar}
      className="min-h-14 flex-wrap gap-y-3"
      left={
        left ?? (
          <CollectionToolbarHeading>
            <CollectionToolbarTitle>
              {variantLabels.title}
            </CollectionToolbarTitle>
            <CollectionToolbarDescription>
              {loading ? undefined : description}
            </CollectionToolbarDescription>
          </CollectionToolbarHeading>
        )
      }
      right={loading ? undefined : actions}
    />
  )
}

export function Finance3ToolbarButton({
  children,
  disabled = false,
  onClick,
  variant = 'outline',
}: Readonly<{
  children: ReactNode
  disabled?: boolean
  onClick: () => void
  variant?: 'default' | 'outline'
}>) {
  return (
    <ToolbarButton
      disabled={disabled}
      onClick={onClick}
      render={<Button type="button" variant={variant} />}
    >
      {children}
    </ToolbarButton>
  )
}
