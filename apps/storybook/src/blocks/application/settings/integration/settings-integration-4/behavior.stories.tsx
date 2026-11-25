import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration4 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-4'
import { expect, fn, userEvent, within } from 'storybook/test'
import { settingsIntegration4Sections } from '../../fixtures/settings-integration-4.ts'
import {
  type SettingsIntegration4Controls,
  settingsIntegration4ControlArgs,
} from './settings-integration-4-controls.ts'
import { ComposedSettingsIntegration4 } from './settings-integration-4-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settingsIntegration4ControlArgs,
    onAction: fn(),
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings4/Behavior',
} satisfies Meta<
  SettingsIntegration4Controls & {
    onAction: (appId: string, action: string) => void
    onCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhuma conexão')
  },
}

export const SectionsGroupApps: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Comunicação' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Colaboração' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Agendamento' }),
    ).toBeVisible()
  },
}

export const SectionWithoutAppsIsHidden: Story = {
  render: (args) => (
    <SettingsIntegration4
      onAction={args.onAction}
      sections={[
        ...settingsIntegration4Sections,
        { apps: [], id: 'vazio', title: 'Seção vazia' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('heading', { name: 'Seção vazia' }),
    ).toBeNull()
  },
}

export const StatusBadgesFollowStatus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByText('Conectado')).toHaveLength(3)
    await expect(canvas.getAllByText('Requer revisão')).toHaveLength(2)
  },
}

export const MenuCallsOnActionWithAppId: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações de Slack' }),
    )
    await userEvent.click(
      await within(document.body).findByRole('menuitem', {
        name: 'Sincronizar',
      }),
    )
    await expect(args.onAction).toHaveBeenCalledWith('slack', 'sync')
  },
}

export const DisconnectIsDestructive: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ações de Notion' }),
    )
    await userEvent.click(
      await within(document.body).findByRole('menuitem', {
        name: 'Desconectar',
      }),
    )
    await expect(args.onAction).toHaveBeenCalledWith('notion', 'disconnect')
  },
}

export const NewConnectionCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Nova conexão' }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const ControlsNeedCallbacks: Story = {
  args: { withActions: false, withCreate: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <SettingsIntegration4
      labels={{
        actions: (name) => `Opções de ${name}`,
        connected: 'Ativo',
        newConnection: 'Adicionar',
        title: 'Integrações',
      }}
      onAction={args.onAction}
      onCreate={args.onCreate}
      sections={settingsIntegration4Sections}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Integrações')).toBeVisible()
    await expect(canvas.getAllByText('Ativo')).toHaveLength(3)
    await expect(
      canvas.getByRole('button', { name: 'Adicionar' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Opções de Slack' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Conexões')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsIntegration4 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando conexões'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsIntegration4 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettingsIntegration4 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsIntegration4 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando conexões')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettingsIntegration4 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
