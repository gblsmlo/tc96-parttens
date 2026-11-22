import {
  type Activity,
  ActivityFeedWidget,
  ContactWidget,
  DealsWidget,
  IconFrame,
  MarketShareWidget,
  MetricWidget,
  PipelineWidget,
  type WidgetExpandProps,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { EllipsisIcon, TargetIcon, UsersIcon } from 'lucide-react'
import { type ReactElement, useState } from 'react'
import type { CrmControls } from './crm-controls.ts'
import {
  activities,
  bareDeals,
  contactActivities,
  deals,
  leadSources,
  type PipelinePeriod,
  people,
  pipelinePeriods,
  pipelineStages,
} from './crm-data.tsx'

const viewAll = (
  <Button size="sm" variant="ghost">
    View all
  </Button>
)

export function SalesPipeline(): ReactElement {
  const [period, setPeriod] = useState<PipelinePeriod>('month')

  return (
    <PipelineWidget
      onPeriodChange={setPeriod}
      period={period}
      periodLabel="Pipeline period"
      periods={pipelinePeriods}
      stages={pipelineStages[period]}
      title="Sales pipeline"
      totalLabel="Open pipeline value"
    />
  )
}

export function TopDeals(): ReactElement {
  return (
    <DealsWidget
      action={viewAll}
      deals={deals}
      ownerLabel="Owner"
      title="Top deals"
    />
  )
}

export function RecentActivity(): ReactElement {
  return <ActivityFeedWidget activities={activities} title="Recent activity" />
}

export function Contact({
  action = true,
  activities: contactItems = contactActivities,
  expand,
}: Readonly<{
  action?: boolean
  activities?: Activity[]
  expand?: WidgetExpandProps
}>): ReactElement {
  return (
    <ContactWidget
      action={
        action ? (
          <Button aria-label="More actions" size="icon-sm" variant="ghost">
            <EllipsisIcon aria-hidden="true" />
          </Button>
        ) : undefined
      }
      activities={contactItems}
      activitiesLabel="Recent activity"
      channelLabels={{ email: 'Email', phone: 'Call', whatsapp: 'WhatsApp' }}
      company="Acme Corp"
      email="ana.martins@acme.com"
      emptyLabel="No activity yet"
      expand={expand}
      jobTitle="Head of Operations"
      person={people.ana}
      phone="+1 415 555 0132"
      tags={[
        { id: 'customer', label: 'Customer' },
        { id: 'decision-maker', label: 'Decision maker' },
      ]}
      whatsapp="+1 415 555 0132"
    />
  )
}

export function LeadSources(): ReactElement {
  return (
    <MarketShareWidget
      endLabel="30 Jun"
      segments={leadSources}
      startLabel="1 Jun"
      title="Lead sources"
    />
  )
}

export function Kpis(): ReactElement {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricWidget
        change={0.12}
        changeLabel="vs. last month"
        format={{ style: 'decimal' }}
        icon={
          <IconFrame>
            <UsersIcon />
          </IconFrame>
        }
        label="New leads"
        value={128}
      />
      <MetricWidget
        change={0.031}
        changeLabel="vs. last month"
        format={{ maximumFractionDigits: 0, style: 'percent' }}
        icon={
          <IconFrame>
            <TargetIcon />
          </IconFrame>
        }
        label="Conversion rate"
        tone="inverted"
        value={0.24}
      />
      <MetricWidget
        change={0.084}
        changeLabel="vs. last month"
        label="Revenue"
        value={184200.5}
      />
    </div>
  )
}

export function ComposedCrm({
  action,
  empty,
  title,
  visibleCount,
  widget,
}: Readonly<CrmControls>): ReactElement {
  const expand = { visibleCount }
  const headerAction = action ? viewAll : undefined

  if (widget === 'pipeline')
    return (
      <PipelineWidget
        action={headerAction}
        expand={expand}
        stages={empty ? [] : pipelineStages.month}
        title={title || 'Sales pipeline'}
        totalLabel="Open pipeline value"
      />
    )
  if (widget === 'activity-feed')
    return (
      <ActivityFeedWidget
        action={headerAction}
        activities={empty ? [] : activities}
        emptyLabel="No activity yet"
        expand={expand}
        title={title || 'Recent activity'}
      />
    )
  if (widget === 'contact')
    return (
      <Contact
        action={action}
        activities={empty ? [] : contactActivities}
        expand={expand}
      />
    )
  return (
    <DealsWidget
      action={headerAction}
      deals={empty ? [] : deals}
      emptyLabel="No open deals"
      expand={expand}
      ownerLabel="Owner"
      title={title || 'Top deals'}
    />
  )
}

export function BareDeals(): ReactElement {
  return <DealsWidget deals={bareDeals} title="Support deals" />
}

export function ContactWithoutActivityCard(): ReactElement {
  return (
    <ContactWidget
      channelLabels={{ email: 'Email', phone: 'Call', whatsapp: 'WhatsApp' }}
      company="Acme Corp"
      email="ana.martins@acme.com"
      jobTitle="Head of Operations"
      person={people.ana}
      phone="+1 415 555 0132"
    />
  )
}

export function ContactNameOnlyCard(): ReactElement {
  return <ContactWidget person={people.gabriel} />
}
