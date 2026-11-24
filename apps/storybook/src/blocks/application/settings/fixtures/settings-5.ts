import type { Settings5TimeZone } from '@tc96/ui/blocks/application/settings/settings-5'

export interface Settings5Workspace {
  initials: string
  name: string
  slug: string
  timeZone: string
}

export const workspace: Settings5Workspace = {
  initials: 'AL',
  name: 'Acme Labs',
  slug: 'acme-labs',
  timeZone: 'America/Sao_Paulo',
}

export const timeZones: Settings5TimeZone[] = [
  { label: '(GMT-3) São Paulo', value: 'America/Sao_Paulo' },
  { label: '(GMT-5) Rio Branco', value: 'America/Rio_Branco' },
  { label: '(GMT+0) Lisboa', value: 'Europe/Lisbon' },
]
