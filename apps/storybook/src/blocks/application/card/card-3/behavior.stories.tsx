import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card3, type Card3Props } from '@tc96/ui/blocks/application/card/card-3'
import { expect, fn, userEvent, within } from 'storybook/test'
import { profile } from '../fixtures/card-3.ts'
import { type Card3Controls, card3ControlArgs } from './card-3-controls.ts'
import { ComposedCard3 } from './card-3-layouts.tsx'

const loaded: Card3Props = { profile }

const retry = fn()

const meta = {
  args: card3ControlArgs,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card3/Behavior',
} satisfies Meta<Card3Controls>

export default meta

type Story = StoryObj<typeof meta>

export const ShowsNameRoleAndAvailability: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Marina Costa' }),
    ).toBeVisible()
    await expect(canvas.getByText('Designer de produto')).toBeVisible()
    await expect(canvas.getByText('Disponível')).toBeVisible()
  },
}

export const StatsStripFormatsEachNumber: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('24')).toBeVisible()
    await expect(canvas.getByText('1.280')).toBeVisible()
    await expect(canvas.getByText('Seguindo')).toBeVisible()
  },
}

export const StatsStripShowsAtMostThree: Story = {
  render: () => (
    <Card3
      profile={{
        ...profile,
        stats: [...profile.stats, { id: 'extra', label: 'Extra', value: 9 }],
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-stat]')).toHaveLength(3)
  },
}

const onMessage = fn()
const onFollow = fn()

export const ActionsCallTheirCallbacksWithTheId: Story = {
  render: () => (
    <Card3 onFollow={onFollow} onMessage={onMessage} profile={profile} />
  ),
  play: async ({ canvasElement }) => {
    onMessage.mockClear()
    onFollow.mockClear()
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Mensagem' }))
    await expect(onMessage).toHaveBeenCalledWith('marina')
    await expect(onFollow).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Seguir' }))
    await expect(onFollow).toHaveBeenCalledWith('marina')
  },
}

export const WithoutCallbacksNoActionRenders: Story = {
  args: { follow: false, message: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
  },
}

export const OnlyTheGivenActionRenders: Story = {
  args: { follow: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Mensagem' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Seguir' })).toBeNull()
  },
}

export const InitialsStandInForMissingImage: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('MC')).toBeVisible()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Card3 {...loaded} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando perfil')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Card3 {...loaded} error onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar o perfil'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Card3 {...loaded} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Card3 {...loaded} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando perfil')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar o perfil'),
    ).toBeNull()
  },
}
