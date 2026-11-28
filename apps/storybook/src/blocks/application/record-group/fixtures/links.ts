import {
  createRecordGroup6Catalog,
  type RecordGroup6LabelsOverride,
  type RecordGroup6Link,
} from '@tc96/ui/blocks/application/record-group/record-group-6'

export const installmentCatalog = createRecordGroup6Catalog({
  status: { overdue: 'Atrasada', paid: 'Paga', scheduled: 'Prevista' },
})

export const installmentLinks: readonly RecordGroup6Link[] = [
  {
    href: '#/lancamentos/parcela-1',
    id: 'parcela-1',
    kind: 'record',
    label: 'Parcela 1',
    meta: '10/09/2026',
    status: 'paid',
  },
  {
    href: '#/lancamentos/parcela-2',
    id: 'parcela-2',
    kind: 'record',
    label: 'Parcela 2',
    meta: '10/10/2026',
    status: 'overdue',
  },
  {
    href: '#/lancamentos/parcela-3',
    id: 'parcela-3',
    kind: 'record',
    label: 'Parcela 3',
    meta: '10/11/2026',
    status: 'scheduled',
  },
]

export const documentLinks: readonly RecordGroup6Link[] = [
  {
    href: '#/documentos/contrato-assinado.pdf',
    id: 'contrato-assinado',
    kind: 'file',
    label: 'contrato-assinado.pdf',
    meta: 'PDF · 12/08/2026',
  },
]

export const installmentLabels: RecordGroup6LabelsOverride = {
  empty: 'Sem parcelas',
  title: 'Parcelas',
}

export const documentLabels: RecordGroup6LabelsOverride = {
  empty: 'Sem documento assinado',
  title: 'Documento',
}
