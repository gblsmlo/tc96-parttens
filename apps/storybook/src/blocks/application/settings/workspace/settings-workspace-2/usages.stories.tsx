import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { SettingsWorkspace2 } from '@tc96/ui/blocks/application/settings/workspace/settings-workspace-2'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsWorkspace2Handlers } from '../../../../../mocks/settings-workspace-2.ts'
import {
  roles,
  type SettingsWorkspace2Team,
  seats,
} from '../../fixtures/settings-workspace-2.ts'
import { settingsWorkspace2ControlArgs } from './settings-workspace-2-controls.ts'
import { ComposedSettingsWorkspace2 } from './settings-workspace-2-layouts.tsx'

const TeamMembers = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsWorkspace2Team>('/settings/members'),
    queryKey: ['settings', 'members'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsWorkspace2
        {...settingsWorkspace2ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsWorkspace2
      invitations={data.invitations}
      members={data.members}
      onInvitationAction={fn()}
      onInvite={fn()}
      onMemberAction={fn()}
      onRoleChange={fn()}
      roles={roles}
      seats={seats}
    />
  )
}

const meta = {
  component: TeamMembers,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Workspace/Settings2/Usages',
} satisfies Meta<typeof TeamMembers>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsWorkspace2Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsWorkspace2Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsWorkspace2Handlers.pending)
  },
}
