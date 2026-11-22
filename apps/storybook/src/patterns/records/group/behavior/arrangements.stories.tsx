import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { expect, userEvent, waitFor } from 'storybook/test'
import * as activity from '../layouts/activity'
import * as affiliations from '../layouts/affiliations'
import * as court from '../layouts/court'
import * as documents from '../layouts/documents'
import * as events from '../layouts/events'
import * as feed from '../layouts/feed'
import * as finance from '../layouts/finance'
import * as matter from '../layouts/matter'
import * as parties from '../layouts/parties'
import * as relations from '../layouts/relations'
import * as service from '../layouts/service'
import * as tasks from '../layouts/tasks'
import * as timesheet from '../layouts/timesheet'
import { RecordGroupCanvas } from '../record-group-canvas'

const meta = {
  decorators: [RecordGroupCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const rowSelector = [
  '[data-slot="record-group-row"]',
  '[data-slot="record-group-item"]',
  '[data-slot="record-group-link"]',
].join(', ')

const openSubgroups = async (canvasElement: HTMLElement) => {
  for (const trigger of canvasElement.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-subgroup"] h3 > button[aria-expanded="false"]',
  )) {
    await userEvent.click(trigger)
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'true'),
    )
  }
}

const expectRowsFit = async (canvasElement: HTMLElement) => {
  await openSubgroups(canvasElement)
  const rows = canvasElement.querySelectorAll<HTMLElement>(rowSelector)

  await expect(rows.length).toBeGreaterThan(0)
  await waitFor(async () => {
    for (const row of rows) {
      const bound = (row.closest('[data-slot="collapsible-panel"]') ??
        row.closest('[data-slot="record-group"]')) as HTMLElement
      await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
      await expect(row.getBoundingClientRect().right).toBeLessThanOrEqual(
        bound.getBoundingClientRect().right + 0.5,
      )
    }
  })
  for (const heading of canvasElement.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-subgroup"] h3',
  )) {
    await expect(heading.scrollWidth).toBeLessThanOrEqual(heading.clientWidth)
  }
  for (const badge of canvasElement.querySelectorAll<HTMLElement>(
    '[data-slot="badge"][data-color="custom"]',
  )) {
    await expect(badge.getAttribute('style')).toContain('color-mix(in srgb')
  }
}

const stack = (children: ReactNode) => (
  <div className="flex flex-col gap-6">{children}</div>
)

export const ActivityRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
    const titles = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-item-title"]',
    )
    const long = titles[3] as HTMLElement
    const time = long.parentElement?.querySelector('time') as HTMLElement
    await expect(long.scrollWidth).toBeGreaterThan(long.clientWidth)
    await expect(time.scrollWidth).toBeLessThanOrEqual(time.clientWidth)
  },
  render: () =>
    stack(
      <>
        <activity.ActivityGroup title="Atividades" variant="plain" />
        <activity.PhaseHistoryGroup
          title="Histórico de fases"
          variant="plain"
        />
        <activity.FilteredActivityGroup
          title="Atividades com filtro"
          variant="plain"
        />
      </>,
    ),
}

export const AffiliationsRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
  },
  render: () =>
    stack(
      <>
        <affiliations.AffiliationsGroup
          links={affiliations.people}
          title="Pessoas"
          variant="plain"
        />
        <affiliations.AffiliationsGroup
          links={affiliations.companies}
          title="Empresas"
          variant="plain"
        />
        <affiliations.AffiliationsMenuGroup
          title="Pessoas com filtro"
          variant="plain"
          withFilter
        />
      </>,
    ),
}

export const CourtRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
  },
  render: () =>
    stack(
      <>
        <court.CourtGroup title="Tribunal" variant="plain" />
        <court.CourtPropertiesGroup
          title="Tribunal detalhado"
          variant="plain"
        />
      </>,
    ),
}

export const DocumentsRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
    const long = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-link"]',
    )[2] as HTMLElement
    const name = long.querySelector(
      '[data-slot="record-group-link-name"]',
    ) as HTMLElement
    const linkMeta = long.querySelector(
      '[data-slot="record-group-link-meta"]',
    ) as HTMLElement
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth)
    await expect(linkMeta.scrollWidth).toBeLessThanOrEqual(linkMeta.clientWidth)

    for (const trailing of canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-item-trailing"]',
    )) {
      const [label, button] = [...trailing.children] as HTMLElement[]
      await expect(
        (button as HTMLElement).getBoundingClientRect().left -
          (label as HTMLElement).getBoundingClientRect().right,
      ).toBeCloseTo(4, 0)
    }
  },
  render: () =>
    stack(
      <>
        <documents.DocumentsGroup
          entries={documents.files}
          title="Arquivos"
          variant="plain"
        />
        <documents.DocumentsGroup
          entries={documents.resources}
          title="Recursos"
          variant="plain"
        />
        <documents.DocumentsMenuGroup
          title="Arquivos com menu"
          variant="plain"
        />
      </>,
    ),
}

export const EventsRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
  },
  render: () =>
    stack(
      <>
        <events.EventsGroup title="Eventos" variant="plain" />
        <events.EventsMenuGroup title="Eventos com menu" variant="plain" />
      </>,
    ),
}

export const FeedRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
  },
  render: () =>
    stack(
      <>
        <feed.FeedGroup title="Publicações e andamentos" variant="plain" />
        <feed.FilteredFeedGroup
          title="Publicações e andamentos com filtro"
          variant="plain"
        />
      </>,
    ),
}

export const FinanceRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
  },
  render: () =>
    stack(
      <>
        <finance.SummaryGroup title="Honorários" variant="plain" />
        <finance.EntriesGroup title="Lançamentos" variant="plain" />
        <finance.EntriesMenuGroup
          title="Lançamentos com filtro e menu"
          variant="plain"
          withFilter
        />
        <finance.InstallmentsGroup title="Parcelas" variant="plain" />
        <finance.ExpensesGroup title="Despesas" variant="plain" />
        <finance.GroupedFinance title="Financeiro" variant="plain" />
      </>,
    ),
}

export const MatterRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
  },
  render: () => <matter.MatterGroup title="Processo" variant="plain" />,
}

export const PartiesRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
  },
  render: () =>
    stack(
      <>
        <parties.PartiesGroup title="Partes" variant="plain" />
        <parties.PartiesMenuGroup
          title="Partes com filtro"
          variant="plain"
          withFilter
        />
      </>,
    ),
}

export const RelationsRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
  },
  render: () =>
    stack(
      <>
        <relations.RelationsGroup title="Vínculos" variant="plain" />
        <relations.ProceedingsGroup
          title="Vínculos do processo"
          variant="plain"
        />
        <relations.RelationsMenuGroup
          title="Vínculos com menu"
          variant="plain"
        />
      </>,
    ),
}

export const ServiceRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
  },
  render: () =>
    stack(
      <>
        <service.ServiceGroup title="Atendimento" variant="plain" />
        <service.EntriesGroup title="Atendimentos" variant="plain" />
      </>,
    ),
}

export const TasksRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
  },
  render: () =>
    stack(
      <>
        <tasks.TasksGroup title="Tarefas com menu" variant="plain" withMenu />
        <tasks.AgendaGroup title="Agenda" variant="plain" />
        <tasks.ProcessTodoGroup title="Prazos e tarefas" variant="plain" />
      </>,
    ),
}

export const TimesheetRowsFit: Story = {
  play: async ({ canvasElement }) => {
    await expectRowsFit(canvasElement)
    const longTitle = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-item-title"]',
    )[2] as HTMLElement
    await expect(longTitle.scrollWidth).toBeGreaterThan(longTitle.clientWidth)
  },
  render: () =>
    stack(
      <>
        <timesheet.SummaryGroup title="Horas" variant="plain" />
        <timesheet.EntriesGroup title="Lançamentos de horas" variant="plain" />
      </>,
    ),
}
