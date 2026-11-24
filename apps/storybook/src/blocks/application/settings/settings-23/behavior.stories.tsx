import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings23 } from '@tc96/blocks/application/settings/settings-23'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  settings23Invoices,
  settings23Plan,
  settings23Usage,
} from '../fixtures/settings-23.ts'
import {
  type Settings23Controls,
  settings23ControlArgs,
} from './settings-23-controls.ts'
import { ComposedSettings23 } from './settings-23-layouts.tsx'

const meta = {
  args: { ...settings23ControlArgs, onChangePlan: fn(), onDownload: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings23 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings23/Behavior',
} satisfies Meta<
  Settings23Controls & {
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
      settings23Invoices.length + 1,
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
    <Settings23
      currency="USD"
      invoices={settings23Invoices}
      labels={{
        changePlan: 'Trocar plano',
        statuses: { failed: 'Recusada', paid: 'Quitada', pending: 'Aberta' },
        title: 'Assinatura',
      }}
      locale="en-US"
      onChangePlan={args.onChangePlan}
      plan={settings23Plan}
      usage={settings23Usage}
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
