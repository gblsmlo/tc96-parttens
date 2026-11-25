import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsAccount2 } from '@tc96/ui/blocks/application/settings/account/settings-account-2'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  settingsAccount2Invoices,
  settingsAccount2Plan,
  settingsAccount2Usage,
} from '../../fixtures/settings-account-2.ts'
import {
  type SettingsAccount2Controls,
  settingsAccount2ControlArgs,
} from './settings-account-2-controls.ts'
import { ComposedSettingsAccount2 } from './settings-account-2-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settingsAccount2ControlArgs,
    onChangePlan: fn(),
    onDownload: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsAccount2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Account/Settings2/Behavior',
} satisfies Meta<
  SettingsAccount2Controls & {
    onChangePlan: () => void
    onDownload: (invoiceId: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const PlanSummaryShowsPriceAndRenewal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Profissional')).toBeVisible()
    await expect(
      canvas.getByText(/R\$\s?189,90/, { selector: 'p' }),
    ).toBeVisible()
    await expect(canvas.getByText(/Renova em 15 dez 2026/)).toBeVisible()
  },
}

export const UsageMetersExposeUsedAndLimit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const meters = canvas.getAllByRole('meter')
    await expect(meters).toHaveLength(3)
    await expect(meters[0]).toHaveAttribute('aria-valuenow', '7')
    await expect(meters[0]).toHaveAttribute('aria-valuemax', '10')
    await expect(meters[0]).toHaveAttribute(
      'aria-valuetext',
      '7 de 10 usuários',
    )
    await expect(canvas.getByText('18 de 50 GB')).toBeVisible()
  },
}

export const ChangePlanButtonCallsOnChangePlan: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Alterar plano' }),
    )
    await expect(args.onChangePlan).toHaveBeenCalledOnce()
  },
}

export const InvoiceStatusUsesBadgeLabels: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('row')).toHaveLength(
      settingsAccount2Invoices.length + 1,
    )
    await expect(canvas.getAllByText('Paga')).toHaveLength(2)
    await expect(canvas.getByText('Falhou')).toBeVisible()
    await expect(canvas.getByText('Pendente')).toBeVisible()
  },
}

export const DownloadButtonCallsOnDownload: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Baixar fatura de 15 out 2026',
      }),
    )
    await expect(args.onDownload).toHaveBeenCalledWith('inv-2026-10')
  },
}

export const EmptyInvoicesShowsStateSurface: Story = {
  args: { emptyInvoices: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhuma fatura ainda')
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const ButtonsNeedCallbacks: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Alterar plano' }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: /^Baixar fatura/ }),
    ).toBeNull()
  },
}

export const LabelsAndCurrencyOverride: Story = {
  render: (args) => (
    <SettingsAccount2
      currency="USD"
      invoices={settingsAccount2Invoices}
      labels={{
        changePlan: 'Trocar plano',
        statuses: { failed: 'Recusada', paid: 'Quitada', pending: 'Aberta' },
        title: 'Assinatura',
      }}
      locale="en-US"
      onChangePlan={args.onChangePlan}
      plan={settingsAccount2Plan}
      usage={settingsAccount2Usage}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Assinatura')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Trocar plano' }),
    ).toBeVisible()
    await expect(canvas.getByText(/\$189\.90/, { selector: 'p' })).toBeVisible()
    await expect(canvas.getByText('Recusada')).toBeVisible()
    await expect(canvas.queryByText('Cobrança')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsAccount2 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando cobrança'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsAccount2 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettingsAccount2 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsAccount2 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando cobrança')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: (args) => <ComposedSettingsAccount2 {...args} emptyInvoices error />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('[data-kind="empty"]')).toBeNull()
  },
}
