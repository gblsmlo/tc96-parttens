import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsAccount1,
  type SettingsAccount1Props,
} from '@tc96/ui/blocks/application/settings/account/settings-account-1'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsAccount1Handlers } from '../../../../../mocks/settings-account-1.ts'
import { settingsAccount1ControlArgs } from './settings-account-1-controls.ts'
import { ComposedSettingsAccount1 } from './settings-account-1-layouts.tsx'

type SettingsAccount1Account = Pick<
  SettingsAccount1Props,
  'avatarInitials' | 'email' | 'fields' | 'sessionCount'
>

const AccountSettings = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsAccount1Account>('/settings/account'),
    queryKey: ['settings', 'account'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsAccount1
        {...settingsAccount1ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsAccount1
      {...data}
      onDeleteAccount={fn()}
      onEmailSubmit={fn()}
      onFieldCommit={fn()}
      onSignOutEverywhere={fn()}
      onUploadAvatar={fn()}
    />
  )
}

const meta = {
  component: AccountSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Account/Settings1/Usages',
} satisfies Meta<typeof AccountSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsAccount1Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsAccount1Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsAccount1Handlers.pending)
  },
}
