import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard5 } from '@tc96/ui/blocks/application/dashboard/dashboard-5'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  appointments,
  dashboard5TimeZone,
  deadlines,
  queues,
} from '../fixtures/dashboard-5.ts'
import {
  type Dashboard5Controls,
  dashboard5ControlArgs,
} from './dashboard-5-controls.ts'
import { ComposedDashboard5 } from './dashboard-5-layouts.tsx'

const meta = {
  args: { ...dashboard5ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard5/Behavior',
} satisfies Meta<Dashboard5Controls & { onRetry: () => void }>

export default meta

type Story = StoryObj<typeof meta>

const baseProps = {
  appointments,
  deadlines,
  queues,
  renderLink: renderAnchor,
  timeZone: dashboard5TimeZone,
}

export const HeaderShowsBreadcrumbAndTitle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('navigation', { name: 'Navegação estrutural' }),
    ).toHaveTextContent('Pendências')
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Pendências' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('combobox')).toBeNull()
  },
}

export const MetricCardsLinkToTheirQueues: Story = {
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-metric="due-soon"]')
    await expect(card).toHaveTextContent('7')
    await expect(card).toHaveTextContent('o primeiro em 26/11')
    await expect(
      within(canvasElement).getByRole('link', {
        name: 'Vencem em até 5 dias úteis',
      }),
    ).toHaveAttribute('href', '/juridico/prazos?view=week')
    await expect(
      within(canvasElement).getByRole('link', { name: 'Prazos atrasados' }),
    ).toHaveAttribute('href', '/juridico/prazos?view=overdue')
  },
}

export const CaptureCardShowsItsState: Story = {
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-metric="capture"]')
    await expect(card).toHaveTextContent('Em dia')
    await expect(card).toHaveTextContent('última varredura às 07:30')
  },
}

export const OwnerCardsAndPublicationsRenderOnlyWhenGiven: Story = {
  args: { ownerView: false },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-metric]')).toHaveLength(
      2,
    )
    await expect(
      within(canvasElement).queryByRole('list', {
        name: 'Publicações para decidir',
      }),
    ).toBeNull()
  },
}

export const DeadlineRowsLinkToTheLawsuit: Story = {
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Meus prazos',
    })
    await expect(
      within(list).getByRole('link', { name: 'Contestação' }),
    ).toHaveAttribute('href', '/juridico/processos/lw-1')
    const row = canvasElement.querySelector('[data-item="dl-2"]')
    await expect(row).toHaveTextContent('Ação de cobrança · fatal 25/11')
    await expect(row?.querySelector('[data-urgency]')).toHaveTextContent(
      'Vence hoje',
    )
    await expect(row?.querySelector('[data-urgency]')).toHaveAttribute(
      'data-urgency',
      'today',
    )
  },
}

export const PublicationsLinkToTheirDecision: Story = {
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Publicações para decidir',
    })
    await expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    await expect(
      within(list).getByRole('link', { name: 'Intimação · TJSP' }),
    ).toHaveAttribute('href', '/juridico/publicacoes?publicacao=pub-1')
    await expect(list).toHaveTextContent('Decidir')
  },
}

export const AppointmentsShowDayAndTimeInTheTimeZone: Story = {
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-item="ap-1"]')
    await expect(row).toHaveTextContent('27/11 · 14:00')
    await expect(row).toHaveTextContent('Silva x Banco')
    await expect(
      within(canvasElement).getByRole('link', {
        name: 'Audiência de conciliação',
      }),
    ).toHaveAttribute('href', '/juridico/processos/lw-4')
  },
}

export const PanelLinksOpenTheFullPages: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Abrir Prazos' }),
    ).toHaveAttribute('href', '/juridico/prazos')
    await expect(
      canvas.getByRole('link', { name: 'Abrir fila' }),
    ).toHaveAttribute('href', '/juridico/publicacoes')
    await expect(
      canvas.getByRole('link', { name: 'Abrir Agenda' }),
    ).toHaveAttribute('href', '/agenda')
  },
}

export const PanelLinksRenderOnlyWithLinks: Story = {
  args: { panelLinks: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('link', { name: 'Abrir Prazos' }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('link', { name: 'Abrir Agenda' }),
    ).toBeNull()
  },
}

export const QueueChartHasNameAndTextSummary: Story = {
  play: async ({ canvasElement }) => {
    const chart = await within(canvasElement).findByRole('img', {
      name: 'Prazos em cada fila',
    })
    await expect(chart.querySelector('desc')).toHaveTextContent(
      'Até 5 dias úteis: 7; Sem responsável: 3; Todos: 18',
    )
  },
}

export const QueueListLinksEachQueue: Story = {
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Filas de prazo',
    })
    await expect(
      within(list).getByRole('link', { name: 'Sem responsável' }),
    ).toHaveAttribute('href', '/juridico/prazos?view=unassigned')
    await expect(
      canvasElement.querySelector('[data-queue="all"]'),
    ).toHaveTextContent('18')
  },
}

export const DueDaysChartHasNameAndTextSummary: Story = {
  play: async ({ canvasElement }) => {
    const chart = await within(canvasElement).findByRole('img', {
      name: 'Prazos que vencem em cada um dos próximos dias úteis',
    })
    await expect(chart.querySelector('desc')).toHaveTextContent(
      '25/11: 2; 26/11: 1; 27/11: 0; 30/11: 3; 01/12: 1',
    )
  },
}

export const DueDaysChartDropsWithoutDays: Story = {
  render: () => <Dashboard5 {...baseProps} />,
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByRole('img', {
      name: 'Prazos em cada fila',
    })
    await expect(
      within(canvasElement).queryByRole('img', {
        name: 'Prazos que vencem em cada um dos próximos dias úteis',
      }),
    ).toBeNull()
  },
}

export const EmptyListsShowTheirMessages: Story = {
  render: () => (
    <Dashboard5
      {...baseProps}
      appointments={[]}
      deadlines={[]}
      publications={[]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Nenhum prazo seu em andamento.'),
    ).toBeVisible()
    await expect(
      canvas.getByText(
        'Nenhuma publicação para decidir. As novas chegam com a próxima captura.',
      ),
    ).toBeVisible()
    await expect(
      canvas.getByText('Nenhum compromisso marcado nos seus processos.'),
    ).toBeVisible()
  },
}

export const EmptyShowsEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma pendência')).toBeVisible()
    await expect(canvas.queryByRole('list', { name: 'Meus prazos' })).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando pendências'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByText('Pendências')).toBeVisible()
    await expect(canvas.queryByRole('img')).toBeNull()
  },
}

export const ErrorShowsSurfaceAndRetryCallsOnRetry: Story = {
  args: { error: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Não foi possível carregar.')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar de novo' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesTheButton: Story = {
  render: () => <Dashboard5 {...baseProps} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar de novo' }),
    ).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  render: () => (
    <Dashboard5 appointments={[]} deadlines={[]} error pending queues={[]} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando pendências')).toBeVisible()
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => (
    <Dashboard5 appointments={[]} deadlines={[]} error queues={[]} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.queryByText('Nenhuma pendência')).toBeNull()
  },
}

export const LocaleFormatsCounts: Story = {
  render: () => (
    <Dashboard5
      {...baseProps}
      locale="en-US"
      queues={[{ count: 1200, id: 'all', label: 'Todos' }]}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-queue="all"]'),
    ).toHaveTextContent('1,200')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Dashboard5
      {...baseProps}
      labels={{
        captureStates: {
          running: 'Up to date',
          simulated: 'Simulated',
          stopped: 'Stopped',
        },
        deadlinesTitle: 'My deadlines',
        queuesTitle: 'Deadline queues',
      }}
      metrics={{ capture: { state: 'running' } }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('list', { name: 'My deadlines' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('list', { name: 'Deadline queues' }),
    ).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-metric="capture"]'),
    ).toHaveTextContent('Up to date')
  },
}
