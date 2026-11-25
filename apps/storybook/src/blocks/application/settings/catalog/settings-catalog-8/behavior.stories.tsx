import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog8 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-8'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  settingsCatalog8Accounts,
  settingsCatalog8DefaultAccountId,
} from '../../fixtures/settings-catalog-8.ts'
import {
  type SettingsCatalog8Controls,
  settingsCatalog8ControlArgs,
} from './settings-catalog-8-controls.ts'
import { ComposedSettingsCatalog8 } from './settings-catalog-8-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settingsCatalog8ControlArgs,
    onAccountAction: fn(),
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings8/Behavior',
} satisfies Meta<
  SettingsCatalog8Controls & {
    onAccountAction: (accountId: string, action: string) => void
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
    await expect(status).toHaveTextContent('Nenhuma conta ainda')
  },
}

export const NewAccountButtonCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Nova conta' }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const NewAccountButtonNeedsOnCreate: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Nova conta' }),
    ).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
  },
}

export const DefaultAccountShowsFlag: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Padrão')).toBeVisible()
  },
}

export const DefaultAccountOffersOnlyEdit: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Itaú corrente',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual(['Editar'])
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const MakeDefaultCallsOnAccountAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Nubank PJ',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Tornar padrão',
      'Arquivar',
    ])
    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Tornar padrão' }),
    )
    await waitFor(() =>
      expect(args.onAccountAction).toHaveBeenCalledWith(
        'acc-nubank',
        'make-default',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ArchiveCallsOnAccountAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Caixa do escritório',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Arquivar' }),
    )
    await waitFor(() =>
      expect(args.onAccountAction).toHaveBeenCalledWith('acc-caixa', 'archive'),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ArchivedAccountsStayCollapsed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Arquivadas')).toBeVisible()
    await expect(canvas.queryByText('Banco antigo')).toBeNull()
    await userEvent.click(canvas.getByText('Arquivadas'))
    await expect(canvas.getByText('Banco antigo')).toBeVisible()
  },
}

export const RestoreCallsOnAccountAction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Arquivadas'))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações de Banco antigo' }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual(['Restaurar'])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Restaurar' }))
    await waitFor(() =>
      expect(args.onAccountAction).toHaveBeenCalledWith(
        'acc-antigo',
        'restore',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const NoArchivedSectionWithoutArchivedAccounts: Story = {
  args: { withArchived: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByText('Arquivadas')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <SettingsCatalog8
      accounts={settingsCatalog8Accounts}
      defaultAccountId={settingsCatalog8DefaultAccountId}
      labels={{
        actions: (name) => `Opções de ${name}`,
        newAccount: 'Criar conta',
        title: 'Contas bancárias',
      }}
      onAccountAction={args.onAccountAction}
      onCreate={args.onCreate}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Contas bancárias')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Criar conta' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Opções de Nubank PJ' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Contas')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsCatalog8 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando contas'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsCatalog8 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettingsCatalog8 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsCatalog8 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando contas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettingsCatalog8 {...args} empty error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
