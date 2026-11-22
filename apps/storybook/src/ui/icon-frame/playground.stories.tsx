import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type IconFrameControls,
  iconFrameControlArgs,
  iconFrameControlArgTypes,
} from './icon-frame-controls.ts'
import { ComposedIconFrame } from './icon-frame-layouts.tsx'

const meta = {
  args: iconFrameControlArgs,
  argTypes: iconFrameControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedIconFrame {...args} />,
  tags: ['!autodocs'],
  title: 'UI/IconFrame/Playground',
} satisfies Meta<IconFrameControls>

export default meta

type Story = StoryObj<IconFrameControls>

export const Playground: Story = {}
