import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState5 } from '@tc96/blocks/application/empty-state/empty-state-5'
import { expect, fn, userEvent, within } from 'storybook/test'
import { connectors } from '../fixtures/empty-state-5.ts'
import {
  type EmptyState5Controls,
  emptyState5ControlArgs,
} from './empty-state-5-controls.ts'
import { ComposedEmptyState5 } from './empty-state-5-layouts.tsx'

const meta = {
  args: emptyState5ControlArgs,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedEmptyState5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState5/Behavior',
} satisfies Meta<EmptyState5Controls>

export default meta

type Story = StoryObj<typeof meta>

export const EachConnectorIsATile: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4)
    await expect(canvas.getByText('Nuvem Drive')).toBeVisible()
    await expect(canvas.getByText('ND')).toBeVisible()
  },
}

export const ConnectButtonIsNamedByTheConnector: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Conectar Caixa Forte',
      }),
    ).toBeVisible()
  },
}

const onConnect = fn()

export const ConnectCallsOnConnectWithTheId: Story = {
  render: () => <EmptyState5 connectors={connectors} onConnect={onConnect} />,
  play: async ({ canvasElement }) => {
    onConnect.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Conectar Lume Docs',
      }),
    )
    await expect(onConnect).toHaveBeenCalledWith('lume-docs')
  },
}

export const ConnectedConnectorShowsTheConnectedState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Conectado')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: /Conectar Porto Arquivos/ }),
    ).toBeNull()
  },
}

export const TheConsumerMarksAConnectorAsConnected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Conectar Nuvem Drive' }),
    )
    await expect(canvas.getAllByText('Conectado')).toHaveLength(2)
    await expect(
      canvas.queryByRole('button', { name: 'Conectar Nuvem Drive' }),
    ).toBeNull()
  },
}

export const NoOnConnectRendersNoButtons: Story = {
  args: { connect: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <EmptyState5
      connectors={connectors}
      labels={{ connect: 'Ligar', connected: 'Ligado', connectors: 'Nuvens' }}
      onConnect={() => {}}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('list', { name: 'Nuvens' })).toBeVisible()
    await expect(canvas.getByText('Ligado')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Ligar Nuvem Drive' }),
    ).toBeVisible()
  },
}
