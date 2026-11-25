import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsCatalog6Controls,
  settingsCatalog6ControlArgs,
  settingsCatalog6ControlArgTypes,
} from './settings-catalog-6-controls.ts'
import { ComposedSettingsCatalog6 } from './settings-catalog-6-layouts.tsx'

const meta = {
  args: settingsCatalog6ControlArgs,
  argTypes: settingsCatalog6ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings6/Playground',
} satisfies Meta<SettingsCatalog6Controls>

export default meta

type Story = StoryObj<SettingsCatalog6Controls>

export const Playground: Story = {}
