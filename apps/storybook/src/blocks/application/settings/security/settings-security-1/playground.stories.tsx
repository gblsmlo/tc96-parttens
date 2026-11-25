import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SettingsSecurity1Controls,
  settingsSecurity1ControlArgs,
  settingsSecurity1ControlArgTypes,
} from './settings-security-1-controls.ts'
import { ComposedSettingsSecurity1 } from './settings-security-1-layouts.tsx'

const meta = {
  args: settingsSecurity1ControlArgs,
  argTypes: settingsSecurity1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsSecurity1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Security/Settings1/Playground',
} satisfies Meta<SettingsSecurity1Controls>

export default meta

type Story = StoryObj<SettingsSecurity1Controls>

export const Playground: Story = {}
