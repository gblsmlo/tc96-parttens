import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { SettingsWorkspace1 } from '@tc96/ui/blocks/application/settings/workspace/settings-workspace-1'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsWorkspace1Handlers } from '../../../../../mocks/settings-workspace-1.ts'
import {
  type SettingsWorkspace1Workspace,
  timeZones,
} from '../../fixtures/settings-workspace-1.ts'
import { settingsWorkspace1ControlArgs } from './settings-workspace-1-controls.ts'
import { ComposedSettingsWorkspace1 } from './settings-workspace-1-layouts.tsx'

const WorkspaceSettings = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<SettingsWorkspace1Workspace>('/settings/workspace'),
    queryKey: ['settings', 'workspace'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsWorkspace1
        {...settingsWorkspace1ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsWorkspace1
      initials={data.initials}
      name={data.name}
      onDeleteWorkspace={fn()}
      onNameCommit={fn()}
      onSlugCommit={fn()}
      onTimeZoneChange={fn()}
      onUploadLogo={fn()}
      slug={data.slug}
      timeZone={data.timeZone}
      timeZones={timeZones}
    />
  )
}

const meta = {
  component: WorkspaceSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Workspace/Settings1/Usages',
} satisfies Meta<typeof WorkspaceSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsWorkspace1Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsWorkspace1Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsWorkspace1Handlers.pending)
  },
}
