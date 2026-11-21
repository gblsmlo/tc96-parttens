import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SeparatorControls,
  separatorControlArgs,
  separatorControlArgTypes,
} from './separator-controls.ts'
import { SeparatorCanvas } from './separator-frame.tsx'
import { ComposedSeparator } from './separator-layouts.tsx'

const meta = {
  args: separatorControlArgs,
  argTypes: separatorControlArgTypes,
  decorators: [SeparatorCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedSeparator {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Separator/Playground',
} satisfies Meta<SeparatorControls>

export default meta

type Story = StoryObj<SeparatorControls>

export const Playground: Story = {}
