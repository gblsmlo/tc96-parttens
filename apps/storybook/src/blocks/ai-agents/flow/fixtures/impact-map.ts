import type {
  ImpactMapLink,
  ImpactMapNode,
} from '@tc96/ui/blocks/ai-agents/flow/impact-map'

export const nodes: ImpactMapNode[] = [
  {
    id: 'mrr',
    kind: 'north-star',
    owner: 'Camila Duarte',
    progress: 62,
    title: 'Receita recorrente mensal',
    valueText: 'R$ 1,2 mi',
  },
  {
    id: 'activation',
    kind: 'metric',
    owner: 'Marina Costa',
    progress: 71,
    title: 'Ativação de contas',
    valueText: '71%',
  },
  {
    id: 'retention',
    kind: 'metric',
    owner: 'Rafael Lima',
    progress: 48,
    title: 'Retenção em 90 dias',
    valueText: '48%',
  },
  {
    id: 'onboarding',
    kind: 'initiative',
    owner: 'Júlia Andrade',
    progress: 80,
    title: 'Onboarding guiado',
  },
  {
    id: 'checklist',
    kind: 'initiative',
    owner: 'Bruno Tavares',
    progress: 55,
    title: 'Lista de primeiros passos',
  },
  {
    id: 'churn',
    kind: 'initiative',
    owner: 'Rafael Lima',
    progress: 30,
    title: 'Alertas de risco de saída',
  },
  {
    id: 'referral',
    kind: 'initiative',
    progress: 20,
    title: 'Programa de indicação',
  },
]

export const links: ImpactMapLink[] = [
  { id: 'l1', source: 'activation', target: 'mrr' },
  { id: 'l2', source: 'retention', target: 'mrr' },
  { id: 'l3', source: 'onboarding', target: 'activation' },
  { id: 'l4', source: 'checklist', target: 'activation' },
  { id: 'l5', source: 'churn', target: 'retention' },
  { id: 'l6', source: 'referral', target: 'retention' },
]

export const map = { links, nodes }
