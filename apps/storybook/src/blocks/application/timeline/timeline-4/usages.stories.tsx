import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Timeline4,
  type Timeline4Entry,
} from '@tc96/blocks/application/timeline/timeline-4'
import { useState } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { timeline4Handlers } from '../../../../mocks/timeline-4.ts'

const ActivitySheet = () => {
  const [open, setOpen] = useState(false)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Timeline4Entry[]>('/timeline/activity'),
    queryKey: ['timeline', 'activity'],
  })

  return (
    <Timeline4
      entries={data ?? []}
      error={isError}
      onOpenChange={setOpen}
      onRetry={() => refetch()}
      open={open}
      pending={isPending}
    />
  )
}

const openSheet = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Ver atividades' }),
  )
  return screen.findByRole('dialog', { name: 'Atividades' })
}

const meta = {
  component: ActivitySheet,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline4/Usages',
} satisfies Meta<typeof ActivitySheet>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline4Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const dialog = await openSheet(canvasElement)
    await expect(
      await within(dialog).findByText('Marina Souza aprovou o orçamento'),
    ).toBeInTheDocument()
    await expect(
      within(dialog).getByText('Tiago Nunes criou o registro'),
    ).toBeInTheDocument()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline4Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    const dialog = await openSheet(canvasElement)
    await expect(
      await within(dialog).findByText('Nenhuma atividade'),
    ).toBeInTheDocument()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline4Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const dialog = await openSheet(canvasElement)
    await expect(
      await within(dialog).findByText(
        'Não foi possível carregar as atividades',
      ),
    ).toBeInTheDocument()
    await expect(
      within(dialog).getByRole('button', { name: 'Tentar novamente' }),
    ).toBeInTheDocument()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline4Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const dialog = await openSheet(canvasElement)
    await expect(
      await within(dialog).findByLabelText('Carregando atividades'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}
