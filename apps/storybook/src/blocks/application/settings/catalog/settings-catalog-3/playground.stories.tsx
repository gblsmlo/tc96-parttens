import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsCatalog3Controls,
  settingsCatalog3ControlArgs,
  settingsCatalog3ControlArgTypes,
} from './settings-catalog-3-controls.ts'
import { ComposedSettingsCatalog3 } from './settings-catalog-3-layouts.tsx'

const meta = {
  args: settingsCatalog3ControlArgs,
  argTypes: settingsCatalog3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings3/Playground',
} satisfies Meta<SettingsCatalog3Controls>

export default meta

type Story = StoryObj<SettingsCatalog3Controls>

export const Playground: Story = {}
