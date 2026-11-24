import type {
  DataGrid7RowAction,
  DataGrid7Rule,
  DataGrid7RuleMove,
} from '@tc96/ui/blocks/data/data-grid/data-grid-7'

export const rules: DataGrid7Rule[] = [
  {
    condition: 'Prioridade é Urgente',
    description: 'Chamados de alta prioridade',
    effect: 'Atribuir ao Nível 2',
    enabled: true,
    icon: 'alert',
    id: 'rule-urgent',
    matches: 148,
    name: 'Escalonamento urgente',
    scope: { label: 'Prioridade', tone: 'error' },
  },
  {
    condition: 'Plano é Enterprise',
    description: 'Contas de maior porte',
    effect: 'Encaminhar para Sucesso',
    enabled: true,
    icon: 'people',
    id: 'rule-enterprise',
    matches: 92,
    name: 'Clientes enterprise',
    scope: { label: 'Conta', tone: 'secondary' },
  },
  {
    condition: 'Assunto é Cobrança',
    description: 'Pagamentos e notas fiscais',
    effect: 'Adicionar etiqueta Cobrança',
    enabled: true,
    icon: 'tag',
    id: 'rule-billing',
    matches: 311,
    name: 'Assuntos de cobrança',
    scope: { label: 'Assunto', tone: 'info' },
  },
  {
    condition: 'Horário fora do expediente',
    description: 'Fora do horário comercial',
    effect: 'Avisar o plantão',
    enabled: true,
    icon: 'clock',
    id: 'rule-after-hours',
    matches: 44,
    name: 'Fora do expediente',
    scope: { label: 'Agenda', tone: 'warning' },
  },
  {
    condition: 'Domínio é noreply',
    description: 'Envios automáticos',
    effect: 'Pular atribuição',
    enabled: false,
    icon: 'sliders',
    id: 'rule-bulk',
    matches: 620,
    name: 'Remetentes em massa',
    scope: { label: 'Remetente', tone: 'outline' },
  },
  {
    condition: 'Pontuação abaixo de 20',
    description: 'Provável spam',
    effect: 'Mover para spam',
    enabled: false,
    icon: 'alert',
    id: 'rule-low-signal',
    matches: 38,
    name: 'Sinal fraco',
    scope: { label: 'Risco', tone: 'error' },
  },
  {
    condition: 'Assunto é Reembolso',
    description: 'Pedidos de devolução',
    effect: 'Escalar para Financeiro',
    enabled: true,
    icon: 'tag',
    id: 'rule-refund',
    matches: 27,
    name: 'Pedidos de reembolso',
    scope: { label: 'Financeiro', tone: 'success' },
  },
]

export const rowActions: DataGrid7RowAction[] = [
  { id: 'edit', label: 'Editar regra' },
  { id: 'duplicate', label: 'Duplicar' },
  { destructive: true, id: 'delete', label: 'Excluir' },
]

export const moveRule = (
  current: DataGrid7Rule[],
  { fromIndex, toIndex }: DataGrid7RuleMove,
): DataGrid7Rule[] => {
  const next = [...current]
  const [moved] = next.splice(fromIndex, 1)
  if (moved) next.splice(toIndex, 0, moved)
  return next
}

export const sameOrder = (a: DataGrid7Rule[], b: DataGrid7Rule[]) =>
  a.every((rule, index) => rule.id === b[index]?.id)
