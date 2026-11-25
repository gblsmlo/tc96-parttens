import type { SettingsWorkspace1TimeZone } from '@tc96/ui/blocks/application/settings/workspace/settings-workspace-1'

export interface SettingsWorkspace1Workspace {
  initials: string
  name: string
  slug: string
  timeZone: string
}

export const workspace: SettingsWorkspace1Workspace = {
  initials: 'AL',
  name: 'Acme Labs',
  slug: 'acme-labs',
  timeZone: 'America/Sao_Paulo',
}

export const timeZones: SettingsWorkspace1TimeZone[] = [
  { label: '(GMT-3) São Paulo', value: 'America/Sao_Paulo' },
  { label: '(GMT-5) Rio Branco', value: 'America/Rio_Branco' },
  { label: '(GMT+0) Lisboa', value: 'Europe/Lisbon' },
]
