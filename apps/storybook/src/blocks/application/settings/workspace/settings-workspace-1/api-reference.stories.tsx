import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsWorkspace1 } from '@tc96/ui/blocks/application/settings/workspace/settings-workspace-1'
import { fn } from 'storybook/test'
import { timeZones, workspace } from '../../fixtures/settings-workspace-1.ts'

const meta = {
  args: {
    initials: workspace.initials,
    name: workspace.name,
    onDeleteWorkspace: fn(),
    onNameCommit: fn(),
    onSlugCommit: fn(),
    onTimeZoneChange: fn(),
    onUploadLogo: fn(),
    slug: workspace.slug,
    timeZone: workspace.timeZone,
    timeZones,
  },
  component: SettingsWorkspace1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Workspace/Settings1/API Reference',
} satisfies Meta<typeof SettingsWorkspace1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
