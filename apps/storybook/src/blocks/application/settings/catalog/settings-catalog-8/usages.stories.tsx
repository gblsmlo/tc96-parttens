import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsCatalog8,
  type SettingsCatalog8Account,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-8'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsCatalog8Handlers } from '../../../../../mocks/settings-catalog-8.ts'
import { settingsCatalog8DefaultAccountId } from '../../fixtures/settings-catalog-8.ts'
import { settingsCatalog8ControlArgs } from './settings-catalog-8-controls.ts'
import { ComposedSettingsCatalog8 } from './settings-catalog-8-layouts.tsx'

const WorkspaceAccounts = () => {
  const [defaultAccountId, setDefaultAccountId] = useState(
    settingsCatalog8DefaultAccountId,
  )
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsCatalog8Account[]>('/settings/accounts'),
    queryKey: ['settings', 'accounts'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsCatalog8
        {...settingsCatalog8ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsCatalog8
      accounts={data}
      defaultAccountId={defaultAccountId}
      onAccountAction={(accountId, action) => {
        if (action === 'make-default') setDefaultAccountId(accountId)
      }}
      onCreate={fn()}
    />
  )
}

const meta = {
  component: WorkspaceAccounts,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Catalog/Settings8/Usages',
} satisfies Meta<typeof WorkspaceAccounts>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog8Handlers.accounts)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog8Handlers.accountsEmpty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog8Handlers.accountsError)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog8Handlers.accountsPending)
  },
}
