import type { Meta, StoryObj } from '@storybook/react-vite'
import * as activity from './layouts/activity.tsx'
import * as affiliations from './layouts/affiliations.tsx'
import * as court from './layouts/court.tsx'
import * as documents from './layouts/documents.tsx'
import * as events from './layouts/events.tsx'
import * as feed from './layouts/feed.tsx'
import * as finance from './layouts/finance.tsx'
import * as items from './layouts/items.tsx'
import { LinkedRecordsGroup } from './layouts/links.tsx'
import * as matter from './layouts/matter.tsx'
import { IndicatorsGroup } from './layouts/metrics.tsx'
import * as parties from './layouts/parties.tsx'
import * as relations from './layouts/relations.tsx'
import { PropertiesGroup } from './layouts/rows.tsx'
import * as service from './layouts/service.tsx'
import * as tasks from './layouts/tasks.tsx'
import * as timesheet from './layouts/timesheet.tsx'
import { RecordGroupCanvas } from './record-group-canvas.tsx'

const meta = {
  decorators: [RecordGroupCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const PropertyRows: Story = {
  render: () => <PropertiesGroup />,
}

export const EditablePropertyRows: Story = {
  render: () => <PropertiesGroup editable />,
}

export const BetweenPropertyRows: Story = {
  render: () => <PropertiesGroup align="between" />,
}

export const Items: Story = {
  render: () => <items.InstallmentsGroup editable />,
}

export const ItemsWithMenu: Story = {
  render: () => <items.InstallmentsMenuGroup />,
}

export const ItemsWithLinkTitles: Story = {
  render: () => <items.InstallmentsLinkGroup />,
}

export const Links: Story = {
  render: () => <LinkedRecordsGroup />,
}

export const Metrics: Story = {
  render: () => <IndicatorsGroup />,
}

export const OneColumnMetrics: Story = {
  render: () => <IndicatorsGroup columns={1} />,
}

export const Activity: Story = {
  render: () => <activity.ActivityGroup title="Atividades" variant="plain" />,
}

export const ActivityPhaseHistory: Story = {
  render: () => (
    <activity.PhaseHistoryGroup title="Histórico de fases" variant="plain" />
  ),
}

export const ActivityWithFilter: Story = {
  render: () => (
    <activity.FilteredActivityGroup title="Atividades" variant="plain" />
  ),
}

export const ActivityWithPaging: Story = {
  render: () => (
    <activity.PagedActivityGroup title="Atividades" variant="plain" />
  ),
}

export const Affiliations: Story = {
  render: () => (
    <affiliations.AffiliationsGroup
      links={affiliations.people}
      title="Pessoas"
      variant="plain"
    />
  ),
}

export const AffiliationsWithMenu: Story = {
  render: () => (
    <affiliations.AffiliationsMenuGroup title="Pessoas" variant="plain" />
  ),
}

export const AffiliationsWithFilter: Story = {
  render: () => (
    <affiliations.AffiliationsMenuGroup
      title="Pessoas"
      variant="plain"
      withFilter
    />
  ),
}

export const Court: Story = {
  render: () => <court.CourtGroup title="Tribunal" variant="plain" />,
}

export const CourtWithProperties: Story = {
  render: () => <court.CourtPropertiesGroup title="Tribunal" variant="plain" />,
}

export const DocumentFiles: Story = {
  render: () => (
    <documents.DocumentsGroup
      entries={documents.files}
      title="Documentos"
      variant="plain"
    />
  ),
}

export const MixedDocuments: Story = {
  render: () => (
    <documents.DocumentsGroup
      entries={documents.resources}
      title="Documentos"
      variant="plain"
    />
  ),
}

export const DocumentsWithMenu: Story = {
  render: () => (
    <documents.DocumentsMenuGroup title="Documentos" variant="plain" />
  ),
}

export const Events: Story = {
  render: () => <events.EventsGroup title="Eventos" variant="plain" />,
}

export const EventsWithMenu: Story = {
  render: () => <events.EventsMenuGroup title="Eventos" variant="plain" />,
}

export const Feed: Story = {
  render: () => (
    <feed.FeedGroup title="Publicações e andamentos" variant="plain" />
  ),
}

export const FeedWithFilter: Story = {
  render: () => (
    <feed.FilteredFeedGroup title="Publicações e andamentos" variant="plain" />
  ),
}

export const FeedWithPaging: Story = {
  render: () => (
    <feed.PagedFeedGroup title="Publicações e andamentos" variant="plain" />
  ),
}

export const FinanceSummary: Story = {
  render: () => <finance.SummaryGroup title="Honorários" variant="plain" />,
}

export const FinanceEntries: Story = {
  render: () => <finance.EntriesGroup title="Lançamentos" variant="plain" />,
}

export const FinanceEntriesWithMenu: Story = {
  render: () => (
    <finance.EntriesMenuGroup title="Lançamentos" variant="plain" />
  ),
}

export const FinanceEntriesWithFilterAndMenu: Story = {
  render: () => (
    <finance.EntriesMenuGroup title="Lançamentos" variant="plain" withFilter />
  ),
}

export const FinanceGrouped: Story = {
  render: () => <finance.GroupedFinance title="Financeiro" variant="plain" />,
}

export const FinanceInstallments: Story = {
  render: () => <finance.InstallmentsGroup title="Parcelas" variant="plain" />,
}

export const FinanceExpenses: Story = {
  render: () => <finance.ExpensesGroup title="Despesas" variant="plain" />,
}

export const MatterGrouped: Story = {
  render: () => <matter.MatterGroup title="Processo" variant="plain" />,
}

export const Parties: Story = {
  render: () => <parties.PartiesGroup title="Partes" variant="plain" />,
}

export const PartiesWithMenu: Story = {
  render: () => <parties.PartiesMenuGroup title="Partes" variant="plain" />,
}

export const PartiesWithFilter: Story = {
  render: () => (
    <parties.PartiesMenuGroup title="Partes" variant="plain" withFilter />
  ),
}

export const Relations: Story = {
  render: () => <relations.RelationsGroup title="Vínculos" variant="plain" />,
}

export const RelatedProceedings: Story = {
  render: () => <relations.ProceedingsGroup title="Vínculos" variant="plain" />,
}

export const RelationsWithMenu: Story = {
  render: () => (
    <relations.RelationsMenuGroup title="Vínculos" variant="plain" />
  ),
}

export const ServiceGrouped: Story = {
  render: () => <service.ServiceGroup title="Atendimento" variant="plain" />,
}

export const ServiceEntries: Story = {
  render: () => <service.EntriesGroup title="Atendimentos" variant="plain" />,
}

export const Tasks: Story = {
  render: () => <tasks.TasksGroup title="Tarefas" variant="plain" />,
}

export const TasksWithMenu: Story = {
  render: () => <tasks.TasksGroup title="Tarefas" variant="plain" withMenu />,
}

export const TasksAgenda: Story = {
  render: () => <tasks.AgendaGroup title="Agenda" variant="plain" />,
}

export const TasksGrouped: Story = {
  render: () => (
    <tasks.ProcessTodoGroup title="Prazos e tarefas" variant="plain" />
  ),
}

export const TimesheetSummary: Story = {
  render: () => <timesheet.SummaryGroup title="Horas" variant="plain" />,
}

export const TimesheetEntries: Story = {
  render: () => (
    <timesheet.EntriesGroup title="Lançamentos de horas" variant="plain" />
  ),
}

export const TimesheetWithMenu: Story = {
  render: () => (
    <timesheet.EntriesMenuGroup title="Lançamentos de horas" variant="plain" />
  ),
}
