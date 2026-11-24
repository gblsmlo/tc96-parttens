import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Timeline2,
  type Timeline2Release,
} from '@tc96/blocks/application/timeline/timeline-2'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { timeline2Handlers } from '../../../../mocks/timeline-2.ts'

const ChangelogFeed = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Timeline2Release[]>('/timeline/releases'),
    queryKey: ['timeline', 'releases'],
    retry: false,
  })

  return (
    <Timeline2
      error={isError}
      releases={data ?? []}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: ChangelogFeed,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline2/Usages',
} satisfies Meta<typeof ChangelogFeed>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Versão 2.4.0')).toBeVisible()
    await expect(canvas.getByText('Versão 2.3.1')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline2Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma versão publicada'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline2Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText(
        'Não foi possível carregar o histórico de versões',
      ),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(timeline2Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText(
        'Carregando histórico de versões',
      ),
    ).toHaveAttribute('aria-busy', 'true')
  },
}
