import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration8 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-8'
import { expect, fn, userEvent, within } from 'storybook/test'
import { settingsIntegration8Items } from '../../fixtures/settings-integration-8.ts'
import {
  type SettingsIntegration8Controls,
  settingsIntegration8ControlArgs,
} from './settings-integration-8-controls.ts'
import { ComposedSettingsIntegration8 } from './settings-integration-8-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settingsIntegration8ControlArgs,
    onAllPausedChange: fn(),
    onCopyKey: fn(),
    onEnabledChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings8/Behavior',
} satisfies Meta<
  SettingsIntegration8Controls & {
    onAllPausedChange: (paused: boolean) => void
    onCopyKey: (integrationId: string) => void
    onEnabledChange: (integrationId: string, enabled: boolean) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhuma integração de API')
  },
}

export const PagesHoldTenRows: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('GitHub')).toBeVisible()
    await expect(canvas.queryByText('Asana')).toBeNull()
    await expect(
      canvas.getAllByRole('switch', { name: /^Ativar / }),
    ).toHaveLength(10)
  },
}

export const CopyButtonCallsOnCopyKey: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Copiar chave de GitHub',
      }),
    )
    await expect(args.onCopyKey).toHaveBeenCalledWith('github')
  },
}

export const RowSwitchCallsOnEnabledChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('switch', { name: 'Ativar GitHub' }),
    )
    await expect(args.onEnabledChange).toHaveBeenCalledWith('github', false)
  },
}

export const PauseAllCallsOnAllPausedChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('switch', { name: 'Pausar tudo' }),
    )
    await expect(args.onAllPausedChange).toHaveBeenCalledWith(true)
  },
}

export const PausedDisablesRowSwitches: Story = {
  args: { allPaused: true },
  play: async ({ canvasElement }) => {
    const switches = within(canvasElement).getAllByRole('switch', {
      name: /^Ativar /,
    })
    for (const control of switches) {
      await expect(control).toHaveAttribute('aria-checked', 'false')
      await expect(control).toHaveAttribute('data-disabled')
    }
  },
}

export const ActionsNeedCallbacks: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Copiar chave de GitHub' }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('switch', { name: 'Pausar tudo' }),
    ).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <SettingsIntegration8
      integrations={settingsIntegration8Items}
      labels={{
        copyAction: (name) => `Copiar ${name}`,
        pauseAll: 'Parar tudo',
        title: 'Chaves',
      }}
      onAllPausedChange={args.onAllPausedChange}
      onCopyKey={args.onCopyKey}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Chaves')).toBeVisible()
    await expect(canvas.getByText('Parar tudo')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Copiar GitHub' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Integrações de API')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsIntegration8 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando integrações de API'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvasElement.querySelector('[role="grid"]')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsIntegration8 {...args} error onRetry={retryHandler} />
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

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsIntegration8 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando integrações de API'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettingsIntegration8 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
