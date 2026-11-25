import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconLabelCanvas } from './icon-label-canvas.tsx'
import {
  type IconLabelControls,
  iconLabelControlArgs,
  iconLabelControlArgTypes,
} from './icon-label-controls.ts'
import { ComposedIconLabel } from './icon-label-layouts.tsx'

const meta = {
  args: iconLabelControlArgs,
  argTypes: iconLabelControlArgTypes,
  decorators: [IconLabelCanvas],
  render: (args) => <ComposedIconLabel {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/IconLabel/Playground',
} satisfies Meta<IconLabelControls>

export default meta

type Story = StoryObj<IconLabelControls>

export const Playground: Story = {}
