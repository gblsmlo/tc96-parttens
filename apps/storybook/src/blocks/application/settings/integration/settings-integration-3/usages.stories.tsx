import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsIntegration3,
  type SettingsIntegration3Key,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-3'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsIntegration3Handlers } from '../../../../../mocks/settings-integration-3.ts'
import { settingsIntegration3ControlArgs } from './settings-integration-3-controls.ts'
import { ComposedSettingsIntegration3 } from './settings-integration-3-layouts.tsx'

const WorkspaceApiKeys = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsIntegration3Key[]>('/settings/api-keys'),
    queryKey: ['settings', 'api-keys'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsIntegration3
        {...settingsIntegration3ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsIntegration3
      keys={data}
      onActiveChange={fn()}
      onCopy={fn()}
      onCreate={fn()}
      onKeyAction={fn()}
    />
  )
}

const meta = {
  component: WorkspaceApiKeys,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Integration/Settings3/Usages',
} satisfies Meta<typeof WorkspaceApiKeys>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration3Handlers.keys)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration3Handlers.keysEmpty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration3Handlers.keysError)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration3Handlers.keysPending)
  },
}
