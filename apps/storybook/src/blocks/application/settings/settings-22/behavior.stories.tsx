import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings22 } from '@tc96/ui/blocks/application/settings/settings-22'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { settings22Keys } from '../fixtures/settings-22.ts'
import {
  type Settings22Controls,
  settings22ControlArgs,
} from './settings-22-controls.ts'
import { ComposedSettings22 } from './settings-22-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settings22ControlArgs,
    onActiveChange: fn(),
    onCopy: fn(),
    onCreate: fn(),
    onKeyAction: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings22 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings22/Behavior',
} satisfies Meta<
  Settings22Controls & {
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
      settings22Keys.length + 1,
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
    <Settings22
      keys={settings22Keys}
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
  render: (args) => <ComposedSettings22 {...args} pending />,
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
    <ComposedSettings22 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettings22 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings22 {...args} error pending />,
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
  render: (args) => <ComposedSettings22 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
