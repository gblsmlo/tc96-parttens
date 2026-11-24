import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Timeline1,
  type Timeline1Event,
} from '@tc96/blocks/application/timeline/timeline-1'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { timeline1Handlers } from '../../../../mocks/timeline-1.ts'

const ActivityFeed = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Timeline1Event[]>('/timeline/activity'),
    queryKey: ['timeline', 'activity'],
    retry: false,
  })

  return (
    <Timeline1
      error={isError}
      events={data ?? []}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: ActivityFeed,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Timeline/Timeline1/Usages',
} satisfies Meta<typeof ActivityFeed>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Marina Costa')).toBeVisible()
    await expect(canvas.getByText('Rafael Lima')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline1Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma atividade ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as atividades'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando atividades'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}
