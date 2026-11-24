import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings23 } from '@tc96/ui/blocks/application/settings/settings-23'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings23Handlers } from '../../../../mocks/settings-23.ts'
import type { Settings23Billing } from '../fixtures/settings-23.ts'
import { settings23ControlArgs } from './settings-23-controls.ts'
import { ComposedSettings23 } from './settings-23-layouts.tsx'

const WorkspaceBilling = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings23Billing>('/settings/billing'),
    queryKey: ['settings', 'billing'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings23
        {...settings23ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <Settings23
      invoices={data.invoices}
      onChangePlan={fn()}
      onDownload={fn()}
      plan={data.plan}
      usage={data.usage}
    />
  )
}

const meta = {
  component: WorkspaceBilling,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Settings23/Usages',
} satisfies Meta<typeof WorkspaceBilling>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings23Handlers.billing)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Profissional')).toBeVisible()
    await expect(canvas.getAllByRole('meter')).toHaveLength(3)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings23Handlers.billingEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma fatura ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings23Handlers.billingError)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar a cobrança'),
    ).toBeVisible()
    const retry = canvas.getByRole('button', { name: 'Tentar novamente' })
    await expect(retry).toBeEnabled()
    await userEvent.click(retry)
    await expect(await canvas.findByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings23Handlers.billingPending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando cobrança',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
