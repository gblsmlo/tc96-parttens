import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Card4, type Card4Meeting } from '@tc96/blocks/application/card/card-4'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { card4Handlers } from '../../../../mocks/card-4.ts'

const onJoin = fn()

const MeetingsCard = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Card4Meeting[]>('/cards/meetings'),
    queryKey: ['cards', 'meetings'],
  })

  return (
    <Card4
      error={isError}
      meetings={data ?? []}
      onJoin={onJoin}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: MeetingsCard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card4/Usages',
} satisfies Meta<typeof MeetingsCard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    onJoin.mockClear()
    msw.use(card4Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Revisão de design')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Entrar na reunião Revisão de design',
      }),
    )
    await expect(onJoin).toHaveBeenCalledWith('review')
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card4Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma reunião hoje'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card4Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as reuniões',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card4Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando reuniões'),
    ).toBeVisible()
  },
}
