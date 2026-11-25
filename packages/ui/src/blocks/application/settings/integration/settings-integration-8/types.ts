import type {
  SettingsAppLogoData,
  SettingsLoadLabels,
  SettingsLoadProps,
} from '../../shared/types'

export interface SettingsIntegration8Item {
  callsLabel: string
  calls: number
  enabled: boolean
  id: string
  keyPreview: string
  logo?: SettingsAppLogoData
  name: string
}

export interface SettingsIntegration8Labels extends SettingsLoadLabels {
  callsColumn: string
  copyAction: (name: string) => string
  description: string
  emptyDescription: string
  emptyTitle: string
  enableAction: (name: string) => string
  enabledColumn: string
  integrationColumn: string
  keyColumn: string
  pauseAll: string
  rowsPerPage: string
  title: string
}

export interface SettingsIntegration8Props extends SettingsLoadProps {
  allPaused?: boolean
  className?: string
  integrations: SettingsIntegration8Item[]
  labels?: Partial<SettingsIntegration8Labels>
  onAllPausedChange?: (paused: boolean) => void
  onCopyKey?: (integrationId: string) => void
  onEnabledChange?: (integrationId: string, enabled: boolean) => void
  pageSize?: number
  pageSizeOptions?: readonly number[]
}
