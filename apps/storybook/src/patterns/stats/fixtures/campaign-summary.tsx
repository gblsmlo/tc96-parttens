import {
  Amount,
  type AmountFormatOptions,
  CardWidgetShell,
  clampRatio,
  formatAmount,
  IconFrame,
  ProgressRing,
} from '@tc96/parttens'
import { CardPanel } from '@tc96/ui/card'
import { MeterPrimitive } from '@tc96/ui/meter'
import { SproutIcon, UsersIcon, WalletIcon } from 'lucide-react'
import { type ReactElement, type ReactNode, useId } from 'react'
import {
  type Campaign,
  isLearning,
  LEARNING_PHASE_RESULTS,
  objectiveOptions,
} from '../../collection-views/fixtures/campaigns'

const LOCALE = 'pt-BR'
const VISIBLE_OBJECTIVES = 3

const currency: AmountFormatOptions = { currency: 'BRL', locale: LOCALE }
const count: AmountFormatOptions = {
  locale: LOCALE,
  maximumFractionDigits: 0,
  style: 'decimal',
}
const share: AmountFormatOptions = {
  locale: LOCALE,
  maximumFractionDigits: 1,
  style: 'percent',
}

type CampaignsProps = Readonly<{ campaigns: readonly Campaign[] }>

const percent = (ratio: number) =>
  formatAmount(ratio, { ...share, maximumFractionDigits: 0 })

const detailText = 'text-muted-foreground text-sm'

function SummaryCard({
  adornment,
  children,
  label,
  value,
}: Readonly<{
  adornment: ReactNode
  children: ReactNode
  label: string
  value: ReactNode
}>): ReactElement {
  const titleId = useId()
  return (
    <CardWidgetShell aria-labelledby={titleId} data-widget="campaign-summary">
      <CardPanel className="grid content-start gap-4 p-5">
        <div className="flex h-9 items-center justify-between gap-3">
          <h3 className="truncate text-muted-foreground text-sm" id={titleId}>
            {label}
          </h3>
          {adornment}
        </div>
        <div className="font-medium text-4xl leading-tight tracking-tight tabular-nums">
          {value}
        </div>
        {children}
      </CardPanel>
    </CardWidgetShell>
  )
}

const sumOf = <TItem,>(
  items: readonly TItem[],
  pick: (item: TItem) => number,
) => items.reduce((total, item) => total + pick(item), 0)

function SpendCard({ campaigns }: CampaignsProps): ReactElement {
  const spend = sumOf(campaigns, (campaign) => campaign.spend)
  const segments = objectiveOptions
    .map((option) => ({
      id: option.value,
      label: option.label,
      value: sumOf(
        campaigns.filter((campaign) => campaign.objective === option.value),
        (campaign) => campaign.spend,
      ),
    }))
    .filter((segment) => segment.value > 0)
    .sort((a, b) => b.value - a.value)
  const others = sumOf(
    segments.slice(VISIBLE_OBJECTIVES),
    (segment) => segment.value,
  )
  const rows = [
    ...segments.slice(0, VISIBLE_OBJECTIVES).map((segment, index) => ({
      ...segment,
      color: `var(--chart-${index + 1})`,
    })),
    ...(others > 0
      ? [
          {
            color: 'var(--muted-foreground)',
            id: 'others',
            label: 'Outros',
            value: others,
          },
        ]
      : []),
  ]

  return (
    <SummaryCard
      adornment={
        <IconFrame shape="rounded">
          <WalletIcon />
        </IconFrame>
      }
      label="Investido"
      value={<Amount dimFraction format={currency} value={spend} />}
    >
      {rows.length ? (
        <div className="grid gap-3">
          <div
            aria-hidden="true"
            className="flex h-2 gap-0.5 overflow-hidden rounded-full"
          >
            {rows.map((row) => (
              <span
                key={row.id}
                style={{
                  backgroundColor: row.color,
                  flexBasis: 0,
                  flexGrow: row.value,
                }}
              />
            ))}
          </div>
          <ul
            aria-label="Investido por objetivo"
            className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs"
          >
            {rows.map((row) => (
              <li className="flex min-w-0 items-center gap-1.5" key={row.id}>
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: row.color }}
                />
                <span className="truncate" title={row.label}>
                  {row.label}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {formatAmount(row.value / spend, share)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </SummaryCard>
  )
}

function ReachCard({ campaigns }: CampaignsProps): ReactElement {
  const reach = sumOf(campaigns, (campaign) => campaign.reach)
  const impressions = sumOf(campaigns, (campaign) => campaign.impressions)
  const frequency = formatAmount(reach > 0 ? impressions / reach : 0, {
    ...count,
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })

  return (
    <SummaryCard
      adornment={
        <IconFrame shape="rounded">
          <UsersIcon />
        </IconFrame>
      }
      label="Alcance"
      value={<Amount format={count} value={reach} />}
    >
      <p className={detailText}>
        {reach > 0 ? `${frequency} impressões por pessoa` : 'Sem impressões'}
      </p>
    </SummaryCard>
  )
}

function DeliveryCard({ campaigns }: CampaignsProps): ReactElement {
  const total = campaigns.length
  const active = campaigns.filter(({ status }) => status === 'active').length
  const ratio = clampRatio(active, total)

  return (
    <SummaryCard
      adornment={
        <ProgressRing className="size-9" empty={total === 0} ratio={ratio} />
      }
      label="Em veiculação"
      value={<Amount format={count} value={active} />}
    >
      <p className={detailText}>
        de {total} {total === 1 ? 'campanha' : 'campanhas'}
        {total > 0 ? ` · ${percent(ratio)}` : null}
      </p>
    </SummaryCard>
  )
}

function LearningCard({ campaigns }: CampaignsProps): ReactElement {
  const learning = campaigns.filter(isLearning)
  const results = sumOf(learning, (campaign) => campaign.results)
  const target = learning.length * LEARNING_PHASE_RESULTS

  return (
    <SummaryCard
      adornment={
        <IconFrame shape="rounded">
          <SproutIcon />
        </IconFrame>
      }
      label="Em aprendizado"
      value={<Amount format={count} value={learning.length} />}
    >
      {target > 0 ? (
        <MeterPrimitive.Root
          aria-label="Resultados na fase de aprendizado"
          className="grid gap-2"
          max={target}
          min={0}
          value={Math.min(results, target)}
        >
          <MeterPrimitive.Track className="block h-2 overflow-hidden rounded-full bg-muted">
            <MeterPrimitive.Indicator className="block h-full rounded-full bg-primary" />
          </MeterPrimitive.Track>
          <div
            className={`flex justify-between gap-3 tabular-nums ${detailText}`}
          >
            <span>
              {formatAmount(results, count)} de {formatAmount(target, count)}{' '}
              resultados
            </span>
            <span>{percent(results / target)}</span>
          </div>
        </MeterPrimitive.Root>
      ) : (
        <p className={detailText}>Nenhuma campanha em aprendizado</p>
      )}
    </SummaryCard>
  )
}

export function CampaignSummary({ campaigns }: CampaignsProps): ReactElement {
  const titleId = useId()
  return (
    <section aria-labelledby={titleId}>
      <h2 className="sr-only" id={titleId}>
        Resumo das campanhas
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SpendCard campaigns={campaigns} />
        <ReachCard campaigns={campaigns} />
        <DeliveryCard campaigns={campaigns} />
        <LearningCard campaigns={campaigns} />
      </div>
    </section>
  )
}
