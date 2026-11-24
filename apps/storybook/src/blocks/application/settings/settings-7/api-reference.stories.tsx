import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings7 } from '@tc96/blocks/application/settings/settings-7'
import { fn } from 'storybook/test'
import { tags } from '../fixtures/tags.ts'

const meta = {
  args: { onCreate: fn(), onTagAction: fn(), tags },
  component: Settings7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings7/API Reference',
} satisfies Meta<typeof Settings7>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
