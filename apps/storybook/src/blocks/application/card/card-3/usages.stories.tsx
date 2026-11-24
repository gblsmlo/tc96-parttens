import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Card3, type Card3Profile } from '@tc96/blocks/application/card/card-3'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { card3Handlers } from '../../../../mocks/card-3.ts'

const TeamMember = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Card3Profile>('/card/profile'),
    queryKey: ['card', 'profile'],
  })

  return (
    <Card3
      error={isError}
      onFollow={() => {}}
      onMessage={() => {}}
      onRetry={() => refetch()}
      pending={isPending}
      profile={data}
    />
  )
}

const meta = {
  component: TeamMember,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Card/Card3/Usages',
} satisfies Meta<typeof TeamMember>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card3Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Marina Costa')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Seguir' })).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card3Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar o perfil',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card3Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando perfil'),
    ).toBeVisible()
  },
}
