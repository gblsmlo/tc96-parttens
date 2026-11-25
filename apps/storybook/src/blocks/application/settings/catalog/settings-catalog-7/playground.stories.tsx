import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsCatalog7Controls,
  settingsCatalog7ControlArgs,
  settingsCatalog7ControlArgTypes,
} from './settings-catalog-7-controls.ts'
import { ComposedSettingsCatalog7 } from './settings-catalog-7-layouts.tsx'

const meta = {
  args: settingsCatalog7ControlArgs,
  argTypes: settingsCatalog7ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings7/Playground',
} satisfies Meta<SettingsCatalog7Controls>

export default meta

type Story = StoryObj<SettingsCatalog7Controls>

export const Playground: Story = {}
