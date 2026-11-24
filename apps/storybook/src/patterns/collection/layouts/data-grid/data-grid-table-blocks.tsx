import { UserIcon } from '@phosphor-icons/react'
import {
  createDataGridConditionFilterFn,
  DataGrid,
  type DataGridCellValueChange,
  type DataGridColumnDef,
  type DataGridCondition,
  type DataGridConditionFilterField,
  type DataGridConditionFilterLabels,
  DataGridConditionFilters,
  type DataGridConditionJoin,
  type DataGridConditionOperator,
  DataGridPagination,
  useDataGrid,
} from '@tc96/ui/patterns'
import { type ReactElement, useCallback, useMemo, useState } from 'react'
import { gridProjects } from './data-grid-data.ts'

export interface RenewalRecord {
  account: string
  id: string
  owner: string
  renewal: string
  risk: string
  segment: string
  stage: string
}

export const renewalRecords: RenewalRecord[] = [
  {
    account: 'Acme Corp',
    id: 'R-1',
    owner: 'Ana Lima',
    renewal: '2026-12-10',
    risk: 'high',
    segment: 'enterprise',
    stage: 'negotiation',
  },
  {
    account: 'Globex',
    id: 'R-2',
    owner: 'Bruno Reis',
    renewal: '2026-12-20',
    risk: 'medium',
    segment: 'mid-market',
    stage: 'proposal',
  },
  {
    account: 'Initech',
    id: 'R-3',
    owner: 'Carla Souza',
    renewal: '2027-01-15',
    risk: 'low',
    segment: 'smb',
    stage: 'discovery',
  },
  {
    account: 'Umbrella',
    id: 'R-4',
    owner: 'Ana Lima',
    renewal: '2027-02-01',
    risk: 'high',
    segment: 'enterprise',
    stage: 'proposal',
  },
  {
    account: 'Hooli',
    id: 'R-5',
    owner: 'Bruno Reis',
    renewal: '2027-02-18',
    risk: 'low',
    segment: 'mid-market',
    stage: 'negotiation',
  },
  {
    account: 'Stark Labs',
    id: 'R-6',
    owner: 'Carla Souza',
    renewal: '2026-11-30',
    risk: 'low',
    segment: 'enterprise',
    stage: 'closed',
  },
  {
    account: 'Wayne Co',
    id: 'R-7',
    owner: 'Ana Lima',
    renewal: '2027-03-05',
    risk: 'medium',
    segment: 'smb',
    stage: 'negotiation',
  },
  {
    account: 'Soylent',
    id: 'R-8',
    owner: 'Bruno Reis',
    renewal: '2027-03-22',
    risk: 'high',
    segment: 'smb',
    stage: 'discovery',
  },
]

const segmentOptions = [
  { label: 'Enterprise', value: 'enterprise' },
  { label: 'Mid-market', value: 'mid-market' },
  { label: 'SMB', value: 'smb' },
]
const stageOptions = [
  { label: 'Descoberta', value: 'discovery' },
  { label: 'Proposta', value: 'proposal' },
  { label: 'Negociação', value: 'negotiation' },
  { label: 'Fechado', value: 'closed' },
]
const riskOptions = [
  { label: 'Baixo', value: 'low' },
  { label: 'Médio', value: 'medium' },
  { label: 'Alto', value: 'high' },
]
const ownerOptions = [
  { label: 'Ana Lima', value: 'Ana Lima' },
  { label: 'Bruno Reis', value: 'Bruno Reis' },
  { label: 'Carla Souza', value: 'Carla Souza' },
]

const renewalFields: DataGridConditionFilterField[] = [
  {
    columnId: 'account',
    icon: <UserIcon aria-hidden="true" />,
    kind: 'text',
    label: 'Conta',
  },
  {
    columnId: 'segment',
    kind: 'option',
    label: 'Segmento',
    options: segmentOptions,
  },
  { columnId: 'stage', kind: 'option', label: 'Etapa', options: stageOptions },
  { columnId: 'risk', kind: 'option', label: 'Risco', options: riskOptions },
  { columnId: 'renewal', kind: 'date', label: 'Janela de renovação' },
  {
    columnId: 'owner',
    kind: 'option',
    label: 'Responsável',
    options: ownerOptions,
  },
]

const renewalColumns: DataGridColumnDef<RenewalRecord>[] = [
  {
    accessorKey: 'account',
    header: 'Conta',
    meta: { label: 'Conta', type: 'title' },
    size: 180,
  },
  {
    accessorKey: 'segment',
    header: 'Segmento',
    meta: { label: 'Segmento', options: segmentOptions, variant: 'badge' },
    size: 140,
  },
  {
    accessorKey: 'stage',
    header: 'Etapa',
    meta: { label: 'Etapa', options: stageOptions, variant: 'badge' },
    size: 140,
  },
  {
    accessorKey: 'risk',
    header: 'Risco',
    meta: { label: 'Risco', options: riskOptions, variant: 'badge' },
    size: 110,
  },
  {
    accessorKey: 'renewal',
    header: 'Renovação',
    meta: { label: 'Renovação', type: 'date', variant: 'date' },
    size: 130,
  },
  {
    accessorKey: 'owner',
    header: 'Responsável',
    meta: { label: 'Responsável', type: 'person' },
    size: 150,
  },
]

export const conditionLabels: DataGridConditionFilterLabels = {
  addFilter: 'Filtros',
  clearFilters: 'Limpar filtros',
  condition: (field) => `Filtro: ${field}`,
  conditionActions: (field) => `Ações do filtro ${field}`,
  editValue: (field) => `Valor de ${field}`,
  noFields: 'Nenhum campo encontrado.',
  noValue: 'Escolher valor',
  rangeFrom: 'De',
  rangeSeparator: 'e',
  rangeTo: 'Até',
  removeCondition: 'Remover filtro',
  searchFields: 'Buscar campo',
  valuePlaceholder: 'Digite um valor',
}

export const operatorLabels: Record<DataGridConditionOperator, string> = {
  after: 'depois de',
  before: 'antes de',
  between: 'entre',
  contains: 'contém',
  eq: 'igual a',
  gt: 'maior que',
  is: 'é',
  'is-any-of': 'é um de',
  'is-not': 'não é',
  lt: 'menor que',
}

export function RenewalsGrid({
  initialConditions = [],
  join = 'and',
}: Readonly<{
  initialConditions?: readonly DataGridCondition[]
  join?: DataGridConditionJoin
}>): ReactElement {
  const [conditions, setConditions] = useState(initialConditions)
  const filterFn = useMemo(
    () => createDataGridConditionFilterFn<RenewalRecord>(renewalFields, join),
    [join],
  )
  const { table } = useDataGrid<RenewalRecord>({
    columns: renewalColumns,
    data: renewalRecords,
    getRowId: (record) => record.id,
    tableOptions: {
      globalFilterFn: filterFn,
      initialState: {
        globalFilter: initialConditions.length ? initialConditions : undefined,
      },
    },
  })
  const onConditionsChange = useCallback(
    (next: DataGridCondition[]) => {
      setConditions(next)
      table.setGlobalFilter(next.length ? next : '')
    },
    [table],
  )

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DataGridConditionFilters
        conditions={conditions}
        fields={renewalFields}
        labels={conditionLabels}
        onConditionsChange={onConditionsChange}
        operatorLabels={operatorLabels}
      />
      <DataGrid<RenewalRecord>
        aria-label="Renovações"
        emptyMessage="Nenhuma renovação encontrada."
        table={table}
      />
    </div>
  )
}

export interface InventoryRecord {
  id: string
  name: string
  price: number
  sku: string
}

export const inventoryRecords: readonly InventoryRecord[] = [
  { id: 'INV-1', name: 'Teclado mecânico', price: 349.9, sku: 'KB-100' },
  { id: 'INV-2', name: 'Mouse sem fio', price: 129, sku: 'MS-210' },
  { id: 'INV-3', name: 'Monitor 27 polegadas', price: 1899, sku: 'MN-270' },
]

export const PRICE_NEGATIVE_MESSAGE = 'O preço não pode ser negativo.'
export const SKU_REQUIRED_MESSAGE = 'O SKU é obrigatório.'

const NO_SERVER_ERRORS: Readonly<Record<string, string>> = {}

export function InventoryGrid({
  onCellValueChange,
  serverErrors = NO_SERVER_ERRORS,
}: Readonly<{
  onCellValueChange?: (change: DataGridCellValueChange) => void
  serverErrors?: Readonly<Record<string, string>>
}>): ReactElement {
  const [records, setRecords] = useState([...inventoryRecords])
  const columns = useMemo<DataGridColumnDef<InventoryRecord>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Produto',
        meta: { label: 'Produto', type: 'title' },
        size: 220,
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
        meta: {
          editable: true,
          getCellError: (row, columnId) =>
            serverErrors[`${row.id}:${columnId}`],
          label: 'SKU',
          validate: (value) =>
            value.trim() === '' ? SKU_REQUIRED_MESSAGE : undefined,
        },
        size: 140,
      },
      {
        accessorKey: 'price',
        header: 'Preço',
        meta: {
          align: 'end',
          editable: true,
          label: 'Preço',
          validate: (value) =>
            Number(value) < 0 ? PRICE_NEGATIVE_MESSAGE : undefined,
          variant: 'number',
        },
        size: 160,
      },
    ],
    [serverErrors],
  )
  const handleChange = useCallback(
    (change: DataGridCellValueChange) => {
      onCellValueChange?.(change)
      setRecords((current) =>
        current.map((record) =>
          record.id === change.rowId
            ? {
                ...record,
                [change.columnId]:
                  change.columnId === 'price'
                    ? Number(change.value)
                    : change.value,
              }
            : record,
        ),
      )
    },
    [onCellValueChange],
  )
  const { table } = useDataGrid<InventoryRecord>({
    columns,
    data: records,
    density: 'medium',
    getRowId: (record) => record.id,
    onCellValueChange: handleChange,
  })

  return (
    <DataGrid<InventoryRecord>
      aria-label="Estoque"
      fillColumn={false}
      table={table}
    />
  )
}

export const PAGE_SIZE_OPTIONS = [3, 5, 8] as const

export interface ProjectRow {
  id: string
  name: string
  owner: string
}

const projectRows: ProjectRow[] = gridProjects.map((project) => ({
  id: project.id,
  name: project.name,
  owner: project.owner,
}))

const projectColumns: DataGridColumnDef<ProjectRow>[] = [
  {
    accessorKey: 'name',
    header: 'Projeto',
    meta: { label: 'Projeto', type: 'title' },
    size: 240,
  },
  {
    accessorKey: 'owner',
    header: 'Responsável',
    meta: { label: 'Responsável', type: 'person' },
    size: 180,
  },
]

export function PageSizeGrid(): ReactElement {
  const { table } = useDataGrid<ProjectRow>({
    columns: projectColumns,
    data: projectRows,
    enablePagination: true,
    getRowId: (project) => project.id,
    pageSize: 5,
  })

  return (
    <DataGrid<ProjectRow>
      aria-label="Projetos"
      footer={
        <DataGridPagination
          pageSizeLabel="Linhas por página"
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          table={table}
        />
      }
      table={table}
    />
  )
}
