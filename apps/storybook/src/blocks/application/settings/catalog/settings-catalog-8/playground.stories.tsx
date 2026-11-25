import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsCatalog8Controls,
  settingsCatalog8ControlArgs,
  settingsCatalog8ControlArgTypes,
} from './settings-catalog-8-controls.ts'
import { ComposedSettingsCatalog8 } from './settings-catalog-8-layouts.tsx'

const meta = {
  args: settingsCatalog8ControlArgs,
  argTypes: settingsCatalog8ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings8/Playground',
} satisfies Meta<SettingsCatalog8Controls>

export default meta

type Story = StoryObj<SettingsCatalog8Controls>

export const Playground: Story = {}
