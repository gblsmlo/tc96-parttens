import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Agenda1,
  type Agenda1Kind,
  type Agenda1Mode,
  type Agenda1Period,
  agenda1Window,
} from '@tc96/ui/blocks/data/agenda/agenda-1'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import {
  type Agenda1WindowPage,
  agenda1Handlers,
} from '../../../../mocks/agenda-1.ts'
import { fetchJson } from '../../../../mocks/api.ts'
import {
  agendaAnchor,
  agendaNow,
  agendaTimeZone,
  owners,
} from '../fixtures/agenda-1.ts'

const TeamAgenda = () => {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Agenda1Mode>('calendar')
  const [period, setPeriod] = useState<Agenda1Period>('week')
  const [anchor, setAnchor] = useState(agendaAnchor)
  const [kindFilter, setKindFilter] = useState<Agenda1Kind[]>([])
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)

  const { from, to } = agenda1Window(anchor, period, agendaTimeZone)
  const params = new URLSearchParams({ from, to })
  for (const kind of kindFilter) params.append('kind', kind)
  if (ownerFilter) params.set('ownerId', ownerFilter)
  const queryKey = ['data', 'agenda', 'entries', params.toString()]

  const { data, isError, isPending, refetch } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () =>
      fetchJson<Agenda1WindowPage>(`/data/agenda/entries?${params.toString()}`),
    queryKey,
  })
  const update = (change: (page: Agenda1WindowPage) => Agenda1WindowPage) =>
    queryClient.setQueryData<Agenda1WindowPage>(queryKey, (current) =>
      current ? change(current) : current,
    )

  return (
    <Agenda1
      anchor={anchor}
      entries={data?.items ?? []}
      error={isError}
      filtered={kindFilter.length > 0 || Boolean(ownerFilter)}
      kindFilter={kindFilter}
      mode={mode}
      now={agendaNow}
      onAnchorChange={setAnchor}
      onCancel={(entryId) =>
        update((page) => ({
          items: page.items.filter((entry) => entry.id !== entryId),
        }))
      }
      onKindFilterChange={setKindFilter}
      onModeChange={setMode}
      onOwnerFilterChange={setOwnerFilter}
      onPeriodChange={setPeriod}
      onReschedule={({ allDay, end, entry, start }) => {
        update((page) => ({
          items: page.items.map((item) =>
            item.id === entry.id ? { ...item, allDay, end, start } : item,
          ),
        }))
        return true
      }}
      onRetry={() => refetch()}
      ownerFilter={ownerFilter}
      owners={owners}
      pending={isPending}
      period={period}
      timeZone={agendaTimeZone}
    />
  )
}

const meta = {
  component: TeamAgenda,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Agenda/Agenda1/Usages',
} satisfies Meta<typeof TeamAgenda>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(agenda1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('article', {
        name: 'Compromisso: Ligação com o contador',
      }),
    ).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-calendar-mode="week"]'),
    ).not.toBeNull()
  },
}

export const NextWeek: Story = {
  beforeEach: ({ msw }) => {
    msw.use(agenda1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByRole('article', {
      name: 'Compromisso: Ligação com o contador',
    })
    await userEvent.click(
      canvas.getByRole('button', { name: 'Próximo período' }),
    )
    await expect(
      await canvas.findByRole('article', {
        name: 'Compromisso: Reunião de planejamento de 2027',
      }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(agenda1Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    const view = canvasElement.querySelector('[data-calendar-mode="week"]')
    await expect(view).not.toBeNull()
    await waitFor(() => expect(view).not.toHaveAttribute('aria-busy'))
    await expect(
      canvasElement.querySelector('[data-slot="calendar-event-chip"]'),
    ).toBeNull()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(agenda1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvasElement.querySelector('[data-slot="calendar-view"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByRole('button', { name: 'Hoje' })).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(agenda1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar a agenda',
      ),
    ).toBeVisible()
  },
}
