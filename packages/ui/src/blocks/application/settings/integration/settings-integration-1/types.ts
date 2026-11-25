import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsIntegration1Endpoint {
  enabled: boolean
  events: number
  failing?: boolean
  id: string
  lastDelivery: string
  url: string
}

export type SettingsIntegration1Action = 'edit' | 'send-test' | 'delete'

export interface SettingsIntegration1Labels extends SettingsLoadLabels {
  actions: (url: string) => string
  delete: string
  description: string
  edit: string
  emptyDescription: string
  emptyTitle: string
  enable: (url: string) => string
  eventCount: (count: number) => string
  failing: string
  failingDescription: (count: number) => string
  failingTitle: string
  lastDelivery: (value: string) => string
  newEndpoint: string
  sendTest: string
  title: string
}

export interface SettingsIntegration1Props extends SettingsLoadProps {
  className?: string
  endpoints: SettingsIntegration1Endpoint[]
  labels?: Partial<SettingsIntegration1Labels>
  onCreate?: () => void
  onEnabledChange?: (endpointId: string, enabled: boolean) => void
  onEndpointAction?: (
    endpointId: string,
    action: SettingsIntegration1Action,
  ) => void
}
