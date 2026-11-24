import type { Settings13Reason } from '@tc96/blocks/application/settings/settings-13'

export interface Settings13Data {
  allowCustomReason: boolean
  archivedReasons: Settings13Reason[]
  reasons: Settings13Reason[]
  requireReason: boolean
}

export const settings13Data: Settings13Data = {
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
