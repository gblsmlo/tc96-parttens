import type {
  RecordGroup1Item,
  RecordGroup1LabelsOverride,
} from '@tc96/ui/blocks/application/record-group/record-group-1'

export const taskItems: readonly RecordGroup1Item[] = [
  { completed: true, id: 'extracts', title: 'Baixar extratos de 2024' },
  { completed: false, id: 'appeal', title: 'Redigir contestação' },
]

export const taskLabels: RecordGroup1LabelsOverride = {
  addLabel: 'Adicionar etapas',
  checklist: 'Lista de tarefas',
  title: 'Tarefas',
}
