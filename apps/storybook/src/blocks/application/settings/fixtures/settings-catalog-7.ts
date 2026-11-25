import type { SettingsCatalog7Reason } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-7'

export interface SettingsCatalog7Data {
  allowCustomReason: boolean
  archivedReasons: SettingsCatalog7Reason[]
  reasons: SettingsCatalog7Reason[]
  requireReason: boolean
}

export const settingsCatalog7Data: SettingsCatalog7Data = {
  allowCustomReason: true,
  archivedReasons: [
    { id: 'reason-sem-interesse', leads: 4, name: 'Sem interesse no momento' },
  ],
  reasons: [
    { id: 'reason-preco', leads: 14, name: 'Preço acima do orçamento' },
    { id: 'reason-concorrente', leads: 9, name: 'Escolheu concorrente' },
    { id: 'reason-sem-resposta', leads: 1, name: 'Sem resposta' },
  ],
  requireReason: false,
}
