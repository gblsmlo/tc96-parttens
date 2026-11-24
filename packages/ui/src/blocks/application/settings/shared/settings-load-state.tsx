import { Button } from '@tc96/ui/button'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import type { ReactNode } from 'react'
import { SettingsSkeleton } from './settings-skeleton'
import type { SettingsLoadLabels, SettingsLoadProps } from './types'

export interface SettingsLoadStateOptions extends SettingsLoadProps {
  labels: SettingsLoadLabels
  skeleton: ReactNode
}

export function settingsLoadState({
  error,
  labels,
  onRetry,
  pending,
  skeleton,
}: Readonly<SettingsLoadStateOptions>): ReactNode {
  if (pending)
    return (
      <SettingsSkeleton label={labels.loading}>{skeleton}</SettingsSkeleton>
    )
  if (error)
    return (
      <StateSurface
        actions={
          onRetry ? (
            <Button onClick={onRetry} size="sm" variant="outline">
              {labels.retry}
            </Button>
          ) : undefined
        }
        description={labels.errorDescription}
        kind="error"
        title={labels.errorTitle}
      />
    )
  return null
}
