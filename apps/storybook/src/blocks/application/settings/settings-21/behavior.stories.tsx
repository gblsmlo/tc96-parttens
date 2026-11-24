import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings21 } from '@tc96/blocks/application/settings/settings-21'
import { expect, fn, userEvent, within } from 'storybook/test'
import { settings21Apps } from '../fixtures/settings-21.ts'
import {
  type Settings21Controls,
  settings21ControlArgs,
} from './settings-21-controls.ts'
import { ComposedSettings21 } from './settings-21-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settings21ControlArgs,
    onConnect: fn(),
    onDisconnect: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings21 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings21/Behavior',
} satisfies Meta<
  Settings21Controls & {
    onConnect: (appId: string) => void
    onDisconnect: (appId: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhum aplicativo disponível')
  },
}

export const StatusBadgesFollowStatus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Conectado')).toBeVisible()
    await expect(canvas.getByText('Desconectado')).toBeVisible()
    await expect(canvas.getByText('Erro')).toBeVisible()
  },
}

export const ConnectedRowOffersDisconnect: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Conectar Google Workspace' }),
    ).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Desconectar Google Workspace' }),
    )
    await expect(args.onDisconnect).toHaveBeenCalledWith('google-workspace')
  },
}

export const DisconnectedRowOffersConnect: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Conectar Slack' }),
    )
    await expect(args.onConnect).toHaveBeenCalledWith('slack')
  },
}

export const ErrorRowOffersReconnect: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Reconectar Stripe' }),
    )
    await expect(args.onConnect).toHaveBeenCalledWith('stripe')
  },
}

export const ButtonsNeedCallbacks: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Settings21
      apps={settings21Apps}
      labels={{
        connect: 'Ligar',
        connectAction: (name) => `Ligar ${name}`,
        connected: 'Ativo',
        title: 'Integrações',
      }}
      onConnect={args.onConnect}
      onDisconnect={args.onDisconnect}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Integrações')).toBeVisible()
    await expect(canvas.getByText('Ativo')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Ligar Slack' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Aplicativos conectados')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings21 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando aplicativos'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings21 {...args} error onRetry={retryHandler} />
  ),
  play: async ({ canvasElement }) => {
    retryHandler.mockClear()
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retryHandler).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: (args) => <ComposedSettings21 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings21 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando aplicativos'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettings21 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
