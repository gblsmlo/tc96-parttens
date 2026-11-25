import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsCatalog10Controls,
  settingsCatalog10ControlArgs,
  settingsCatalog10ControlArgTypes,
} from './settings-catalog-10-controls.ts'
import { ComposedSettingsCatalog10 } from './settings-catalog-10-layouts.tsx'

const meta = {
  args: settingsCatalog10ControlArgs,
  argTypes: settingsCatalog10ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog10 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings10/Playground',
} satisfies Meta<SettingsCatalog10Controls>

export default meta

type Story = StoryObj<SettingsCatalog10Controls>

export const Playground: Story = {}
