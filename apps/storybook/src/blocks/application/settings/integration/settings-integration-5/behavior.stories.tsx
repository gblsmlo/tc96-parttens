import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration5 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-5'
import { expect, fn, userEvent, within } from 'storybook/test'
import { settingsIntegration5Apps } from '../../fixtures/settings-integration-5.ts'
import {
  type SettingsIntegration5Controls,
  settingsIntegration5ControlArgs,
} from './settings-integration-5-controls.ts'
import { ComposedSettingsIntegration5 } from './settings-integration-5-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settingsIntegration5ControlArgs,
    onChannelChange: fn(),
    onConnect: fn(),
    onDisconnect: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings5/Behavior',
} satisfies Meta<
  SettingsIntegration5Controls & {
    onChannelChange: (
      appId: string,
      channelId: string,
      enabled: boolean,
    ) => void
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
    await expect(status).toHaveTextContent('Nenhuma integração disponível')
  },
}

export const ConnectedAppRevealsChannels: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('switch', {
        name: 'Execuções de workflow em Slack',
      }),
    ).toBeChecked()
    await expect(
      canvas.getByRole('switch', {
        name: 'Pagamentos com falha em Slack',
      }),
    ).not.toBeChecked()
  },
}

export const DisconnectedAppHidesChannels: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('switch', {
        name: 'Novos leads em Linear',
      }),
    ).toBeNull()
  },
}

export const AppWithoutChannelsShowsNoSwitch: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('switch')).toHaveLength(2)
  },
}

export const ChannelSwitchCallsOnChannelChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('switch', {
        name: 'Pagamentos com falha em Slack',
      }),
    )
    await expect(args.onChannelChange).toHaveBeenCalledWith(
      'slack',
      'failed-payments',
      true,
    )
  },
}

export const ConnectedRowOffersDisconnect: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Conectar Slack' }),
    ).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Desconectar Slack' }),
    )
    await expect(args.onDisconnect).toHaveBeenCalledWith('slack')
  },
}

export const DisconnectedRowOffersConnect: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Conectar Linear' }),
    )
    await expect(args.onConnect).toHaveBeenCalledWith('linear')
  },
}

export const ControlsNeedCallbacks: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <SettingsIntegration5
      apps={settingsIntegration5Apps}
      labels={{
        channelAction: (appName, channelLabel) => `${appName}: ${channelLabel}`,
        connect: 'Ligar',
        connectAction: (name) => `Ligar ${name}`,
        title: 'Notificações',
      }}
      onChannelChange={args.onChannelChange}
      onConnect={args.onConnect}
      onDisconnect={args.onDisconnect}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Notificações')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Ligar Linear' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Slack: Pagamentos com falha' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Eventos por integração')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsIntegration5 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando integrações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsIntegration5 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettingsIntegration5 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsIntegration5 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando integrações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettingsIntegration5 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
