import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsCatalog5Controls,
  settingsCatalog5ControlArgs,
  settingsCatalog5ControlArgTypes,
} from './settings-catalog-5-controls.ts'
import { ComposedSettingsCatalog5 } from './settings-catalog-5-layouts.tsx'

const meta = {
  args: settingsCatalog5ControlArgs,
  argTypes: settingsCatalog5ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings5/Playground',
} satisfies Meta<SettingsCatalog5Controls>

export default meta

type Story = StoryObj<SettingsCatalog5Controls>

export const Playground: Story = {}
