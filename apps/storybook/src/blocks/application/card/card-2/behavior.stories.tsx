import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card2, type Card2Props } from '@tc96/ui/blocks/application/card/card-2'
import { expect, fn, userEvent, within } from 'storybook/test'
import { integrations } from '../fixtures/card-2.ts'
import { type Card2Controls, card2ControlArgs } from './card-2-controls.ts'
import { ComposedCard2 } from './card-2-layouts.tsx'

const loaded: Card2Props = { integrations }

const retry = fn()

const meta = {
  args: card2ControlArgs,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card2/Behavior',
} satisfies Meta<Card2Controls>

export default meta

type Story = StoryObj<typeof meta>

export const EachIntegrationShowsNameDescriptionAndTier: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4)
    await expect(canvas.getByText('Slack')).toBeVisible()
    await expect(
      canvas.getByText('Sincronize reuniões e prazos com a sua agenda.'),
    ).toBeVisible()
    await expect(canvas.getByText('Enterprise')).toBeVisible()
  },
}

export const InitialsStandInForMissingIcon: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('GA')).toBeVisible()
  },
}

const onConnect = fn()

export const ConnectCallsOnConnectWithTheId: Story = {
  render: () => <Card2 integrations={integrations} onConnect={onConnect} />,
  play: async ({ canvasElement }) => {
    onConnect.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Conectar Slack' }),
    )
    await expect(onConnect).toHaveBeenCalledWith('slack')
  },
}

export const ConnectedShowsStatusInsteadOfButton: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Conectado')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Conectar Stripe' }),
    ).toBeNull()
  },
}

export const WithoutOnConnectNoButtonRenders: Story = {
  args: { connectable: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Card2
      integrations={integrations}
      labels={{ connect: 'Ativar', connected: 'Ativo', title: 'Apps' }}
      onConnect={() => {}}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('list', { name: 'Apps' })).toBeVisible()
    await expect(canvas.getByText('Ativo')).toBeVisible()
    await expect(canvas.getAllByText('Ativar')).toHaveLength(3)
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Card2 {...loaded} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando integrações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Card2 {...loaded} error onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as integrações'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Card2 {...loaded} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Card2 {...loaded} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando integrações')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar as integrações'),
    ).toBeNull()
  },
}
