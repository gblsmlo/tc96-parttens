import type { FlowRunStatus, FlowStepType } from '../canvas/core'

export interface FlowStepGroup {
  label: string
  types: FlowStepType[]
}

export interface FlowStepLibraryLabels {
  title: string
  hint: string
  empty: string
}

export interface FlowRunCardLabels {
  statuses: Record<FlowRunStatus, string>
  summary: string
  title: string
}

export const defaultFlowStepLibraryLabels: FlowStepLibraryLabels = {
  empty: 'Nenhum passo disponível',
  hint: 'Arraste um passo para o canvas ou clique para adicionar',
  title: 'Passos',
}

export const defaultFlowRunCardLabels: FlowRunCardLabels = {
  statuses: {
    failed: 'Falhou',
    idle: 'Pronta',
    'not-run': 'Não executada',
    running: 'Executando',
    skipped: 'Ignorada',
    success: 'Concluída',
  },
  summary: '{completed} de {total} passos concluídos',
  title: 'Última execução',
}

export function groupStepTypes(
  types: readonly FlowStepType[],
): FlowStepGroup[] {
  const groups = new Map<string, FlowStepType[]>()
  for (const type of types) {
    const bucket = groups.get(type.group)
    if (bucket) bucket.push(type)
    else groups.set(type.group, [type])
  }
  return [...groups].map(([label, grouped]) => ({ label, types: grouped }))
}
