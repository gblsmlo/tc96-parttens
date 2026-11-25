import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { SettingsAccount2 } from '@tc96/ui/blocks/application/settings/account/settings-account-2'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsAccount2Handlers } from '../../../../../mocks/settings-account-2.ts'
import type { SettingsAccount2Billing } from '../../fixtures/settings-account-2.ts'
import { settingsAccount2ControlArgs } from './settings-account-2-controls.ts'
import { ComposedSettingsAccount2 } from './settings-account-2-layouts.tsx'

const WorkspaceBilling = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsAccount2Billing>('/settings/billing'),
    queryKey: ['settings', 'billing'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsAccount2
        {...settingsAccount2ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsAccount2
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
  title: 'Blocks/Application/Settings/Account/Settings2/Usages',
} satisfies Meta<typeof WorkspaceBilling>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsAccount2Handlers.billing)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsAccount2Handlers.billingEmpty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsAccount2Handlers.billingError)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsAccount2Handlers.billingPending)
  },
}
