import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog1 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-1'
import { fn } from 'storybook/test'
import { tags } from '../../fixtures/tags.ts'

const meta = {
  args: { onCreate: fn(), onTagAction: fn(), tags },
  component: SettingsCatalog1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Settings/Catalog/Settings1/API Reference',
} satisfies Meta<typeof SettingsCatalog1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
