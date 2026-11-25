import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsIntegration3 } from '@tc96/ui/blocks/application/settings/integration/settings-integration-3'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { settingsIntegration3Keys } from '../../fixtures/settings-integration-3.ts'
import {
  type SettingsIntegration3Controls,
  settingsIntegration3ControlArgs,
} from './settings-integration-3-controls.ts'
import { ComposedSettingsIntegration3 } from './settings-integration-3-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settingsIntegration3ControlArgs,
    onActiveChange: fn(),
    onCopy: fn(),
    onCreate: fn(),
    onKeyAction: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsIntegration3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Integration/Settings3/Behavior',
} satisfies Meta<
  SettingsIntegration3Controls & {
    onActiveChange: (keyId: string, active: boolean) => void
    onCopy: (keyId: string) => void
    onCreate: () => void
    onKeyAction: (keyId: string, action: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhuma chave ainda')
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const TableShowsMaskedTokens: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('row')).toHaveLength(
      settingsIntegration3Keys.length + 1,
    )
    await expect(canvas.getByText('sk_live_••••4f2a')).toBeVisible()
    await expect(canvas.getByText('Nunca usada')).toBeVisible()
  },
}

export const NewKeyButtonCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Nova chave' }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const CopyButtonCallsOnCopy: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Copiar token de Produção',
      }),
    )
    await expect(args.onCopy).toHaveBeenCalledWith('key-producao')
  },
}

export const SwitchCallsOnActiveChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('switch', { name: 'Ativar Testes' }))
    await expect(args.onActiveChange).toHaveBeenCalledWith('key-testes', true)
    await expect(
      canvas.getByRole('switch', { name: 'Ativar Testes' }),
    ).toHaveAttribute('aria-checked', 'false')
  },
}

export const RowMenuCallsOnKeyAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Integração CRM',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Rotacionar',
      'Revogar',
    ])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Revogar' }))
    await waitFor(() =>
      expect(args.onKeyAction).toHaveBeenCalledWith(
        'key-integracao-crm',
        'revoke',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ControlsNeedCallbacks: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Nova chave' }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: /^Copiar token/ }),
    ).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
    await expect(
      canvas.getByRole('switch', { name: 'Ativar Produção' }),
    ).toHaveAttribute('aria-disabled', 'true')
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <SettingsIntegration3
      keys={settingsIntegration3Keys}
      labels={{
        columnName: 'Apelido',
        copy: (name) => `Copiar ${name}`,
        neverUsed: 'Sem uso',
        newKey: 'Criar chave',
        title: 'Credenciais',
      }}
      onCopy={args.onCopy}
      onCreate={args.onCreate}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Credenciais')).toBeVisible()
    await expect(canvas.getByText('Apelido')).toBeVisible()
    await expect(canvas.getByText('Sem uso')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Criar chave' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Copiar Produção' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Chaves de API')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsIntegration3 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando chaves'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsIntegration3 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettingsIntegration3 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsIntegration3 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando chaves')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettingsIntegration3 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
