import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsCatalog1Controls,
  settingsCatalog1ControlArgs,
  settingsCatalog1ControlArgTypes,
} from './settings-catalog-1-controls.ts'
import { ComposedSettingsCatalog1 } from './settings-catalog-1-layouts.tsx'

const meta = {
  args: settingsCatalog1ControlArgs,
  argTypes: settingsCatalog1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings1/Playground',
} satisfies Meta<SettingsCatalog1Controls>

export default meta

type Story = StoryObj<SettingsCatalog1Controls>

export const Playground: Story = {}
