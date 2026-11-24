import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Card1, type Card1Fact } from '@tc96/ui/blocks/application/card/card-1'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { card1Handlers } from '../../../../mocks/card-1.ts'

const ProjectDetails = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Card1Fact[]>('/card/facts'),
    queryKey: ['card', 'facts'],
  })

  return (
    <Card1
      error={isError}
      facts={data ?? []}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: ProjectDetails,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Card/Card1/Usages',
} satisfies Meta<typeof ProjectDetails>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Marina Costa')).toBeVisible()
    await expect(canvas.getByText('Em andamento')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os detalhes',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando detalhes'),
    ).toBeVisible()
  },
}
