import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration7 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-7'
import { expect, fn, userEvent, within } from 'storybook/test'
import { settingsIntegration7Apps } from '../../fixtures/settings-integration-7.ts'
import {
  type SettingsIntegration7Controls,
  settingsIntegration7ControlArgs,
} from './settings-integration-7-controls.ts'
import { ComposedSettingsIntegration7 } from './settings-integration-7-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settingsIntegration7ControlArgs,
    onAction: fn(),
    onBuild: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings7/Behavior',
} satisfies Meta<
  SettingsIntegration7Controls & {
    onAction: (appId: string) => void
    onBuild: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhum conector disponível')
  },
}

export const StatusBadgesFollowStatus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByText('Conectado')).toHaveLength(2)
    await expect(canvas.getAllByText('Disponível')).toHaveLength(2)
    await expect(canvas.getByText('Prévia')).toBeVisible()
  },
}

export const ActionLabelComesFromData: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Configurar Slack' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Instalar Resend' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Testar Cursor' }),
    ).toBeVisible()
  },
}

export const ActionCallsOnActionWithId: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Instalar Stripe' }),
    )
    await expect(args.onAction).toHaveBeenCalledWith('stripe')
  },
}

export const BuildCallsOnBuild: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Criar conector' }),
    )
    await expect(args.onBuild).toHaveBeenCalledOnce()
  },
}

export const BuildNeedsCallback: Story = {
  args: { withBuild: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Criar conector' }),
    ).toBeNull()
  },
}

export const ButtonsNeedCallbacks: Story = {
  args: { withActions: false, withBuild: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <SettingsIntegration7
      apps={settingsIntegration7Apps}
      labels={{
        action: (name, actionLabel) => `${actionLabel}: ${name}`,
        connected: 'Ativo',
        title: 'Extensões',
      }}
      onAction={args.onAction}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Extensões')).toBeVisible()
    await expect(canvas.getAllByText('Ativo')).toHaveLength(2)
    await expect(
      canvas.getByRole('button', { name: 'Instalar: Resend' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Conectores')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsIntegration7 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando conectores'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsIntegration7 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettingsIntegration7 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsIntegration7 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando conectores'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettingsIntegration7 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
