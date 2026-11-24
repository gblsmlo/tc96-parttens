import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings5 } from '@tc96/blocks/application/settings/settings-5'
import { fn } from 'storybook/test'
import { timeZones, workspace } from '../fixtures/settings-5.ts'

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
  component: Settings5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings5/API Reference',
} satisfies Meta<typeof Settings5>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
