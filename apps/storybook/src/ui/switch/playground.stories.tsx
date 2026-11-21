import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SwitchControls,
  switchControlArgs,
  switchControlArgTypes,
} from './switch-controls.ts'
import { ComposedSwitch } from './switch-layouts.tsx'

const meta = {
  args: switchControlArgs,
  argTypes: switchControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedSwitch key={String(args.checked)} {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Switch/Playground',
} satisfies Meta<SwitchControls>

export default meta

type Story = StoryObj<SwitchControls>

export const Playground: Story = {}
