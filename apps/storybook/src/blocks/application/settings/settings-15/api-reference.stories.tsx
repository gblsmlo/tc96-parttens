import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings15 } from '@tc96/ui/blocks/application/settings/settings-15'
import { fn } from 'storybook/test'
import {
  settings15ArchivedCategories,
  settings15Categories,
} from '../fixtures/settings-15.ts'

const meta = {
  args: {
    archivedCategories: settings15ArchivedCategories,
    categories: settings15Categories,
    onCategoryAction: fn(),
    onCreate: fn(),
  },
  component: Settings15,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Settings15/API Reference',
} satisfies Meta<typeof Settings15>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
