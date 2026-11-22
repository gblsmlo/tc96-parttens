import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneCanvas } from './phone-canvas.tsx'
import {
  type PhoneControls,
  phoneControlArgs,
  phoneControlArgTypes,
} from './phone-controls.ts'
import { ComposedPhone } from './phone-layouts.tsx'

const meta = {
  args: phoneControlArgs,
  argTypes: phoneControlArgTypes,
  decorators: [PhoneCanvas],
  render: (args) => <ComposedPhone {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone/Playground',
} satisfies Meta<PhoneControls>

export default meta

type Story = StoryObj<PhoneControls>

export const Playground: Story = {}
