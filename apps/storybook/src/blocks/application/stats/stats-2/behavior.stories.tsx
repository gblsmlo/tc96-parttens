import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats2 } from '@tc96/blocks/application/stats/stats-2'
import { expect, fn, userEvent, within } from 'storybook/test'
import { quotaUsage } from '../fixtures/stats-2.ts'
import { type Stats2Controls, stats2ControlArgs } from './stats-2-controls.ts'
import { ComposedStats2 } from './stats-2-layouts.tsx'

const loaded = {
  className: 'mx-auto max-w-md',
  cost: quotaUsage.cost,
  limit: quotaUsage.limit,
  renewsAt: new Date(quotaUsage.renewsAt),
  timeZone: 'UTC',
  used: quotaUsage.used,
}

const retry = fn()

const meta = {
  args: { ...stats2ControlArgs, onUpgrade: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats2/Behavior',
} satisfies Meta<Stats2Controls & { onUpgrade: () => void }>

export default meta

type Story = StoryObj<typeof meta>

export const MeterReportsUsedOfLimit: Story = {
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter')
    await expect(meter).toHaveAttribute('aria-valuenow', '742000')
    await expect(meter).toHaveAttribute('aria-valuemax', '1000000')
    await expect(meter).toHaveAttribute(
      'aria-valuetext',
      '742.000 de 1.000.000 requisições',
    )
  },
}

export const ShowsBilledCostAndRenewal: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', {
      name: 'Uso da API',
    })
    await expect(card).toHaveTextContent(/R\$\s*289,90/)
    await expect(card).toHaveTextContent('Renova em 15 de dez. de 2026')
  },
}

export const UsageAboveLimitKeepsMeterFull: Story = {
  args: { used: 1_250_000 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('meter')).toHaveAttribute(
      'aria-valuenow',
      '1000000',
    )
  },
}

export const UpgradeButtonCallsOnUpgrade: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Fazer upgrade' }),
    )
    await expect(args.onUpgrade).toHaveBeenCalledOnce()
  },
}

export const UpgradeButtonNeedsOnUpgrade: Story = {
  args: { withUpgrade: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Fazer upgrade' }),
    ).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Stats2
      cost={quotaUsage.cost}
      labels={{
        renewsOn: (date) => `Próxima cobrança: ${date}`,
        title: 'Consumo',
        usage: (used, limit) => `${used}/${limit} chamadas`,
      }}
      limit={quotaUsage.limit}
      renewsAt={new Date(quotaUsage.renewsAt)}
      timeZone="UTC"
      used={quotaUsage.used}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'Consumo' })).toBeVisible()
    await expect(canvas.getByText(/Próxima cobrança: 15/)).toBeVisible()
    await expect(canvas.getByRole('meter')).toHaveAttribute(
      'aria-valuetext',
      '742.000/1.000.000 chamadas',
    )
    await expect(canvas.queryByText('Uso da API')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Stats2 {...loaded} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando uso da API'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getByRole('region', { name: 'Uso da API' }),
    ).toBeVisible()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Stats2 {...loaded} error onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar o uso da API'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Stats2 {...loaded} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Stats2 {...loaded} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando uso da API')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar o uso da API'),
    ).toBeNull()
  },
}
