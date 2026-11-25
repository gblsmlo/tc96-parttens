import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsCatalog2Controls,
  settingsCatalog2ControlArgs,
  settingsCatalog2ControlArgTypes,
} from './settings-catalog-2-controls.ts'
import { ComposedSettingsCatalog2 } from './settings-catalog-2-layouts.tsx'

const meta = {
  args: settingsCatalog2ControlArgs,
  argTypes: settingsCatalog2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings2/Playground',
} satisfies Meta<SettingsCatalog2Controls>

export default meta

type Story = StoryObj<SettingsCatalog2Controls>

export const Playground: Story = {}
