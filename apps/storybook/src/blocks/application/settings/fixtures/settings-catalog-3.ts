import type { SettingsCatalog3Rule } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-3'

export const rules: SettingsCatalog3Rule[] = [
  {
    action: { text: 'Adicionar SLA de 2 dias úteis' },
    field: 'Etapa',
    id: 'rule-proposta',
    operator: 'é igual a',
    value: { label: 'Proposta' },
  },
  {
    action: { text: 'Adicionar SLA de 1 dia útil' },
    field: 'Prioridade',
    id: 'rule-prioridade-alta',
    operator: 'é',
    value: { label: 'Alta' },
  },
  {
    action: { text: 'Remover SLA' },
    field: 'Tag',
    id: 'rule-cliente-inativo',
    operator: 'contém',
    value: { label: 'Cliente inativo' },
  },
]
