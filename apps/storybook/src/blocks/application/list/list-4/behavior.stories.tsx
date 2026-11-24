import type { Meta, StoryObj } from '@storybook/react-vite'
import { List4 } from '@tc96/blocks/application/list/list-4'
import { expect, fn, userEvent, within } from 'storybook/test'
import { integrations } from '../fixtures/list-4.ts'
import { type List4Controls, list4ControlArgs } from './list-4-controls.ts'
import { ComposedList4 } from './list-4-layouts.tsx'

const meta = {
  args: list4ControlArgs,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedList4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List4/Behavior',
} satisfies Meta<List4Controls>

export default meta

type Story = StoryObj<typeof meta>

export const EachRowShowsNameAndDescription: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4)
    await expect(canvas.getByText('Slack')).toBeVisible()
    await expect(
      canvas.getByText('Sincronize reuniões e prazos com a sua agenda.'),
    ).toBeVisible()
  },
}

export const InitialsStandInForTheLogo: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('GA')).toBeVisible()
  },
}

const onConnect = fn()

export const ConnectCallsOnConnectWithTheId: Story = {
  render: () => <List4 integrations={integrations} onConnect={onConnect} />,
  play: async ({ canvasElement }) => {
    onConnect.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Conectar Slack' }),
    )
    await expect(onConnect).toHaveBeenCalledWith('slack')
  },
}

export const ConnectedShowsBadgeInsteadOfButton: Story = {
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

export const NoIntegrationsShowsTheEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Sem integrações')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <List4
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
