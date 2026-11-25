import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration6 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-6'
import { expect, fn, userEvent, within } from 'storybook/test'
import { settingsIntegration6Apps } from '../../fixtures/settings-integration-6.ts'
import {
  type SettingsIntegration6Controls,
  settingsIntegration6ControlArgs,
} from './settings-integration-6-controls.ts'
import { ComposedSettingsIntegration6 } from './settings-integration-6-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settingsIntegration6ControlArgs,
    onConnect: fn(),
    onDisconnect: fn(),
    onEnabledChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings6/Behavior',
} satisfies Meta<
  SettingsIntegration6Controls & {
    onConnect: (appId: string) => void
    onDisconnect: (appId: string) => void
    onEnabledChange: (appId: string, enabled: boolean) => void
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

export const ConnectedCardOffersDisconnect: Story = {
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

export const DisconnectedCardOffersConnect: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Conectar Stripe' }),
    )
    await expect(args.onConnect).toHaveBeenCalledWith('stripe')
  },
}

export const SwitchReflectsEnabled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('switch', { name: 'Ativar Google Workspace' }),
    ).toBeChecked()
    await expect(
      canvas.getByRole('switch', { name: 'Ativar Slack' }),
    ).not.toBeChecked()
  },
}

export const SwitchCallsOnEnabledChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('switch', { name: 'Ativar Slack' }),
    )
    await expect(args.onEnabledChange).toHaveBeenCalledWith('slack', true)
  },
}

export const SwitchIsDisabledUntilConnected: Story = {
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', {
      name: 'Ativar Stripe',
    })
    await expect(toggle).toHaveAttribute('data-disabled')
    await userEvent.click(toggle)
    await expect(args.onEnabledChange).not.toHaveBeenCalled()
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
    <SettingsIntegration6
      apps={settingsIntegration6Apps}
      labels={{
        connect: 'Ligar',
        connectAction: (name) => `Ligar ${name}`,
        title: 'Integrações',
      }}
      onConnect={args.onConnect}
      onDisconnect={args.onDisconnect}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Integrações')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Ligar Stripe' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Galeria de integrações')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsIntegration6 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando integrações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-integration-card"]'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsIntegration6 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettingsIntegration6 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsIntegration6 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando integrações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettingsIntegration6 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
