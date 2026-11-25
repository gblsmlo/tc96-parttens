import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsCatalog4Controls,
  settingsCatalog4ControlArgs,
  settingsCatalog4ControlArgTypes,
} from './settings-catalog-4-controls.ts'
import { ComposedSettingsCatalog4 } from './settings-catalog-4-layouts.tsx'

const meta = {
  args: settingsCatalog4ControlArgs,
  argTypes: settingsCatalog4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings4/Playground',
} satisfies Meta<SettingsCatalog4Controls>

export default meta

type Story = StoryObj<SettingsCatalog4Controls>

export const Playground: Story = {}
