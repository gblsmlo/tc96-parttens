import { parseDateValue } from '@tc96/helpers/date'
import { formatAmount } from '@tc96/helpers/format'
import {
  createSelectColumn,
  type DataGridColumnDef,
  type DataTableAggregations,
  type DataTableColumnDef,
  type DataTableColumnMeta,
  DateRangeProperty,
  FlagProperty,
  ListRow,
  ProgressRing,
  SelectProperty,
  TagsProperty,
} from '@tc96/parttens'
import { Checkbox } from '@tc96/ui/checkbox'
import { CircleSlashIcon, ScanEyeIcon } from 'lucide-react'
import {
  budgetTypeLabels,
  type Campaign,
  type CampaignPlacement,
  clickThroughRate,
  costPerResult,
  isCampaignStatus,
  isLearning,
  LEARNING_PHASE_RESULTS,
  objectiveOptions,
  placementOptions,
  resultLabels,
  statusOptions,
} from './campaigns'

const LOCALE = 'pt-BR'

const formatCurrency = (value: number) =>
  formatAmount(value, { currency: 'BRL', locale: LOCALE })

const formatCount = (value: number) =>
  formatAmount(value, {
    locale: LOCALE,
    maximumFractionDigits: 0,
    style: 'decimal',
  })

const formatRate = (value: number) =>
  formatAmount(value, { locale: LOCALE, style: 'percent' })

export const formatBudget = (campaign: Campaign) =>
  `${formatAmount(campaign.budget, {
    currency: 'BRL',
    locale: LOCALE,
    maximumFractionDigits: 0,
  })} ${budgetTypeLabels[campaign.budgetType]}`

const formatOptional = (
  value: number | null,
  format: (value: number) => string,
) => (value === null ? '—' : format(value))

export type CampaignChange = Partial<Omit<Campaign, 'id'>>
export type UpdateCampaign = (id: string, change: CampaignChange) => void

interface FieldProps {
  campaign: Campaign
  onChange: UpdateCampaign
}

export function StatusField({ campaign, onChange }: Readonly<FieldProps>) {
  return (
    <SelectProperty
      ariaLabel="Status"
      onValueChange={(value) => {
        if (value && isCampaignStatus(value))
          onChange(campaign.id, { status: value })
      }}
      options={statusOptions}
      value={campaign.status}
    />
  )
}

export function ObjectiveField({ campaign }: Readonly<{ campaign: Campaign }>) {
  return (
    <SelectProperty
      ariaLabel="Objetivo"
      options={objectiveOptions}
      readOnly
      value={campaign.objective}
      variant="plain"
    />
  )
}

export function PlacementsField({
  campaign,
}: Readonly<{ campaign: Campaign }>) {
  return (
    <TagsProperty<CampaignPlacement>
      ariaLabel="Posicionamentos"
      display="chips"
      options={placementOptions}
      readOnly
      value={campaign.placements}
      variant="badge"
    />
  )
}

export function ScheduleField({ campaign }: Readonly<{ campaign: Campaign }>) {
  return (
    <DateRangeProperty
      ariaLabel="Veiculação"
      locale={LOCALE}
      readOnly
      value={{
        from: parseDateValue(campaign.startDate),
        to: campaign.endDate ? parseDateValue(campaign.endDate) : undefined,
      }}
      variant="plain"
    />
  )
}

export function PixelField({ campaign }: Readonly<{ campaign: Campaign }>) {
  return (
    <FlagProperty
      active={campaign.pixel}
      activeIcon={ScanEyeIcon}
      ariaLabel="Meta Pixel"
      inactiveIcon={CircleSlashIcon}
      inactiveLabel="Sem pixel"
      label="Pixel ativo"
      showInactive
      variant="plain"
    />
  )
}

export function LearningField({ campaign }: Readonly<{ campaign: Campaign }>) {
  if (!isLearning(campaign)) {
    return (
      <span className="text-muted-foreground text-sm">
        {campaign.status === 'active' ? 'Estável' : '—'}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm tabular-nums">
      <ProgressRing
        className="size-4"
        ratio={campaign.results / LEARNING_PHASE_RESULTS}
        strokeWidth={14}
      />
      Aprendizado {campaign.results}/{LEARNING_PHASE_RESULTS}
    </span>
  )
}

export function ResultsField({ campaign }: Readonly<{ campaign: Campaign }>) {
  return (
    <span className="flex w-full flex-col items-end leading-tight">
      <span className="tabular-nums">{formatCount(campaign.results)}</span>
      <span className="text-muted-foreground text-xs">
        {resultLabels[campaign.objective]}
      </span>
    </span>
  )
}

const numeric = (value: string) => (
  <span className="block w-full text-end tabular-nums">{value}</span>
)

const countOf = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`

export const campaignTableColumnLabels: Record<string, string> = {
  budget: 'Orçamento',
  costPerResult: 'Custo por resultado',
  ctr: 'CTR',
  learning: 'Aprendizado',
  name: 'Campanha',
  reach: 'Alcance',
  results: 'Resultados',
  spend: 'Valor usado',
  startDate: 'Veiculação',
  status: 'Status',
}

const numericHeader = (id: string) => () =>
  numeric(campaignTableColumnLabels[id])

const countedColumn: DataTableColumnMeta<Campaign> = {
  aggregations: ['count'],
  formatAggregation: formatCount,
}

const countedNumericColumn: DataTableColumnMeta<Campaign> = {
  ...countedColumn,
  align: 'end',
}

const summedColumn = (
  format: (value: number) => string,
): DataTableColumnMeta<Campaign> => ({
  aggregations: ['count', 'sum'],
  align: 'end',
  formatAggregation: (value, aggregation) =>
    aggregation === 'sum' ? format(value) : formatCount(value),
})

export const campaignTableAggregations: DataTableAggregations = {
  name: 'count',
  spend: 'sum',
}

export const renderCampaignListRow =
  (updateCampaign: UpdateCampaign) => (campaign: Campaign) => (
    <ListRow
      description={[
        objectiveOptions.find(({ value }) => value === campaign.objective)
          ?.label,
        formatBudget(campaign),
        `${formatCurrency(campaign.spend)} usados`,
      ]}
      key={campaign.id}
      properties={
        <div className="flex items-center gap-3">
          {campaign.status === 'active' ? (
            <LearningField campaign={campaign} />
          ) : null}
          <StatusField campaign={campaign} onChange={updateCampaign} />
        </div>
      }
      title={campaign.name}
    />
  )

export const createCampaignGridColumns = (
  onChange: UpdateCampaign,
): DataGridColumnDef<Campaign>[] => [
  createSelectColumn<Campaign>(),
  {
    accessorKey: 'name',
    enableHiding: false,
    header: 'Campanha',
    meta: { label: 'Campanha', type: 'title' },
    minSize: 260,
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => (
      <StatusField campaign={row.original} onChange={onChange} />
    ),
    header: 'Status',
    meta: { label: 'Status', type: 'status' },
    minSize: 150,
  },
  {
    accessorKey: 'objective',
    cell: ({ row }) => <ObjectiveField campaign={row.original} />,
    header: 'Objetivo',
    meta: { label: 'Objetivo', type: 'select' },
    minSize: 170,
  },
  {
    accessorFn: (campaign) => campaign.results,
    cell: ({ row }) => <LearningField campaign={row.original} />,
    header: 'Aprendizado',
    id: 'learning',
    meta: { label: 'Aprendizado', type: 'text' },
    minSize: 170,
  },
  {
    accessorKey: 'budget',
    cell: ({ row }) => numeric(formatBudget(row.original)),
    header: 'Orçamento',
    meta: { align: 'end', label: 'Orçamento', type: 'number' },
    minSize: 150,
  },
  {
    accessorKey: 'spend',
    cell: ({ row }) => numeric(formatCurrency(row.original.spend)),
    header: 'Valor usado',
    meta: { align: 'end', label: 'Valor usado', type: 'number' },
    minSize: 140,
  },
  {
    accessorKey: 'results',
    cell: ({ row }) => numeric(formatCount(row.original.results)),
    header: 'Resultados',
    meta: { align: 'end', label: 'Resultados', type: 'number' },
    minSize: 130,
  },
  {
    accessorFn: (campaign) => resultLabels[campaign.objective],
    header: 'Tipo de resultado',
    id: 'resultType',
    meta: { label: 'Tipo de resultado', type: 'text' },
    minSize: 180,
  },
  {
    accessorFn: (campaign) => costPerResult(campaign) ?? 0,
    cell: ({ row }) =>
      numeric(formatOptional(costPerResult(row.original), formatCurrency)),
    header: 'Custo por resultado',
    id: 'costPerResult',
    meta: { align: 'end', label: 'Custo por resultado', type: 'formula' },
    minSize: 170,
  },
  {
    accessorKey: 'reach',
    cell: ({ row }) => numeric(formatCount(row.original.reach)),
    header: 'Alcance',
    meta: { align: 'end', label: 'Alcance', type: 'number' },
    minSize: 120,
  },
  {
    accessorKey: 'impressions',
    cell: ({ row }) => numeric(formatCount(row.original.impressions)),
    header: 'Impressões',
    meta: { align: 'end', label: 'Impressões', type: 'number' },
    minSize: 130,
  },
  {
    accessorFn: (campaign) => clickThroughRate(campaign) ?? 0,
    cell: ({ row }) =>
      numeric(formatOptional(clickThroughRate(row.original), formatRate)),
    header: 'CTR',
    id: 'ctr',
    meta: { align: 'end', label: 'CTR', type: 'formula' },
    minSize: 100,
  },
  {
    accessorFn: (campaign) => campaign.placements.join(),
    cell: ({ row }) => <PlacementsField campaign={row.original} />,
    header: 'Posicionamentos',
    id: 'placements',
    meta: { label: 'Posicionamentos', type: 'multi-select' },
    minSize: 340,
  },
  {
    accessorKey: 'startDate',
    cell: ({ row }) => <ScheduleField campaign={row.original} />,
    header: 'Veiculação',
    meta: { label: 'Veiculação', type: 'date' },
    minSize: 200,
  },
  {
    accessorFn: (campaign) => `${campaign.adSetCount}/${campaign.adCount}`,
    cell: ({ row }) =>
      numeric(`${row.original.adSetCount} / ${row.original.adCount}`),
    header: 'Conjuntos / anúncios',
    id: 'structure',
    meta: { align: 'end', label: 'Conjuntos / anúncios', type: 'rollup' },
    minSize: 210,
  },
  {
    accessorKey: 'pixel',
    cell: ({ row }) => <PixelField campaign={row.original} />,
    header: 'Meta Pixel',
    meta: { label: 'Meta Pixel', type: 'checkbox' },
    minSize: 140,
  },
]

export const createCampaignTableColumns = (
  onChange: UpdateCampaign,
): DataTableColumnDef<Campaign>[] => [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Selecionar ${row.original.name}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
      />
    ),
    header: ({ table }) => (
      <Checkbox
        aria-label="Selecionar todas as campanhas"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(Boolean(value))
        }
      />
    ),
    id: 'select',
  },
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-medium">{row.original.name}</span>
        <span className="truncate text-muted-foreground text-xs">
          {[
            objectiveOptions.find(
              ({ value }) => value === row.original.objective,
            )?.label,
            countOf(row.original.adSetCount, 'conjunto', 'conjuntos'),
            countOf(row.original.adCount, 'anúncio', 'anúncios'),
          ].join(' · ')}
        </span>
      </div>
    ),
    header: 'Campanha',
    meta: countedColumn,
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => (
      <StatusField campaign={row.original} onChange={onChange} />
    ),
    header: 'Status',
    meta: countedColumn,
  },
  {
    cell: ({ row }) => <LearningField campaign={row.original} />,
    header: 'Aprendizado',
    id: 'learning',
    meta: countedColumn,
  },
  {
    accessorKey: 'budget',
    cell: ({ row }) => numeric(formatBudget(row.original)),
    header: numericHeader('budget'),
    meta: countedNumericColumn,
  },
  {
    accessorKey: 'spend',
    cell: ({ row }) => numeric(formatCurrency(row.original.spend)),
    header: numericHeader('spend'),
    meta: summedColumn(formatCurrency),
  },
  {
    accessorKey: 'results',
    cell: ({ row }) => <ResultsField campaign={row.original} />,
    header: numericHeader('results'),
    meta: countedNumericColumn,
  },
  {
    cell: ({ row }) =>
      numeric(formatOptional(costPerResult(row.original), formatCurrency)),
    header: numericHeader('costPerResult'),
    id: 'costPerResult',
    meta: countedNumericColumn,
  },
  {
    accessorKey: 'reach',
    cell: ({ row }) => numeric(formatCount(row.original.reach)),
    header: numericHeader('reach'),
    meta: summedColumn(formatCount),
  },
  {
    cell: ({ row }) =>
      numeric(formatOptional(clickThroughRate(row.original), formatRate)),
    header: numericHeader('ctr'),
    id: 'ctr',
    meta: countedNumericColumn,
  },
  {
    accessorKey: 'startDate',
    cell: ({ row }) => <ScheduleField campaign={row.original} />,
    header: 'Veiculação',
    meta: countedColumn,
  },
]
