import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsAccount2Controls,
  settingsAccount2ControlArgs,
  settingsAccount2ControlArgTypes,
} from './settings-account-2-controls.ts'
import { ComposedSettingsAccount2 } from './settings-account-2-layouts.tsx'

const meta = {
  args: settingsAccount2ControlArgs,
  argTypes: settingsAccount2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsAccount2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Account/Settings2/Playground',
} satisfies Meta<SettingsAccount2Controls>

export default meta

type Story = StoryObj<SettingsAccount2Controls>

export const Playground: Story = {}
