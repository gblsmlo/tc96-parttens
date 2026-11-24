import type { BulkImport1Labels } from './types'

export const defaultBulkImport1Labels: BulkImport1Labels = {
  ancestor: 'Registros',
  back: 'Voltar',
  cancel: 'Fechar',
  continue: 'Continuar',
  import: (count) =>
    count === 1 ? 'Importar 1 registro' : `Importar ${count} registros`,
  importing: 'Importando…',
  importingHint: 'Pode fechar. A lista de registros mostra o andamento.',
  noneSelected: 'Marque ao menos um registro.',
  progress: 'Andamento da importação',
  searchAgain: 'Buscar de novo',
  searching: 'Buscando…',
  select: (label) => `Selecionar ${label}`,
  selectColumn: 'Selecionar',
  selectedCount: (count, max) =>
    `${count} ${count === 1 ? 'selecionado' : 'selecionados'} · até ${max} por lote`,
  status: 'Situação',
  title: 'Importar registros',
}
