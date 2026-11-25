import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsAccount1Controls,
  settingsAccount1ControlArgs,
  settingsAccount1ControlArgTypes,
} from './settings-account-1-controls.ts'
import { ComposedSettingsAccount1 } from './settings-account-1-layouts.tsx'

const meta = {
  args: settingsAccount1ControlArgs,
  argTypes: settingsAccount1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsAccount1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Account/Settings1/Playground',
} satisfies Meta<SettingsAccount1Controls>

export default meta

type Story = StoryObj<SettingsAccount1Controls>

export const Playground: Story = {}
