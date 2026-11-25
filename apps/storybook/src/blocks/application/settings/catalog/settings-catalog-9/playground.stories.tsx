import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsCatalog9Controls,
  settingsCatalog9ControlArgs,
  settingsCatalog9ControlArgTypes,
} from './settings-catalog-9-controls.ts'
import { ComposedSettingsCatalog9 } from './settings-catalog-9-layouts.tsx'

const meta = {
  args: settingsCatalog9ControlArgs,
  argTypes: settingsCatalog9ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings9/Playground',
} satisfies Meta<SettingsCatalog9Controls>

export default meta

type Story = StoryObj<SettingsCatalog9Controls>

export const Playground: Story = {}
