import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings23 } from '@tc96/blocks/application/settings/settings-23'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings23Handlers } from '../../../../mocks/settings-23.ts'
import type { Settings23Billing } from '../fixtures/settings-23.ts'

const WorkspaceBilling = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings23Billing>('/settings/billing'),
    queryKey: ['settings', 'billing'],
  })

  if (isPending) return <Spinner aria-label="Carregando cobrança" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar a cobrança</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
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
  tags: ['!autodocs'],
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
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar a cobrança',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings23Handlers.billingPending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando cobrança'),
    ).toBeVisible()
  },
}
