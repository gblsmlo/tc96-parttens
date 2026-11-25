import { defaultTableLoadLabels } from '../../shared/table/labels'
import type { Support4Labels, Support4LabelsOverride } from './types'

export const defaultSupport4Labels: Support4Labels = {
  ...defaultTableLoadLabels,
  columns: {
    actions: 'Ações',
    condition: 'Quando',
    drag: 'Reordenar',
    effect: 'Então',
    enabled: 'Ativa',
    matches: 'Correspondências',
    rank: '#',
    rule: 'Regra',
    scope: 'Escopo',
  },
  dragCancel: (rule) => `Movimento da regra ${rule} cancelado.`,
  dragDrop: (rule, position, total) =>
    `Regra ${rule} solta na posição ${position} de ${total}.`,
  dragHandle: (rule) => `Arrastar para reordenar a regra ${rule}`,
  dragInstructions:
    'Pressione espaço para pegar a regra, use as setas para mover, espaço para soltar e Esc para cancelar.',
  dragOver: (rule, position, total) =>
    `Regra ${rule} sobre a posição ${position} de ${total}.`,
  dragStart: (rule, position, total) =>
    `Regra ${rule} pega na posição ${position} de ${total}.`,
  empty: 'Nenhuma regra de roteamento.',
  enabledFor: (rule) => `Ativar a regra ${rule}`,
  errorTitle: 'Não foi possível carregar as regras',
  loading: 'Carregando regras',
  matchesIn: (matches) => `${matches} correspondências nos últimos 7 dias`,
  period: '7d',
  resetOrder: 'Restaurar ordem',
  rowActionsFor: (rule) => `Ações da regra ${rule}`,
  summary: (active, matches) =>
    `A primeira regra que casar vence · ${active} ${active === 1 ? 'ativa' : 'ativas'} · ${matches} correspondências`,
  title: 'Regras de roteamento',
  toolbar: 'Controles das regras de roteamento',
}

export function resolveSupport4Labels(
  labels: Support4LabelsOverride | undefined,
): Support4Labels {
  return {
    ...defaultSupport4Labels,
    ...labels,
    columns: { ...defaultSupport4Labels.columns, ...labels?.columns },
  }
}
